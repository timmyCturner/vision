let smogClouds = [];
let originalData = null;
const initial_clouds = 4;
let extra_clouds = 0;
let color;
export let hoveredSmogData = { mouseOver: false, value: null };
let hoveredSmog = null;

class SmogCloud {
    constructor(p, todayData, initial) {
        let diff = 0;
        if(!todayData || !initial) {
            this.todayData = undefined;
            this.oldData = undefined
        }
        else {
            this.todayData = todayData;
            this.oldData = initial;
            diff = Math.round(((todayData.average - initial.average)))
        }



        this.xVelocity = p.random(-2, 2); //cloud movement velocity
        this.x = p.random(50, p.width);
        this.y = p.random(50, 200);
        this.width = p.random(100 + diff, 300 + diff);
        this.height = p.random(50 + diff, 100 + diff);
        this.smogBubbles = [];
        this.opacity = p.random(50, 200);
        this.addLimit = 0;

        for (let x = 0; x < 25; x++) {
            this.smogBubbles[x] = new SmogBubble(p, this.width, this.height, diff, diff);
        }

        this.display = function (todayData) {
            this.oldData = this.todayData
            this.todayData = todayData;
            if(this.todayData === undefined) {
                this.todayData = this.oldData;
            }
            // console.log("Displaying smog cloud");

            if(this.oldData) {
                p.noStroke();
                let cloudColor = p.color(color);
                cloudColor.setAlpha(this.opacity);
                p.fill(cloudColor);

                this.width += (parseFloat(this.todayData.average) - parseFloat(this.oldData.average))*4
                this.height += (parseFloat(this.todayData.average) - parseFloat(this.oldData.average))*4
                if (hoveredSmogData.mouseOver) {
                    p.fill(225, 225, 0, 70)
                }
                p.ellipse(this.x, this.y, this.width, this.height);
                p.beginShape();
                for (let x = 0; x < this.smogBubbles.length; x++) {
                    cloudColor.setAlpha(this.smogBubbles[x].opacity);
                    p.fill(cloudColor);
                    this.smogBubbles[x].rx += (this.todayData.average - this.oldData.average)*4
                    this.smogBubbles[x].ry += (this.todayData.average - this.oldData.average)*4

                    //this.smogBubbles[x].rxVelocity += (this.todayData.average - this.oldData.average)
                    //this.smogBubbles[x].ryVelocity += (this.todayData.average - this.oldData.average)
                    if (hoveredSmogData.mouseOver) {
                        p.fill(225, 225, 0, 70)
                    }
                    this.smogBubbles[x].display(this.x,this.y)
                }
            }
            p.endShape(p.CLOSE);
        };

        this.move = function () {
            if(this.oldData) {
                this.addlimit += (parseFloat(this.todayData.average) - parseFloat(this.oldData.average))* 4;
                for (let x = 0; x < this.smogBubbles.length; x++) {
                    if (Math.abs(this.smogBubbles[x].xOffset) > this.width / 2 - 10 + this.addLimit/3) {
                        this.smogBubbles[x].xVelocity *= -1;

                    }
                    if (Math.abs(this.smogBubbles[x].yOffset) > this.height / 2 - 10 + this.addLimit/3) {
                        this.smogBubbles[x].yVelocity *= -1;

                    }
                    if(Math.abs(this.smogBubbles[x].xOffset) > this.width / 2 + this.addLimit + 10 || Math.abs(this.smogBubbles[x].yOffset) > this.height / 2 + this.addLimit/3 + 10) {
                        this.smogBubbles[x].xOffset = p.random((this.width / 2 + this.addLimit) * -1, this.width / 2);
                        this.smogBubbles[x].yOffset = p.random((this.height / 2 + this.addLimit) * -1, this.height / 2);

                    }
                    if (this.smogBubbles[x].rx < 70 + this.addLimit || this.smogBubbles[x].rx > 150 + this.addLimit) {
                        this.smogBubbles[x].rxVelocity *= -1;
                    }
                    if (this.smogBubbles[x].ry < 70 + this.addLimit || this.smogBubbles[x].ry > 150 + this.addLimit) {
                        this.smogBubbles[x].ryVelocity *= -1;
                    }

                    this.smogBubbles[x].xOffset += this.smogBubbles[x].xVelocity;
                    this.smogBubbles[x].yOffset += this.smogBubbles[x].yVelocity;

                    this.smogBubbles[x].rx += this.smogBubbles[x].rxVelocity;
                    this.smogBubbles[x].ry += this.smogBubbles[x].ryVelocity;

                    this.smogBubbles[x].move()
                }
            }
            if (this.x > p.width + 50) {
                this.x = -50;
            } else if (this.x < -50) {
                this.x = p.width - 100;
            }
            this.x += this.xVelocity;
        };
    }
}

class SmogBubble {
    constructor(p, xlimit, ylimit, wMod, hMod) {
        this.opacity = p.random(50, 200);
        this.xVelocity = p.random(0.3, 0.7);
        this.yVelocity = p.random(0.3, 0.7);
        this.xOffset = p.random((xlimit / 2) * -1, xlimit / 2);
        this.yOffset = p.random((ylimit / 2) * -1, ylimit / 2);
        this.rx = p.random(70 + wMod, 150 + wMod);
        this.ry = p.random(70+ hMod, 150 + hMod);

        this.rxVelocity = p.random(0.1, 0.5);
        this.ryVelocity = p.random(0.1, 0.5);

        this.size = this.rx
        this.x = 0
        this.y = 0

    this.display = function (x,y) {
      this.x = x + this.xOffset
      this.y = y + this.yOffset
      p.ellipse(
          x + this.xOffset,
          y + this.yOffset,
          this.rx,
          this.ry
      );
      p.curveVertex(
          x + this.xOffset,
          y + this.yOffset
      );
    }
    this.move = function(){// check if mouse is pressed and within range of bubble
      //console.log(this.size);
      if (p.mouseIsPressed && p.dist(p.mouseX, p.mouseY, this.x, this.y) < this.size / 2 + 20) {
          hoveredSmogData.mouseOver = true;
          hoveredSmog = this;

      }
    }
  }
}

export function setupSmogClouds(p, nitrousData, currentDate) {

    if(!nitrousData) {
        for (let i = 0; i < initial_clouds; i++) {
            smogClouds[i] = new SmogCloud(p, null, null);
        }
    }
    else {
        let currIndex = 33 + ((currentDate.getFullYear() - 2004) * 12) + currentDate.getMonth()
        for(let i = 0; i < nitrousData[0].average / 10; i++) {
            smogClouds[i] = new SmogCloud(p, nitrousData[currIndex], nitrousData[0]);
        }
    }

}

export function drawSmogClouds(p, nitrousData, currentDate) {

    color = 255 - (currentDate.getFullYear() - 1950) * 2;

    if (nitrousData) {

        let currIndex = 33 + ((currentDate.getFullYear() - 2004) * 12) + currentDate.getMonth()

        if(originalData == null && nitrousData != null) {
            originalData = nitrousData[0];

        }

        else if(nitrousData && currIndex > 0 && currIndex < nitrousData.length) {
            let diff = Math.round(((nitrousData[currIndex].average - originalData.average)/10)) - extra_clouds -1;
            //console.log(diff);

            if(diff > 0) {
                for(let x = 0 ; x < diff; x++) {
                    smogClouds[smogClouds.length] = new SmogCloud(p, nitrousData[currIndex], originalData);
                    extra_clouds++;
                    // console.log("Extra cloud created");
                }
            }
            else if(diff < 0 && extra_clouds > 0) {
                // console.log("Diff: "+diff);
                let slice = smogClouds.length + diff;
                extra_clouds -= (smogClouds.length - slice);
                // console.log("Extra clouds: "+ extra_clouds);
                // console.log("Length "+ smogClouds.length);
                // console.log("Slice " + slice)
                smogClouds = smogClouds.slice(0, slice);
            }
        }

        if(currIndex >= 0 ) {
          if (currIndex < nitrousData.length){
            //console.log(nitrousData[currIndex]);
            hoveredSmogData.value = nitrousData[currIndex].average
          }
          else {
            hoveredSmogData.value = nitrousData[nitrousData.length-1].average
          }

            for (var i = 0; i < smogClouds.length; i++) {
              if (!hoveredSmogData.mouseOver) {

                smogClouds[i].move(p);
              }
              else if (p.dist(p.mouseX, p.mouseY, hoveredSmog.x, hoveredSmog.y) > hoveredSmog.size / 2 + 20) {
                  hoveredSmogData.mouseOver = false;
              }

                smogClouds[i].display(nitrousData[currIndex]);
            }
        }
        else {
            hoveredSmogData.value = nitrousData[0].average

            for(var j = 0; j < smogClouds.length; j++) {
              if (!hoveredSmogData.mouseOver) {

                smogClouds[j].move(p);
              }
              else if (p.dist(p.mouseX, p.mouseY, hoveredSmog.x, hoveredSmog.y) > hoveredSmog.size / 2 + 20) {
                  hoveredSmogData.mouseOver = false;
              }

                smogClouds[j].display(nitrousData[0]);
            }
        }
    }
}
