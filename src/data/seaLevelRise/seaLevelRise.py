import json
#Year,CSIRO - Adjusted sea level (inches),CSIRO - Lower error bound (inches),CSIRO - Upper error bound (inches),NOAA - Adjusted sea level (inches)
#data recieved from https://www.epa.gov/sites/production/files/2016-08/sea-level_fig-1.csv
def parser(fname):
    year = 1880
    finalArray = []
    newRow = []
    hit = False
    with open(fname, 'r') as f:
        for line in f:
            words = line.split()
            for i in words:
                number = ""
                for letter in i:
                    if letter == ',':
                        if number is not '':
                            print(number, end = ', ')
                            print(year, end = ', ')
                            print(newRow,  end = ' ')
                            print('-----')
                            if float(number) == (year+1):
                                print
                                finalArray.append(newRow)
                                newRow=[]
                                number = ""
                                year = year+1
                            else:
                                newRow.append(number)
                                number = ""

                    elif(letter.isdigit() or letter is '.'):
                        number += str(letter)



    return finalArray

#turn a text file into a a json file
fname = "seaLevelRise.txt"
arrayFormat = parser(fname)
jsonFormat = json.dumps({'seaLevelRise': arrayFormat})
with open("seaLevelRise.json", "w") as outfile:
    json.dump(jsonFormat, outfile)
