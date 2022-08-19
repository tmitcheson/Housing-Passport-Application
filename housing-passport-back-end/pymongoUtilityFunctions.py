import pymongo
import requests
import json
from requests.structures import CaseInsensitiveDict

USERS_CONNECTION_STRING = "mongodb+srv://tm21:JfOxlkRhEeIN1ZvB@UserStore.rldimmu.mongodb.net/?retryWrites=true&w=majority"
PROPERTIES_CONNECTION_STRING = "mongodb+srv://tm21:TomM7802@housingpassportcluster.wufr0o8.mongodb.net/?retryWrites=true&w=majority"

def connectToUsers():
    client = pymongo.MongoClient(USERS_CONNECTION_STRING, serverSelectionTimeoutMS=5000)
    return client

def connectToProperties():
    client = pymongo.MongoClient(PROPERTIES_CONNECTION_STRING, serverSelectionTimeoutMS=5000)
    return client

def checkConnection(client):
    try:
        client.server_info()
        print("Connected...")
    except Exception as e:
        print(e)
        print("Unable to connect to the server.")

def addTradesPersonToProperty(client, homeownerEmail, tradeEmail, address):

    try:
        client['db-name'].users.update_one(
            {"email":homeownerEmail, "properties.address":address},
            {"$push": {"properties.$.tradespeople":tradeEmail}}
        )
        return "True"
    except Exception as e:
        print(e)
        return "False"

def addEPCDataToUser(epc_data, email):

    lmk_key = epc_data['LMK_KEY']
    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"
    headers["Authorization"] = "Basic dGJtaXRjaGVzb25AZ21haWwuY29tOjQ5NmRkMDcxZjhjOWY5NTM0YTNiYmM1ZDYyYmE4YjlkMWRlMmFmMzY="
    rec_url = "https://epc.opendatacommunities.org/api/v1/domestic/recommendations/" + lmk_key
    resp = requests.get(rec_url, headers=headers)
    recommendations = json.loads(resp.text)
    recommendations = recommendations['rows']
    
    recs = []
    for rec in recommendations:
        recs.append([rec['improvement-id-text'], rec['indicative-cost']])

    conn_str = USERS_CONNECTION_STRING
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
            {"$push": {"properties" : {"address": epc_data['ADDRESS'], 
                                        "content": epc_data,
                                        "recommendations":recs} }}
        )
        return True
    except Exception as e:
        print(e)
        return False


def addEPCDataToTradesperson(client, epc_data, email, public, private):

    lmk_key = epc_data['LMK_KEY']
    headers = CaseInsensitiveDict()
    headers["Accept"] = "application/json"
    headers["Authorization"] = "Basic dGJtaXRjaGVzb25AZ21haWwuY29tOjQ5NmRkMDcxZjhjOWY5NTM0YTNiYmM1ZDYyYmE4YjlkMWRlMmFmMzY="
    rec_url = "https://epc.opendatacommunities.org/api/v1/domestic/recommendations/" + lmk_key
    resp = requests.get(rec_url, headers=headers)
    recommendations = json.loads(resp.text)
    recommendations = recommendations['rows']
    
    recs = []
    for rec in recommendations:
        recs.append([rec['improvement-id-text'], rec['indicative-cost']])

    try:
        client['db-name'].users.update_one(
            {"email":email},
            {"$push": {"properties" : {"address": epc_data['ADDRESS'], 
                                        "content": epc_data,
                                        "recommendations":recs,
                                        "public_retrofits":public,
                                        "private_retrofits":private
                                        } }}
        )
        return True
    except Exception as e:
        print(e)
        return False

def getListOfTradesPeopleForProperty(client, email, address):

    cursor = client['db-name'].users.find_one(
        {"email": email})
    tradies = []
    try:
        for prop in cursor['properties']:
            if(address == prop['address']):
                tradies = prop['tradespeople']
        # print(cursor['properties']address)
    except Exception as e:
        print(e)
    print(tradies)

    return tradies
