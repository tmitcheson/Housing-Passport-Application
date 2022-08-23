LONDON = ['BR', 'CR', 'DA', 'E', 'EC', 'EN', 'HA', 'IG', 'KT','N','NW','RM',
            'SE','SM','SW','TW','UB','W','WC','WD']
EAST = ['AL', 'CB', 'CM', 'CO', 'HP', 'IP', 'LU', 'NR', 'SG', 'SS']
EAST_MIDLANDS = ['GY', 'JE', 'PE', 'DE', 'DN', 'LE', 'LN', 'NG', 'S']
NORTH_EAST = ['DH','DL','HG','HU','LS','NE','SR','TS','WF','YO']
NORTH_WEST = ['BB','BD','BL','CA','CH','CW','FY','HD','HX','L','LA','M','OL','PR'
            'SK','WA','WN']
SOUTH_EAST = ['BN','CT','GU','ME','MK','OX','PO','RG','RH','SL','SO','TN']
SOUTH_WEST = ['BA','BH','BS','DT','EX','GL','PL','SN','SP','TA','TQ','TR']
WALES = ['CF','LD','LL','NP','SA','SY']
WEST_MIDLANDS = ['B','CV','DY','HR','NN','ST','TF','WR','WS','WV']


def fromBuiltFormToPropType(builtForm):
    if(builtForm == "Mid-Terrace"):
        return 2
    elif(builtForm == "Detached"):
        return 0
    elif(builtForm == "Semi-detached" or builtForm == "End-Terrace"):
        return 1
    elif(builtForm == "Enclosed Mid-Terrace" or builtForm == "Enclosed End-Terrace"):
        return 4
    return 2

def fromAgeToAgeBand(age):
    if(age == "England and Wales: before 1900" or
        age == "England and Wales: 1900-1929"):
        return 1
    elif (age == "England and Wales: 1930-1949" or
        age == "England and Wales: 1950-1966" or
        age == "England and Wales: 1967-1975"):
        return 2
    elif (age == "England and Wales: 1976-1982" or
        age == "England and Wales: 1983-1990" or
        age == "England and Wales: 1991-1995" or
        age == "England and Wales: 1996-2002"):
        return 3
    return 4

def fromPostcodeToRegion(postcode):
    if(postcode[0:2] in NORTH_EAST):
        return "E12000001"
    elif(postcode[0:2] in NORTH_WEST):
        return "E12000002"
    elif(postcode[0:2] in EAST_MIDLANDS):
        return "E12000004"
    elif(postcode[0:2] in WEST_MIDLANDS):
        return "E12000005"
    elif(postcode[0:2] in EAST):
        return "E12000006"
    elif(postcode[0:2] in LONDON):
        return "E12000007"
    elif(postcode[0:2] in SOUTH_EAST):
        return "E12000008"
    elif(postcode[0:2] in SOUTH_WEST):
        return "E12000009"
    elif(postcode[0:2] in WALES):
        return "W92000004"
    elif(postcode[0] in NORTH_EAST):
        return "E12000001"
    elif(postcode[0] in NORTH_WEST):
        return "E12000002"
    elif(postcode[0] in EAST_MIDLANDS):
        return "E12000004"
    elif(postcode[0] in WEST_MIDLANDS):
        return "E12000005"
    elif(postcode[0] in EAST):
        return "E12000006"
    elif(postcode[0] in LONDON):
        return "E12000007"
    elif(postcode[0] in SOUTH_EAST):
        return "E12000008"
    elif(postcode[0] in SOUTH_WEST):
        return "E12000009"
    elif(postcode[0] in WALES):
        return "W92000004"
    return "E12000007"

def fromFloorAreaToBand(area):
    if(area <= 50):
        return 1
    elif(area <= 100):
        return 2
    elif(area <= 150):
        return 3
    elif(area <= 200):
        return 4
    return 5