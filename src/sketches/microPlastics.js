import { hoveredMacroPlasticData } from "./macroPlastics";

//these are gonna be the variables for our garbage collection
export const hoveredMicroPlasticData = { mouseOver: false, value: null };
let drops = [];
let micro_Size = 5;
let newHeight = 0;
let startingHeight = window.innerHeight * 0.56;

class Drop {
    constructor(p) {
        this.x = p.random(0, p.width);
        this.y = p.random(startingHeight, p.height);
    }

    show(p) {
        p.noStroke();
        p.fill(255);
        this.size = p.random(5, micro_Size);

        p.ellipse(this.x, this.y, this.size);

        if (hoveredMacroPlasticData.mouseOver) {
            p.fill(225, 225, 0, 70);
            p.ellipse(this.x, this.y, this.size + 10);
        }
    }

    update(p) {
        this.speed = this.speed = p.random(2, 4);
        this.gravity = 1.05;
        this.y = this.y + this.speed * this.gravity;

        if (this.y > p.height) {
            this.y = p.random(
                startingHeight - newHeight,
                startingHeight - newHeight + 70
            );
            this.gravity = 0;
        }
    }
}

export function resizeMicroPlastics(p) {
    startingHeight = p.windowHeight * 0.56;
}

export function setupMicroPlasticDrops(p) {
    //
    //set up plastic
    //
    for (let i = 0; i < 200; i++) {
        drops[i] = new Drop(p);
    }
}

export function drawMicroPlasticDots(
    p,
    microGrowth2050,
    current_date,
    seaLevelRise
) {
    //we wil add a new height to the starting height to make our landscape rise and fall
    // with the date and sea seaLevelRise data
    let currentDate = current_date.getFullYear();
    let index = currentDate - 1880;

    if (index < 0) {
        newHeight = 0;
    }
    if (currentDate > 2013) {
        newHeight = seaLevelRise[2013 - 1880][1] * 3 + (currentDate - 2014) / 3;
    } else {
        newHeight = seaLevelRise[index][1] * 3;
    }

    //calc microplastic
    //

    for (let i = 0; i < drops.length; i++) {
        if (!hoveredMacroPlasticData.mouseOver) {
            drops[i].update(p);
        }
        drops[i].show(p);
    }

    if (microGrowth2050 != null) {
        let newSize = -1 * (microGrowth2050[currentDate - 1950][1] - 367);
        let num;

        if (currentDate > 1971) {
            num = newSize * (590000 / 78);
            hoveredMicroPlasticData.value = num.toFixed(2);
        } else {

            num = (currentDate - 1950) * 100;
            newSize = num/500
            hoveredMicroPlasticData.value = num.toFixed(2);
        }

        newSize = newSize * 5 ;

        //add drops
        if (newSize > drops.length) {
            for (let j = drops.length; j < newSize; j++) {
                drops[j] = new Drop(p);
            }
        }

        //remove drops
        if (newSize < drops.length) {
            let diff = drops.length - newSize;
            drops = drops.splice(diff);
        }
    }
}
