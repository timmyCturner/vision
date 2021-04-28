//var yvalues;
//var size_index = 0;
export const hoveredSunData = { mouseOver: false, value: null };
let temperatureData;
let currentSize = 0;
let hoveredSun = null;
let sunObject = null;

class Sun {
    /**
     * Constructor for sun
     *
     * @param {*} p p5 ptr
     */
    constructor(p) {
        // class for sun object
        this.x = p.windowWidth / 2;
        this.y = p.windowHeight / 2;
        this.size = currentSize * 100;
        
        /**
         * Display sun on sketch
         */
        this.display = function (currentDate) {
            let color = changeSunColor(currentDate, { r: 232, g: 152, b: 98 }, { r: 200, g: 100, b: 90 });
            this.size = currentSize * 100;
            p.fill(color.r, color.g, color.b);
            p.ellipse(this.x, this.y, this.size);
            if (hoveredSunData.mouseOver) {
                p.fill(225, 225, 0, 70);
                p.ellipse(this.x, this.y, this.size + 20);
            }
        };

        /**
         * Behavior for sun movement
         */
        this.move = function () {
            // check if mouse is pressed and within range of sun
            if (p.mouseIsPressed && p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.size / 2 + 10) {
                //get the sun above the ocean
                if (p.mouseY < p.height / 2) {
                    hoveredSunData.mouseOver = true;
                    hoveredSun = this;
                }
            }
        };
    }
}

export function resizeSun(p) {
    sunObject.x = p.windowWidth / 2;
    sunObject.y = p.windowHeight / 2;
}

export function setUpSun(p, data, currentDate) {
    temperatureData = data; // temperature data might be null here
    calcSun(currentDate);
    sunObject = new Sun(p);
}

export function drawSun(p, data, currentDate) {
    if (data && !temperatureData) {
        temperatureData = data;
    }
    calcSun(currentDate);
    createSun(p, currentDate);
}

function calcSun(currentDate) {
    //get current date based on scroller and year
    if (temperatureData) {
        var currentYear = currentDate.getFullYear();
        var index = ((currentYear - 1880) * temperatureData.length) / 140 - 100;
    
        var i = Math.round(index);
        var average = 0;
        for (var count = 0; count < 100; count++) {
            average = average + parseFloat(temperatureData[i + count].station);
        }
    
        currentSize = average / 50 + 2;
        hoveredSunData.value = Number.parseFloat(currentSize.toFixed(2) - 2).toPrecision(4);
    }

}

function createSun(p, currentDate) {
    if (temperatureData) {
        if (!hoveredSunData.mouseOver) {
            sunObject.move();
        } else if (p.mouseY > p.height / 2) {
            hoveredSunData.mouseOver = false;
        } else if (p.dist(p.mouseX, p.mouseY, hoveredSun.x, hoveredSun.y) > hoveredSun.size / 2 + 20) {
            hoveredSunData.mouseOver = false;
        }
        sunObject.display(currentDate);
    }
}

function changeSunColor(currentDate, startColor, endColor) {
    var currentYear = currentDate.getFullYear();

    var index = ((currentYear - 1880) * temperatureData.length) / 140 - 100;

    var i = Math.round(index);
    var average = 0;
    for (var count = 0; count < 100; count++) {
        average = average + parseFloat(temperatureData[i + count].station);
    }
    
    //smallest is 0 largest is 115
    average = average + 3;

    var rGap = (startColor.r - endColor.r) / 115;
    var gGap = (startColor.g - endColor.g) / 115;
    var bGap = (startColor.b - endColor.b) / 115;

    // code body moved outside (above) statement block
    var rIndex = startColor.r - ((rGap * average) | 0);
    var gIndex = startColor.g - ((gGap * average) | 0);
    var bIndex = startColor.b - ((bGap * average) | 0);

    return { r: rIndex, g: gIndex, b: bIndex };
}
