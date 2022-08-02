from flask import Flask
from flask import request, make_response, Flask
from flask_cors import CORS
import pymongo
import json

from findDataFromLMK import findDataFromLMK
from addEPCDataToUser import addEPCDataToUser
from getMyProperty import getMyProperty

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
    print("and again" + data)
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

    return "hi"


@app.route("/api/private", methods=["GET"])
def private():
    print("hllo")
    response = "Hello from a private endpoint! You need to be authenticated to see this."
    return response


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=8080)

