import pymongo

def getMyProperty(email):

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
        epc_data = users.find_one({"email": email},{"properties":1})
        del epc_data['_id']
        epc_data = epc_data['properties']
        print(epc_data)

        return epc_data

    except Exception as e:
        print(e)
        return e
