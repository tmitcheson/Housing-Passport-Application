import requests
import pandas as pd

def consumption_calulator(energy_type, mpn, serial_number, auth_api):

    url = "https://api.octopus.energy/v1/" + energy_type + "-meter-points/" + mpn + "/meters/" + serial_number + "/consumption/"
    auth=(auth_api, '')
    params = {"page_size": 25000}
    # params = {"page_size": 10000, "period_from": "2022-06-26T00:00:00Z", "period_to": "2022-07-26T00:00:00Z"}

    response = requests.get(url, auth=auth, params=params)
    # response = requests.get(url, auth=auth)

    response_data = response.json()
    results = response_data['results']
    results_df = pd.DataFrame.from_records(results)

    consumption_total = results_df['consumption'].sum()
    return results_df, consumption_total


trial_auth = 'sk_live_F6fSk8HDazIy7wKmWnWA3tD9'
trial_mpan = '1200038779673'
trial_serial_elec = 'Z18N333768'

trial_mprn = '511319507'
trial_serial_gas = 'E6S17789941861'

elec_df, elec_cons_sum = consumption_calulator('electricity',
                                             trial_mpan,
                                             trial_serial_elec, 
                                             trial_auth)
gas_df, gas_cons_sum = consumption_calulator('gas', 
                                            trial_mprn, 
                                            trial_serial_gas, 
                                            trial_auth)

print(elec_df)
print(elec_cons_sum)
print(gas_df)
print(gas_cons_sum)

# total_energy_annual = (elec_cons_sum + gas_cons_sum)/91
# total_energy_so_far = total_energy_annual * (12/7)
# print(total_energy_so_far)

