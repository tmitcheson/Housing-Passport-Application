import pymongo

def addEPCDataToUser(epc_data, email):

    conn_str = "mongodb+srv://tm21:JfOxlkRhEeIN1ZvB@UserStore.rldimmu.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)

    try:
        client.server_info()
        print("Connected...")
    except Exception as e:
        print(e)
        print("Unable to connect to the server.")

    # MAYBE TRY EXTENDING THE NUMBER OF PROPERTIES YOU CAN HAVE LATER
    # cursor = client['db-name'].users.find_one({"email":email})
    # returner = cursor.next()
    # del returner['_id']
    # property_count = returner

    try:
        client['db-name'].users.update_one(
            {"email":email},
            {"$push": {"properties."+ epc_data['ADDRESS']: epc_data }}
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

