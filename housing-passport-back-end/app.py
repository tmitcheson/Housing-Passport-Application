from flask import Flask
from flask import request, make_response, Flask, jsonify
from flask_cors import CORS
import pymongo
import json
import numpy as np

from findDataFromLMK import findDataFromLMK
from addEPCDataToUser import addEPCDataToUser
from getMyProperty import getMyProperty
from smart_meter import consumption_retriever, account_for_missing_values

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
    # return str(request.args)
    # response = app.make_response("helloW")
    # response.headers['Access-Control-Allow-Origin'] = '*'
    data = request.data
    print("for starters: ")
    print(data)
    data = data.decode('utf-8')
    data = data.replace("\\", "")
    print("and again") 
    print(data)
    data = json.loads(data)
    data = data['data']
    lmk_key = data['lmk_key']
    email = data['email']

    epc_data = findDataFromLMK(lmk_key)
    success = addEPCDataToUser(epc_data, email)

    if(success == True):
        return 'True'
    return 'False'

    # response.set_data(str(cursor))
    # return response
    # return (str(returner))

@app.route("/api/delete_property_from_user", methods=["POST"])
def delete_property():
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)

    address = data["address"]
    email = data["email"]
    print(address)
    print(email)

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
            {"$pull": {"properties" : {"address":address}}}
        )
        return "True"
    except Exception as e:
        print(e)
        return "False"


@app.route("/api/get_list_of_addresses", methods=["POST"])
def retrieve_addresses():
    # return str(request.args)
    # response.headers['Access-Control-Allow-Origin'] = '*'
    # return "<p> Hello list </p>"
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)
    data = data['data']
    postcode = data['postcode']
    print(postcode)

    conn_str = "mongodb+srv://tm21:TomM7802@housingpassportcluster.wufr0o8.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    try:
        client.server_info()
        print("Connected...")
    except Exception:
        print("Unable to connect to the server.")

    passports = client.business

    cursor = passports.passports.find({"POSTCODE": postcode}).sort('ADDRESS1', pymongo.ASCENDING)
    print(type(cursor))
    list_of_addresses = {}
    # try:
    #     del cursor['_id']
    # except:
    #     print("house not found")
    for record in cursor:
        lmk_key = record['LMK_KEY']
        address1 = record['ADDRESS1']
        list_of_addresses[address1] = lmk_key
    # print(list_of_addresses)
    return list_of_addresses

@app.route("/api/get_a_doc", methods=["POST"])
def add_property_to_user():
    data = request.data
    data = data.decode('utf-8')
    print("this here is what we're at: " + data)
    data = json.loads(data)
    data = data['data']
    lmk_key = data['lmk_key']
    email = data['email']
    print(email)
    # print(lmk_key)

    conn_str = "mongodb+srv://tm21:TomM7802@housingpassportcluster.wufr0o8.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)
    try:
        client.server_info()
        print("Connected...")
    except Exception:
        print("Unable to connect to the server.")

    passports = client.business
    cursor = passports.passports.find({"LMK_KEY": lmk_key})

    return data
    print("STRINGED" + str(cursor))
    # returner = cursor.next()
    # try:
    #     del returner['_id']
    # except:
    #     print("house not found")
    # # for record in cursor:
    # #     print(record)
    # print(returner)

    # conn_str = "mongodb+srv://tm21:JfOxlkRhEeIN1ZvB@UserStore.wufr0o8.mongodb.net/db-name?retryWrites=true&w=majority"
    # client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    # try:
    #     client.server_info()
    #     print("Connected...")
    # except Exception:
    #     print("Unable to connect to the server.")

    # users = client.users

@app.route("/api/get_my_property", methods=["POST"])
def get_my_property():
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)
    email = data['data']
    
    print("this here is what we're at: " + email)

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

    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)
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
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)
    retrofit = data['retrofit']
    email = data['email']
    address = data['address']
    print(data)

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
            {"email":email, "properties.address":address },
            {"$push": {"properties.$.retrofits":retrofit}}
        )
        return 'True'
    except Exception as e:
        print(e)
        return 'False'

# THIS IS NOT COMPLETE
@app.route("/api/update_retrofit_share", methods=["POST"])
def update_retrofit_share():
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)

    conn_str = "mongodb+srv://tm21:TomM7802@housingpassportcluster.wufr0o8.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    try:
        client.server_info()
        print("Connected...")
    except Exception:
        print("Unable to connect to the server.")

    return "hello"

@app.route("/api/retrieve_my_retrofits", methods=["POST"])
def retrieve_my_retrofits():
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)

    email = data['email']
    address = data['address']
    print(data)

    conn_str = "mongodb+srv://tm21:JfOxlkRhEeIN1ZvB@UserStore.rldimmu.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    try:
        client.server_info()
        print("Connected...")
    except Exception as e:
        print(e)
        print("Unable to connect to the server.")

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
    data = request.data
    data = data.decode('utf-8')
    data = json.loads(data)
    print(data) 

    lmk_key = data['lmk_key']   
    mpan = data['mpan']   
    serialElec = data['serialElec']   
    mprn = data['mprn']   
    serialGas = data['serialGas']   
    authKey = data['authKey']   
    # totalFloorArea = data['totalFloorArea']
    totalFloorArea = 91

    print(mpan)
    print(serialElec)
    print(authKey)

    elec_df = consumption_retriever('electricity',
                                    mpan,
                                    serialElec,
                                    authKey)
    gas_df = consumption_retriever('gas',
                                    mprn,
                                    serialGas,
                                    authKey)

    print(elec_df)
    print(gas_df)

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


    return "hello"


@app.route("/api/private", methods=["GET"])
def private():
    print("hllo")
    response = "Hello from a private endpoint! You need to be authenticated to see this."
    return response


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)

