import pandas as pd
from dateutil import parser

# totalFloorArea = 38
# totalFloorArea = 207
totalFloorArea = 83.58
# totalFloorArea = 118
# totalFloorArea = 163
# totalFloorArea = 98

def account_for_missing_values(df):
    print(df.shape)
    print(df.columns)
    end_date = df.iloc[0, df.columns.get_loc(' End')]
    start_date = df.iloc[df[df.columns[0]].count() - 1, df.columns.get_loc(' Start')]
    print(start_date)
    print(end_date)
    end_date_obj = parser.parse(end_date)
    start_date_obj = parser.parse(start_date)

    difference = start_date_obj - end_date_obj
    total_slots = difference.total_seconds()/60/30
    recorded_slots = df[df.columns[0]].count()

    print(total_slots)
    print(recorded_slots)
    missing_slots = total_slots - recorded_slots 
    print(missing_slots)

    recorded_consumption = df.iloc[:,0].sum()

    print("\n")
    print(recorded_consumption)
    actual_consumption = (total_slots/recorded_slots) * recorded_consumption
    print(actual_consumption)

    return actual_consumption, total_slots

# elec_df = pd.read_csv("/home/tbmitcheson/housing-passport-app/housing-passport-back-end/ConsumptionData/consumption - Karl Reynolds.csv")
# gas_df = pd.read_csv("/home/tbmitcheson/housing-passport-app/housing-passport-back-end/ConsumptionData/consumption gas - Karl Reynolds.csv")
# elec_df = pd.read_csv("/home/tbmitcheson/housing-passport-app/housing-passport-back-end/ConsumptionData/electricity-Usage - Richard Goodyear.csv")
# gas_df = pd.read_csv("/home/tbmitcheson/housing-passport-aspp/housing-passport-back-end/ConsumptionData/gas-consumption - Richard Goodyear.csv")
# elec_df = pd.read_csv("/home/tbmitcheson/housing-passport-app/housing-passport-back-end/ConsumptionData/consumption (20) - Jerry Watson.csv")
# gas_df = pd.read_csv("/home/tbmitcheson/housing-passport-app/housing-passport-back-end/ConsumptionData/consumption (21) - Jerry Watson.csv")
# elec_df = pd.read_csv("/home/tbmitcheson/housing-passport-app/housing-passport-back-end/ConsumptionData/consumption(1) - Philip Bradley.csv")
elec_df = pd.read_csv("/home/tbmitcheson/housing-passport-app/housing-passport-back-end/ConsumptionData/consumption (3) - Paul Stapleton.csv")

print(elec_df)
# print(gas_df)

elec_real_consumption, elec_total_slots = account_for_missing_values(elec_df)
# gas_real_consumption, gas_total_slots = account_for_missing_values(gas_df)

TIME_SLOTS_PER_YEAR = 365.25 * 48

print("elec real consumption and total slots:")
print(elec_real_consumption)
print(elec_total_slots)
print("\n")

elec_real_consumption_per_year = elec_real_consumption * (TIME_SLOTS_PER_YEAR/elec_total_slots)
print("elec_real_consumption_per_year:")
print(elec_real_consumption_per_year)
print("\n")

# print("gas real consumption and total slots:")
# print(gas_real_consumption)
# print(gas_total_slots)
# print("\n")

# gas_real_consumption_per_year = gas_real_consumption * (TIME_SLOTS_PER_YEAR/gas_total_slots)
# print("gas_real_consumption_per_year:")
# print(gas_real_consumption_per_year)
# print("\n")

print("total floor area: ")
print(totalFloorArea)
print("\n")

print("total consumption per m2:")
# total_consumption_per_m2 = (elec_real_consumption_per_year + gas_real_consumption_per_year)/totalFloorArea
total_consumption_per_m2 = (elec_real_consumption_per_year)/totalFloorArea
total_consumption_per_m2 = (elec_real_consumption_per_year + 10350)/totalFloorArea
print(total_consumption_per_m2)
print("\n")