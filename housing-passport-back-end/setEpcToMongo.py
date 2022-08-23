import pymongo
import pandas as pd
from pymongo.errors import BulkWriteError

conn_str = "mongodb+srv://tm21:TomM7802@housingpassportcluster.wufr0o8.mongodb.net/?retryWrites=true&w=majority"
client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

try:
    print(client.server_info())
except Exception:
    print("Unable to connect to the server.")

db = client.business
# data = pd.read_csv("domestic-E07000116-Tunbridge-Wells/certificates.csv")
data = pd.read_csv("AreaData/domestic-E09000022-Lambeth/certificates.csv")

data = data.fillna(0)
# convert any floats to decimals
# for i in data.columns:
#     datatype = data[i].dtype
#     if datatype == 'float64':
#         data[i] = data[i].apply(float_to_decimal)

print(data)

# db.passports.create_index([('LMK_KEY', pymongo.ASCENDING), ('LODGEMENT_DATE', pymongo.ASCENDING)], unique=True)
try:
    db.passports.insert_many(data.to_dict('records'))
    # db.passports.insert_one(data.to_dict('records')[0])
except BulkWriteError as bwe:
    print(bwe.details)
    print("Already got that record in there!")
# db.members.createIndex( { groupNumber: 1, lastname: 1, firstname: 1 }, { unique: true } )