import pymongo
import requests
import json
from requests.structures import CaseInsensitiveDict


def addEPCDataToUser(epc_data, email):

    lmk_key = epc_data['LMK_KEY']
    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"
    # headers["Accept"] = "text/csv"
    headers["Authorization"] = "Basic dGJtaXRjaGVzb25AZ21haWwuY29tOjQ5NmRkMDcxZjhjOWY5NTM0YTNiYmM1ZDYyYmE4YjlkMWRlMmFmMzY="
    rec_url = "https://epc.opendatacommunities.org/api/v1/domestic/recommendations/" + lmk_key
    resp = requests.get(rec_url, headers=headers)
    recommendations = json.loads(resp.text)
    recommendations = recommendations['rows']
    
    recs = []
    for rec in recommendations:
        recs.append([rec['improvement-id-text'], rec['indicative-cost']])


    conn_str = "mongodb+srv://tm21:JfOxlkRhEeIN1ZvB@UserStore.rldimmu.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    try:
        client.server_info()
        print("Connected...")
    except Exception as e:
        print(e)
        print("Unable to connect to the server.")

    try:
        client['db-name'].users.update_one(
            {"email":email},
            # {"$push": {"properties."+ epc_data['ADDRESS']: epc_data }}
            {"$push": {"properties" : {"address": epc_data['ADDRESS'], "content": epc_data, "recommendations":recs} }}
        )
        return True
    except Exception as e:
        print(e)
        return False

    # try:
    #     client['db-name'].users.update_one(
    #         {"email": email},
    #         {"$set": {"properties": epc_data}}
    #     )
    #     return True

