export const hoveredBubbleData = { mouseOver: false, value: null };
const startingNumBubbles = 30; // always starts with 30 bubbles
let bubbles = []; // holds Bubble objects
let hoveredBubble = null;
let newHeight = 0;
/**
 * Class for bubbles that float up from seabed on display
 */
class Bubble {
    /**
     * Constructor for bubbles
     *
     * @param {*} p p5 ptr
     * @param {*} xstart Starting x-position
     * @param {*} yspeed Speed of bubble rising to top
     * @param {*} size Size of bubble
     */
    constructor(p, xstart, yspeed, size, value) {
        // class for bubble objects
        this.x = xstart; // starting x-position of bubbles
        this.y = p.random(p.height - 150, p.height * 1.5); // starting y-position of bubbles under height
        this.size = size;
        this.yspeed = yspeed;
        this.degree = 0;
        this.value = value; // current value to date from data

        /**
         * Display bubble on sketch
         */
        this.display = function () {
            p.fill(255, 255, 255, 50);
            p.ellipse(this.x, this.y, size);
            p.fill(255, 255, 255, 180);
            p.ellipse(this.x + 0.2 * size, this.y - 0.2 * size, 0.2 * size); // bubble detail
            if (hoveredBubbleData.mouseOver) {
                p.fill(225, 225, 0, 70);
                p.ellipse(this.x, this.y, size + 10);
            }
        };

        /**
         * Behavior for bubble movement
         */
        this.move = function () {
            this.x += p.cos(p.radians(this.degree)); // base x-shifts on cosine waves
            this.y += this.yspeed; // bubble movement speed
            if (this.y < p.height * 0.63 - newHeight) {
                this.y = p.height;
            }

            // check if mouse is pressed and within range of bubble
            if (p.mouseIsPressed && p.dist(p.mouseX, p.mouseY, this.x, this.y) < size) {
                hoveredBubbleData.mouseOver = true;
                hoveredBubble = this;
            }

            this.degree += p.random(0.0, 1.0);
        };

        /**
         * Set bubble speed corresponding to data
         *
         * @param {*} new_speed Re-initialize bubble speed
         */
        this.setSpeed = function (new_speed) {
            this.yspeed = new_speed;
        };
    }
}

/**
 * Set up methane bubbles on canvas
 *
 * @param {*} p p5 ptr
 */
export function setupMethaneBubbles(p, methaneData) {
    // initialize at beginning with bubbles from starting date
    // const startingValue = methaneData.arr[0].average;
    // const AVG_END = methaneData.arr[methaneData.arr.length - 1].average;
    // const diff = AVG_END - startingValue; // diff btwn curr avg and start avg

    for (let i = 0; i < startingNumBubbles; i++) {
        // initialize the bubbles
        bubbles[i] = new Bubble(p, p.random(0, p.width), p.random(-1.5, -1), p.random(10, 20), null);
    }
}

/**
 * Draw methane bubbles on sketch
 *
 * @param {*} p p5 ptr
 * @param {*} methaneData Object containing map and arr
 * @param {*} currentDate Current date stored in state
 */
export function drawMethaneBubbles(p, methaneData, currentDate, seaLevelRise) {
    if (methaneData.arr) {
        // create the bubbles and call their methods
        // data starts on/after 1983
        const yyyy = new Intl.DateTimeFormat("en", { year: "numeric" }).format(
            currentDate
        );
        const mm = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(
            currentDate
        );
        const dd = "01";
        const date = `${yyyy}-${mm}-${dd}`;
        const startingValue = methaneData.arr[0].average;
        const startingDate = methaneData.arr[0].date;
        const startingYearEstValue = 1116; // retrieved from https://www.methanelevels.org/
    
        // we will add a new height to the starting height to make our landscape rise and fall
        // with the date and sea seaLevelRise data
        const currentYear = currentDate.getFullYear();
        const index = currentYear - 1880;
    
        if (index < 0) {
            newHeight = 0;
        }
        if (currentYear > 2013) {
            newHeight = seaLevelRise[2013 - 1880][1] * 3 + (currentYear - 2014) / 3;
        } else {
            newHeight = seaLevelRise[index][1] * 3;
        }
    
        // make more bubbles and modify speed
        for (let i = 0; i < bubbles.length; i++) {
            // check if mouse is hovering over bubble
            // if not, move normally
            // otherwise, compare current mouse position with initially selected bubble position
            if (!hoveredBubbleData.mouseOver) {
                bubbles[i].move();
            } else if (
                p.dist(p.mouseX, p.mouseY, hoveredBubble.x, hoveredBubble.y) >
                hoveredBubble.size
            ) {
                hoveredBubbleData.mouseOver = false;
            }
            bubbles[i].display();
        }
    
        // update bubble here
        if (methaneData.map.get(date)) {
            const currentValue = methaneData.map.get(date);
            const diff = currentValue - startingValue; // diff btwn curr avg and start avg
            const ratio = startingValue / currentValue;
            const newNumBubbles = parseInt(diff + startingNumBubbles);
    
            // update current data value
            //console.log(currentValue);
            hoveredBubbleData.value = currentValue;
    
            if (newNumBubbles > bubbles.length) {
                for (let j = bubbles.length; j < newNumBubbles; j++) {
                    bubbles[j] = new Bubble(
                        p,
                        p.random(0, p.width),
                        p.random((-2 / ratio) * 2, (-1.5 / ratio) * 2),
                        p.random(10, 20),
                        currentValue
                    );
                }
            }
    
            if (newNumBubbles < bubbles.length) {
                bubbles = bubbles.splice(bubbles.length - newNumBubbles);
            }
        } else {
            // set to null if no data available
            // console.log(`Current year: ${currentYear} (${typeof(currentYear)}), Starting year: ${startingYear} (${typeof(startingYear)})`)
            hoveredBubbleData.value = `${(
                startingYearEstValue +
                (currentYear - 1950) * 10
            ).toString()} (approximation)`;
    
            // use last known date (make sure to set first date to earliest and vice versa)
            // 1. get the date where data starts for api
            const new_yyyy = startingDate.substring(0, 4);
            const new_mm = startingDate
                .substring(5, startingDate.length)
                .padStart(2, "0");
            const new_dd = "01";
            const new_date = new Date(`${new_yyyy}-${new_mm}-${new_dd}`);
    
            // 2. update bubble here (could be < lower bound or > upper bound)
            if (new_date >= currentDate) {
                bubbles = bubbles.splice(0, startingNumBubbles);
                for (let i = 0; i < startingNumBubbles; i++) {
                    bubbles[i].setSpeed(p.random(-1.5, -1));
                }
            }
        }
    }
}
