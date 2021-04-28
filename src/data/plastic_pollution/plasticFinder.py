import json

# data scraped from https://ourworldindata.org/plastic-pollution

def parser(fname):
    column = 0
    finalArray = []
    newRow = []
    hit = False
    with open(fname, 'r') as f:
        for line in f:
            words = line.split()
            for i in words:
                number = ""
                for letter in i:
                    if(letter.isdigit() and letter != ' '):
                        number += str(letter)
                        hit = True
                if hit:
                    #add number to the row
                    newRow.append(number)
                    column+=1
                    if column == 3:
                        finalArray.append(newRow)
                        newRow=[]
                        column = 0

    return finalArray

# turn a text file into a a json file
fname = "macroGrowth2050.txt"
arrayFormat = parser(fname)
jsonFormat = json.dumps({'macroGrowth2050': arrayFormat})
with open("macroGrowth2050.json", "w") as outfile:
    json.dump(jsonFormat, outfile)

fname = "macroLevel2050.txt"
arrayFormat = parser(fname)
jsonFormat = json.dumps({'macroLevel2050': arrayFormat})
with open("macrolevel2050.json", "w") as outfile:
    json.dump(jsonFormat, outfile)

fname = "macroEnd2050.txt"
arrayFormat = parser(fname)
jsonFormat = json.dumps({'macroEnd2050': arrayFormat})
with open("macroEnd2050.json", "w") as outfile:
    json.dump(jsonFormat, outfile)

# turn a text file into a a json file
fname = "microGrowth2050.txt"
arrayFormat = parser(fname)
jsonFormat = json.dumps({'microGrowth2050': arrayFormat})
with open("microGrowth2050.json", "w") as outfile:
    json.dump(jsonFormat, outfile)

fname = "microLevel2050.txt"
arrayFormat = parser(fname)
jsonFormat = json.dumps({'microLevel2050': arrayFormat})
with open("microLevel2050.json", "w") as outfile:
    json.dump(jsonFormat, outfile)

fname = "microEnd2050.txt"
arrayFormat = parser(fname)
jsonFormat = json.dumps({'microEnd2050': arrayFormat})
with open("microEnd2050.json", "w") as outfile:
    json.dump(jsonFormat, outfile)
