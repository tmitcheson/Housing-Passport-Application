import requests
import pandas as pd
from dateutil import parser
import datetime

def consumption_retriever(energy_type, mpn, serial_number, auth_api):

    url = "https://api.octopus.energy/v1/" + energy_type + "-meter-points/" + mpn + "/meters/" + serial_number + "/consumption/"
    auth=(auth_api, '')
    # params = {"page_size": 25000}
    params = {"page_size": 25000, "period_from": "2021-06-01T00:00:00Z", "period_to": "2022-08-01T00:00:00Z"}

    response = requests.get(url, auth=auth, params=params)
    # response = requests.get(url, auth=auth)
    response_data = response.json()
    results = response_data['results']
    results_df = pd.DataFrame.from_records(results)
    print(results_df)
    return results_df


trial_auth = 'sk_live_F6fSk8HDazIy7wKmWnWA3tD9'
trial_mpan = '1200038779673'
trial_serial_elec = 'Z18N333768'

trial_mprn = '511319507'
trial_serial_gas = 'E6S17789941861'

elec_df = consumption_retriever('electricity',
                                trial_mpan,
                                trial_serial_elec, 
                                trial_auth)
gas_df = consumption_retriever('gas', 
                                trial_mprn, 
                                trial_serial_gas, 
                                trial_auth)

def account_for_missing_values(df):
    end_date = df.iloc[0, df.columns.get_loc('interval_start')]
    start_date = df.iloc[df[df.columns[0]].count() - 1, df.columns.get_loc('interval_start')]

    end_date_obj = parser.parse(end_date)
    start_date_obj = parser.parse(start_date)

    difference = end_date_obj - start_date_obj
    total_slots = difference.total_seconds()/60/30
    recorded_slots = df[df.columns[0]].count()

    missing_slots = total_slots - recorded_slots 

    recorded_consumption = df['consumption'].sum()
    actual_consumption = (total_slots/recorded_slots) * recorded_consumption

    return actual_consumption, total_slots


# elec_real_consumption = account_for_missing_values(elec_df)
# gas_real_consumption = account_for_missing_values(gas_df)

# print(elec_real_consumption)
# print(gas_real_consumption)

# total_consumption = (elec_real_consumption + gas_real_consumption)/91
# print("Total electric and gas for 7 months per m^2: " + str(total_consumption))
# print("And therefore for 12 months: " + str(total_consumption * (12/7)))


# url = "https://api.octopus.energy/v1/products/AGILE-18-02-21/electricity-tariffs/E-1R-AGILE-18-02-21-C/standard-unit-rates/?period_from=2022-03-28T00:00Z&period_to=2022-03-29T01:29Z"
# response = requests.get(url)
# response_data = response.json()
# # print("prices: ")
# print(response_data)

