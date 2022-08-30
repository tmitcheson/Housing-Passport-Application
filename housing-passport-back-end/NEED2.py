import pandas as pd
import pickle
import numpy as np
from sklearn.neighbors import NearestNeighbors, RadiusNeighborsRegressor 

REGIONS = ["E12000001", "E12000002", "E12000003", "E12000004", "E12000005",
    "E12000006", "E12000007", "E12000008", "E12000009"]

# dataset = pd.read_csv("need_2021_anon_dataset_50k (1).csv", on_bad_lines='skip')
# dataset = pd.read_csv("need_2021_anon_dataset_4million.csv", nrows=250000, on_bad_lines='skip')

def RadNeighbours(args, region):
    model = pickle.load(open("RadNeighModels/" + region, 'rb'))

    args = np.array(args).reshape(1,-1)
    result = model.predict(args)
    # print(model.n_samples_fit_)
    # print(model.n_features_in_)
    neigh1, neigh2 = model.radius_neighbors(args, radius=1.0)
    return result, len(neigh2[0])

print(RadNeighbours(args, region))

# ''' MAKE STRING VARIABLES ORDINAL NUMBERS '''

# dataset['PROP_TYPE'] = dataset['PROP_TYPE'].replace(['Detached', 'Semi detached', 'Mid terrace', 'End terrace', 'Bungalow', 'Flat'], [0, 1, 2, 1, 3, 4])

# dataset = dataset[dataset['Gcons2019'].notna()]
# dataset = dataset[dataset['Econs2019'].notna()]

# ''' DROP REDUNDANT COLUMNS '''
# datasetLite = dataset.filter(['PROP_TYPE','PROP_AGE_BAND', 'FLOOR_AREA_BAND', 
#                         'IMD_BAND_ENG', 'REGION'
#                         # 'LI_FLAG', 'CWI_FLAG', 'PV_FLAG'
#                         ,'Gcons2019', 'Econs2019'
#                         ], axis=1)

# ''' CREATE THE MODELS AND PUT THEM IN PKLS '''
# for region in REGIONS:
#     X = datasetLite.loc[datasetLite['REGION'] == region]
#     y = X['Gcons2019'] + X['Econs2019']
#     X2 = X.drop(['Gcons2019', 'Econs2019', 'REGION'], axis=1)
#     neigh = RadiusNeighborsRegressor(radius=1.0)
#     neigh.fit(X2, y)
#     pickle.dump(neigh, open("RadNeighModels/" + region, 'wb'))