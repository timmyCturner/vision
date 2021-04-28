//inital background color (38,238,228)

//2010 background color ((38*.75),(238*.75),(228*.75) this is marked as 25% of final transition
//final background color (15,26,155)
let END_SKY_r = 15;
let END_SKY_g = 26;
let END_SKY_b = 155;

let START_SKY_r = 38;
let START_SKY_g = 238;
let START_SKY_b = 228;

export function drawSky(p, carbonData, currentDate) {
    var currentYear = currentDate.getFullYear();
    //underData
    var yearIdex = currentYear - 1950;
    //constants for changing color

    var color_2010_r = START_SKY_r * 0.75;
    var color_2010_g = START_SKY_g * 0.75;
    var color_2010_b = START_SKY_b * 0.75;

    var rGap = (color_2010_r - END_SKY_r) / 70;
    var gGap = (color_2010_g - END_SKY_g) / 70;
    var bGap = (color_2010_b - END_SKY_b) / 70;

    var rIndex, gIndex, bIndex;

    if (currentYear <= 2010) {
        // code body moved outside (above) statement block
        rIndex = START_SKY_r - ((rGap * yearIdex) | 0);
        gIndex = START_SKY_g - ((gGap * yearIdex) | 0);
        bIndex = START_SKY_b - ((bGap * yearIdex) | 0);

        p.background(rIndex, gIndex, bIndex);
    }

    //first index is 0 =, year 2010, trend 387
    //last index is 3900, year 2020, trend 412
    else if (currentYear !== 2020) {
        //initial colors
        rIndex = START_SKY_r - ((rGap * 60) | 0);
        gIndex = START_SKY_g - ((gGap * 60) | 0);
        bIndex = START_SKY_g - ((bGap * 60) | 0);

        //find new jump of index
        var rJump = (rIndex - END_SKY_r) / (412 - 387);
        var gJump = (gIndex - END_SKY_g) / (412 - 387);
        var bJump = (bIndex - END_SKY_b) / (412 - 387);
        //there are 10 year in the carbon data
        //get the index gap of carbon data
        var yearGap = 390;
        var monthGap = yearGap / 12;
        var year_index = currentYear - 2010;
        var month_index = currentDate.getMonth() - 1;

        var current_index = yearGap * year_index + month_index * monthGap;
        current_index = current_index | 0;

        // var average = 0;
        //console.log(carbonData);
        var carbon = carbonData[current_index].trend - 387;
        rIndex = rIndex - carbon * rJump;
        gIndex = gIndex - carbon * gJump;
        bIndex = bIndex - carbon * bJump;

        p.background(rIndex, gIndex, bIndex);
    } else {
        p.background(15, 26, 155);
    }
}
