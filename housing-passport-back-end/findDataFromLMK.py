import pymongo

def findDataFromLMK(lmk_key):
    conn_str = "mongodb+srv://tm21:TomM7802@housingpassportcluster.wufr0o8.mongodb.net/?retryWrites=true&w=majority"
    client = pymongo.MongoClient(conn_str, serverSelectionTimeoutMS=5000)
    try:
        client.server_info()
        print("Connected...")
    except Exception:
        print("Unable to connect to the server.")

    passports = client.business
    cursor = passports.passports.find({"LMK_KEY": lmk_key})
    returner = cursor.next()
    try:
        del returner['_id']
    except:
        print("not got an id")

    return returner