const noiseSpeed = 0.01;
const noiseHeight = 30; // controls how high up waves go
const num_clouds = 3;
const cloud_ellipses = [
    { x: 0, y: 20, rx: 70, ry: 40 },
    { x: 25, y: -3, rx: 50, ry: 28 },
    { x: 70, y: 3, rx: 50, ry: 28 },
    { x: 100, y: 5, rx: 24, ry: 24 },
    { x: 115, y: -2, rx: 24, ry: 24 },
    { x: 130, y: -2, rx: 24, ry: 24 },
    { x: 145, y: 0, rx: 24, ry: 24 },
    { x: 160, y: 5, rx: 24, ry: 24 },
    { x: 173, y: 5, rx: 24, ry: 24 },
    { x: 185, y: 5, rx: 24, ry: 24 },
    { x: 198, y: -3, rx: 24, ry: 24 },
    { x: 215, y: 3, rx: 28, ry: 24 },
    { x: 230, y: 4, rx: 30, ry: 24 },
    { x: 245, y: 6, rx: 30, ry: 24 },
    { x: 260, y: 6, rx: 30, ry: 24 },
    { x: 270, y: 3, rx: 26, ry: 24 },
    { x: 285, y: 10, rx: 30, ry: 24 },
    { x: 310, y: 4, rx: 30, ry: 24 },
    { x: 325, y: 4, rx: 16, ry: 16 },
    { x: 339, y: 2, rx: 24, ry: 24 },
    { x: 365, y: 5, rx: 44, ry: 28 },
    { x: 400, y: 0, rx: 40, ry: 24 },
    { x: 435, y: -5, rx: 50, ry: 30 },
    { x: 465, y: 5, rx: 24, ry: 24 },
    { x: 490, y: -3, rx: 38, ry: 30 },
    { x: 524, y: -3, rx: 40, ry: 24 },
    { x: 550, y: -10, rx: 60, ry: 50 },
    { x: 595, y: 3, rx: 58, ry: 40 },
    { x: 627, y: 12, rx: 24, ry: 24 },
    { x: 643, y: 20, rx: 40, ry: 24 },
    { x: 665, y: 19, rx: 30, ry: 24 },
    { x: 695, y: 20, rx: 50, ry: 24 },
    { x: 715, y: 25, rx: 45, ry: 30 },
    { x: 740, y: 25, rx: 45, ry: 30 },
    { x: 754, y: 17, rx: 27, ry: 24 },
    { x: 766, y: 17, rx: 20, ry: 20 },
    { x: 780, y: 17, rx: 25, ry: 20 },
    { x: 800, y: 10, rx: 30, ry: 20 },
    { x: 820, y: 10, rx: 40, ry: 40 },
    { x: 860, y: 10, rx: 80, ry: 60 },
    { x: 890, y: -5, rx: 24, ry: 24 },
    { x: 910, y: -10, rx: 40, ry: 40 },
    { x: 950, y: -18, rx: 69, ry: 50 },
    { x: 990, y: -18, rx: 40, ry: 30 },
    { x: 1010, y: 0, rx: 40, ry: 30 },
    { x: 1030, y: 10, rx: 24, ry: 24 },
    { x: 1050, y: 8, rx: 24, ry: 24 },
    { x: 1065, y: 10, rx: 24, ry: 24 },
    { x: 1090, y: 15, rx: 50, ry: 24 },
    { x: 1115, y: 20, rx: 24, ry: 24 },
    { x: 1135, y: 25, rx: 40, ry: 24 },
    { x: 1155, y: 25, rx: 40, ry: 24 },
    { x: 1180, y: 20, rx: 38, ry: 25 },
    { x: 1200, y: 100, rx: 70, ry: 40 },
];
let clouds = [];
//new height to add to the height of the wave to indicate see level rise
let newHeight = 0;

export function setupLandscape(p) {
    for (let i = 0; i < 3; i++) {
        // initialize the clouds
        clouds[i] = new Cloud(p, num_clouds - i);
    }
}

export function drawLandscape(p, currentDate, seaLevelRise, temperatureData) {
    // this loops everything inside body
    //we wil add a new height to the starting height to make our landscape rise and fall
    // with the date and sea seaLevelRise data
    if (seaLevelRise != null){
      var currentYear = currentDate.getFullYear();
      var index = currentYear - 1880;

      if (index < 0) {
          newHeight = 0;
      }
      if (currentYear > 2013) {
          newHeight = seaLevelRise[2013 - 1880][1] * 3 + (currentYear - 2014) / 3;
      } else {

          newHeight = seaLevelRise[index][1] * 3;
      }
      newHeight *= 2;

      drawClouds(p, currentYear);
      drawWaves(p, currentDate, temperatureData);
      p.noStroke();
    }

}

function drawClouds(p, currentYear) {
    // create the clouds to call their methods
    for (var i = 0; i < num_clouds; i++) {
        clouds[i].move();
        clouds[i].display(currentYear);
    }
    p.rect(0, p.windowHeight / 2 - 18, p.windowWidth, p.windowHeight / 2 + 18);
}

function drawWaves(p, currentDate, temperatureData) {
    if (temperatureData) {
        // create the waves
        var startColor = { r: 194, g: 247, b: 254 };
        var endColor = { r: 116, g: 199, b: 145 };
        var color = calcWaveColor(
            p,
            currentDate,
            startColor,
            endColor,
            temperatureData
        );
        createWave(p, 10 - newHeight, color, 2); // 0

        startColor = { r: 84, g: 182, b: 282 };
        endColor = { r: 109, g: 163, b: 103 };
        color = calcWaveColor(
            p,
            currentDate,
            startColor,
            endColor,
            temperatureData
        );
        createWave(p, 65 - newHeight, color, 2); // 65

        startColor = { r: 112, g: 219, b: 245 };
        endColor = { r: 77, g: 202, b: 123 };
        color = calcWaveColor(
            p,
            currentDate,
            startColor,
            endColor,
            temperatureData
        );
        createWave(p, 80 - newHeight, color, 2); // 80
    }
}

export function drawSeaboard(p) {
    // create the landscape
    createWave(p, 0, { r: 250, g: 219, b: 97 }, 1);
}

/**
 * Create wave
 *
 * @param {*} offsetY Vertical offset of wave
 * @param {*} rgb Wave color
 * @param {*} dim Dimension (1D or 2D)
 */
function createWave(p, offsetY, rgb, dim) {
    p.noFill();
    p.stroke(rgb.r, rgb.g, rgb.b); // draw wave
    p.strokeWeight(p.windowHeight / 1.5); // controls how tall the wave is
    p.beginShape(); // create shape for area under waves
    p.curveVertex(0, p.windowHeight / 2);
    for (let i = 0; i < p.width; i += 50) {
        let y;
        if (dim === 1) {
            y = p.map(p.noise(i), 0, 1, 200, 300);
            p.curveVertex(i, p.windowHeight * 1.55 - y);
        } else {
            y = p.noise(p.frameCount * noiseSpeed + i) * noiseHeight; // + noiseY + offsetY;
            p.curveVertex(i, y + p.windowHeight / 1.22 + offsetY);
        }
        // console.log(y);
    }
    p.curveVertex(p.width, p.windowHeight / 2);
    p.endShape(p.LINES); // end shape for area under waves
}

class Cloud {
    // class for cloud objects
    constructor(p, key) {
        this.x = p.width - 1200 * key; // initial x position
        this.y = p.height / 2; // initial y position

        this.display = function (currentYear) {
            var color = 255 - (currentYear - 1950) * 2;
            //console.log(color);
            p.fill(color);
            p.beginShape(); // create shape for area under ellipses
            for (let i = 0; i < cloud_ellipses.length; i++) {
                p.ellipse(
                    // create ellipses that form clouds
                    this.x + cloud_ellipses[i].x,
                    this.y + cloud_ellipses[i].y,
                    cloud_ellipses[i].rx,
                    cloud_ellipses[i].ry
                );
                p.curveVertex(
                    // create vertices to paint area under cloud white
                    this.x + cloud_ellipses[i].x,
                    this.y + cloud_ellipses[i].y
                );
            }
            p.curveVertex(p.windowWidth, p.windowHeight);
            p.endShape(p.CLOSE); // end shape for area under ellipses
        };

        this.move = function () {
            this.x += 0.2; // cloud movement speed

            if (this.x >= p.width) {
                this.x = p.width - 1200 * num_clouds; // reset cloud to this position
            }

            this.y = p.height / 2 - 15 - newHeight; // update Yposition
        };
    }
}

export function calcWaveColor(p, currentDate, startColor, endColor, temperatureData) {
    var currentYear = currentDate.getFullYear();

    var index = ((currentYear - 1880) * temperatureData.length) / 140 - 100;

    var i = Math.round(index);
    var average = 0;
    for (var count = 0; count < 100; count++) {
        average = average + parseFloat(temperatureData[i + count].station);
    }
    //console.log(i);
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
