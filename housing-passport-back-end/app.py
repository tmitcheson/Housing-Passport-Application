from flask import Flask
from flask import request, make_response, Flask, jsonify
from flask_cors import CORS
import pymongo
import json
import numpy as np
import math
import requests

from findDataFromLMK import findDataFromLMK
from getMyProperty import getMyProperty
from smart_meter import consumption_retriever, account_for_missing_values
from pymongoUtilityFunctions import addTradesPersonToProperty, addEPCDataToUser, addEPCDataToTradesperson, connectToProperties, connectToUsers, checkConnection, getListOfTradesPeopleForProperty
from neighboursUtilityFunctions import fromBuiltFormToPropType, fromFloorAreaToBand, fromPostcodeToRegion, fromAgeToAgeBand
from NEED2 import RadNeighbours

def fromRequestToJSON(request):
    data = request.data
    data = data.decode('utf-8')
    data = data.replace("\\", "")
    data = json.loads(data)
    return data


app = Flask(__name__)

CORS(app)
# CORS(app, resources=r'/api/*')

@app.route("/")
def index():
    conn_str = "mongodb+srv://tm21:TomM7802@housingpassportcluster.wufr0o8.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    try:
        client.server_info()
        print("Connected...")
    except Exception:
        print("Unable to connect to the server.")

    passports = client.business

    cursor = passports.passports.find_one({"LMK_KEY": "1654224369042018080815343759980988"})

    return str(cursor)

@app.route("/api/add_property_to_user", methods=["POST"])
def retrieve_doc():
    data = fromRequestToJSON(request)

    data = data['data']
    lmk_key = data['lmk_key']
    email = data['email']
    print(data)

    epc_data = findDataFromLMK(lmk_key)
    success = addEPCDataToUser(epc_data, email)

    if(success == True):
        return 'True'
    return 'False'

@app.route("/api/extend_permissions_to_tradesperson", methods=["POST"])
def extend_permissions_to_tradesperson():

    data = fromRequestToJSON(request)

    data = data['data']
    public_retrofits = []
    private_retrofits = []
    lmk_key = data['lmk_key']
    tradeEmail = data['tradeEmail']
    homeownerEmail = data['homeownerEmail']

    try:
        public_retrofits = data['public_retrofits']
    except Exception as e:
        print(e)
    try:
        private_retrofits = data['private_retrofits']
    except Exception as e:
        print(e)

    epc_data = findDataFromLMK(lmk_key)

    client = connectToUsers()
    checkConnection(client)

    success1 = addTradesPersonToProperty(client, homeownerEmail, tradeEmail, epc_data['ADDRESS'])
    success2 = addEPCDataToTradesperson(client, epc_data, tradeEmail, public_retrofits, private_retrofits)

    if(success1 and success2):
        return 'True'
    return 'False'

@app.route("/api/delete_property_from_user", methods=["POST"])
def delete_property():

    data = fromRequestToJSON(request)

    address = data["address"]
    email = data["email"]

    client = connectToUsers()
    checkConnection(client)

    try:
        client['db-name'].users.update_one(
            {"email":email},
            {"$pull": {"properties" : {"address":address}}}
        )
        return "True"
    except Exception as e:
        print(e)
        return "False"


@app.route("/api/get_list_of_addresses", methods=["POST"])
def retrieve_addresses():
    data = fromRequestToJSON(request)
    data = data['data']
    postcode = data['postcode']

    client = connectToProperties()
    checkConnection(client)

    passports = client.business

    cursor = passports.passports.find({"POSTCODE": postcode}).sort('ADDRESS1', pymongo.ASCENDING)
    print(type(cursor))
    list_of_addresses = {}
    for record in cursor:
        lmk_key = record['LMK_KEY']
        address1 = record['ADDRESS1']
        list_of_addresses[address1] = lmk_key
    return list_of_addresses

@app.route("/api/get_a_doc", methods=["POST"])
def get_a_doc():
    data = fromRequestToJSON(request)
    lmk_key = data['lmk_key']

    conn_str = "mongodb+srv://tm21:TomM7802@housingpassportcluster.wufr0o8.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)
    try:
        client.server_info()
        print("Connected...")
    except Exception:
        print("Unable to connect to the server.")

    passports = client.business
    document = passports.passports.find_one({"LMK_KEY": lmk_key})
    del document['_id']

    return document


@app.route("/api/get_my_property", methods=["POST"])
def get_my_property():
    data = fromRequestToJSON(request)
    email = data['data']
    
    epc_data = getMyProperty(email)

    return epc_data

@app.route("/api/get_list_of_tradespeople", methods=["POST"])
def get_list_of_tradespeople():

    conn_str = "mongodb+srv://tm21:JfOxlkRhEeIN1ZvB@UserStore.rldimmu.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    try:
        client.server_info()
        print("Connected...")
    except Exception as e:
        print(e)
        print("Unable to connect to the server.")

    try:
        users = client['db-name'].users
        cursor = users.find({"user_metadata.role": "tradesperson"})
    except:
        print(e)

    tradespeople = {}
    for entry in cursor:
        clientID = entry['client_id']
        tradespeople[clientID] = entry['email']

    return tradespeople

@app.route("/api/retrieve_my_properties", methods=["POST"])
def retrieve_my_properties():

    data = fromRequestToJSON(request)
    print(data)
    email = data['email']

    conn_str = "mongodb+srv://tm21:JfOxlkRhEeIN1ZvB@UserStore.rldimmu.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    try:
        client.server_info()
        print("Connected...")
    except Exception as e:
        print(e)
        print("Unable to connect to the server.")

    try:
        users = client['db-name'].users
        # epc_data = users.find_one({"email": email},{"properties":1})
        epc_data = users.find_one({"email": email})
        del epc_data['_id']
        epc_data = epc_data['properties']
        epc_data = jsonify(epc_data)
        print(epc_data)

        return epc_data

    except Exception as e:
        print(e)
        return e

@app.route("/api/update_retrofit_no_share", methods=["POST"])
def update_retrofit_no_share():

    data = fromRequestToJSON(request)

    retrofit = data['retrofit']
    email = data['email']
    address = data['address']

    client = connectToUsers()
    checkConnection(client)

    tradies = getListOfTradesPeopleForProperty(client, email, address)

    ''' THIS WILL UPDATE EACH OF THE DEPENDENT TRADESPEOPLE'S INFO '''
    if(tradies):
        for tradesperson in tradies:
                try:
                    client['db-name'].users.update_one(
                        {"email":tradesperson, "properties.address":address },
                        {"$push": {"properties.$.private_retrofits":retrofit}}
                    )
                except Exception as e:
                    print(e)
                    return 'False'

    ''' THIS WILL UPDATE THE USER THEMSELVES' INFO '''
    try:
        client['db-name'].users.update_one(
            {"email":email, "properties.address":address },
            {"$push": {"properties.$.private_retrofits":retrofit}}
        )
        return 'True'
    except Exception as e:
        print(e)
        return 'False'

@app.route("/api/update_retrofit_share", methods=["POST"])
def update_retrofit_share():
    data = fromRequestToJSON(request)

    retrofit = data['retrofit']
    cost = data['cost']
    lmk_key = data['lmk_key']
    address = data['address']
    email = data['email']

    print(data)

    client = connectToProperties()
    checkConnection(client)

    ''' FIRST UPDATE THE PUBLIC DATABASE '''
    passports = client.business.passports
    try:
        passports.update_one(
            {"LMK_KEY": lmk_key},
            {"$push":{"retrofits":[retrofit, cost]}}
        )
    except Exception as e:
        print(e)
        return 'False'

    client = connectToUsers()
    checkConnection(client)

    ''' THEN UPDATE THE USER'''
    try:
        client['db-name'].users.update_one(
            {"email":email, "properties.address":address },
            {"$push": {"properties.$.public_retrofits":retrofit}}
        )
    except Exception as e:
        print(e)
        return 'False'

    ''' THEN UPDATE THE DEPENDENT TRADESPEOPLE'''
    tradies = getListOfTradesPeopleForProperty(client, email, address)
    if(tradies):
        for tradesperson in tradies:
            try:
                client['db-name'].users.update_one(
                    {"email":tradesperson, "properties.address":address },
                    {"$push": {"properties.$.public_retrofits":retrofit}}
                )
            except Exception as e:
                print(e)
                return 'False'

    return 'True'
 
@app.route("/api/retrieve_my_retrofits", methods=["POST"])
def retrieve_my_retrofits():
    data = fromRequestToJSON(request)

    email = data['email']
    address = data['address']

    client = connectToUsers()
    checkConnection(client)

    try:
        profile = client['db-name'].users.find_one({"email":email})
        properties = profile['properties']
        for prop in properties:
            if(prop['address'] == address):
                try:
                    retrofits = jsonify(prop['retrofits'])
                    return retrofits
                except:
                    return "no retrofits"
    except Exception as e:
        print(e)
        return e

    return "no retrofits"



@app.route("/api/check_accuracy", methods=["POST"])
def check_accuracy():
    data = fromRequestToJSON(request)
    print(data) 

    lmk_key = data['lmk_key']   
    mpan = data['mpan']   
    serialElec = data['serialElec']   
    mprn = data['mprn']   
    serialGas = data['serialGas']   
    authKey = data['authKey']   
    totalFloorArea = data['totalFloorArea']

    print(mpan)
    print(serialElec)
    print(authKey)

    try:
        elec_df = consumption_retriever('electricity',
                                    mpan,
                                    serialElec,
                                    authKey)
    except Exception as e:
        return e
    
    try:
        gas_df = consumption_retriever('gas',
                                    mprn,
                                    serialGas,
                                    authKey)
    except Exception as e:
        return e

    # print(elec_df)
    # print(gas_df)

    elec_real_consumption, elec_total_slots = account_for_missing_values(elec_df)
    gas_real_consumption, gas_total_slots = account_for_missing_values(gas_df)

    TIME_SLOTS_PER_YEAR = 365.25 * 48

    print("elec real consumption and total slots:")
    print(elec_real_consumption)
    print(elec_total_slots)
    print("\n")

    elec_real_consumption_per_year = elec_real_consumption * (TIME_SLOTS_PER_YEAR/elec_total_slots)
    print("elec_real_consumption_per_year:")
    print(elec_real_consumption_per_year)
    print("\n")
    
    print("gas real consumption and total slots:")
    print(gas_real_consumption)
    print(gas_total_slots)
    print("\n")

    gas_real_consumption_per_year = gas_real_consumption * (TIME_SLOTS_PER_YEAR/gas_total_slots)
    print("gas_real_consumption_per_year:")
    print(gas_real_consumption_per_year)
    print("\n")

    print("total floor area: ")
    print(totalFloorArea)
    print("\n")

    print("total consumption per m2:")
    total_consumption_per_m2 = (elec_real_consumption_per_year + gas_real_consumption_per_year)/totalFloorArea
    print(total_consumption_per_m2)
    print("\n")

    response_data = '{"annualElec":' + str(elec_real_consumption_per_year) + ',"annualGas":' + str(gas_real_consumption_per_year) + ',"floorArea":' + str(totalFloorArea) + ',"result":' + str(total_consumption_per_m2) + '}'

    print(response_data)
    response_json = json.loads(response_data)
    print(response_json)

    return response_json

@app.route("/api/compare_property", methods=["POST"])
def compare_property():
    data = fromRequestToJSON(request)
    print(data)
    builtForm = data['builtForm']
    age = data['age']
    postcode = data['postcode']
    floorArea = data['floorArea']

    propType = fromBuiltFormToPropType(builtForm)
    ageBand = fromAgeToAgeBand(age)
    region = fromPostcodeToRegion(postcode)
    areaBand = fromFloorAreaToBand(floorArea)

    rec_url = "https://findthatpostcode.uk/postcodes/SW11 1PE"
    resp = requests.get(rec_url)

    def find_values(id, json_repr):
        results = []

        def _decode_dict(a_dict):
            try:
                results.append(a_dict[id])
            except KeyError:
                pass
            return a_dict

        json.loads(json_repr, object_hook=_decode_dict) # Return value ignored.
        return results

    arrayAnswer = find_values('imd2019', resp.text)
    imd_decile = arrayAnswer[0]['imd_decile']
    imd = math.ceil(imd_decile/2)

    args = [propType, ageBand, areaBand, imd]
    answer, count = RadNeighbours(args, region)
    print(answer)
    print(region)
    payload = '{"result":' + str(answer) + ',"args":' + str(args) + ',"region":"' + str(region) + '","count":' + count '}'
    print(payload)
    payload_json = json.loads(payload)

    return payload_json

@app.route("/api/private", methods=["GET"])
def private():
    print("hllo")
    response = "Hello from a private endpoint! You need to be authenticated to see this."
    return response


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)

