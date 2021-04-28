import React from "react";
import "./styles/App.css";
import OWVisualization from "./OWVisualization"; // import both children
import OWSonification from "./OWSonification";
import axios from "axios"; // used for API stuff

import macroGrowth2050 from "./data/plastic_pollution/macroGrowth2050.json";
import microGrowth2050 from "./data/plastic_pollution/microGrowth2050.json";
import seaLevelRise from "./data/seaLevelRise/seaLevelRise.json";
import nitrousData from "./data/nitrous.json";
import methaneData from "./data/methane.json";
import carbonData from "./data/carbon.json";
import temperatureData from "./data/temperature.json";

import * as d3 from "d3";


class App extends React.Component {
    // you can create class-scope fields in here like in Java
    constructor(props) {
        super();
        this.state = {
            // you can add new states here
            carbonData: null,
            methaneData: null,
            nitrousData: null,
            temperatureData: null,

            //get plastic and repeat for others
            macroGrowth2050: macroGrowth2050.macroGrowth2050,
            microGrowth2050: microGrowth2050.microGrowth2050,

            //sea seaLevelRise
            seaLevelRise: seaLevelRise.seaLevelRise,

            currentDate: new Date("1950-11-01"), // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
            dataIsLoaded: false,
        };
    }

    render() {
        return (
            <div id="app" className="app-container">
                <div id="page-wrapper">

                </div>

                <OWVisualization
                    currentDate={this.state.currentDate}
                    temperatureData={this.state.temperatureData} // need to pass data into children via props
                    microGrowth2050={this.state.microGrowth2050}
                    macroGrowth2050={this.state.macroGrowth2050}
                    carbonData={this.state.carbonData}
                    methaneData={this.state.methaneData}
                    seaLevelRise={this.state.seaLevelRise}
                    nitrousData={this.state.nitrousData}
                />
                <OWSonification
                    currentDate={this.state.currentDate}
                    temperatureData={this.state.temperatureData}
                    microGrowth2050={this.state.microGrowth2050}
                    macroGrowth2050={this.state.macroGrowth2050}
                    carbonData={this.state.carbonData}
                    methaneData={this.state.methaneData}
                    seaLevelRise={this.state.seaLevelRise}
                />
            </div>
        );
    }

    componentDidMount() {
        // this is called when the page is initially loaded/mounted
        // console.log("Parent Mounted");
        this.loadData(); // comment this out if using static files; loadData() will make API requests
        this.createSlider(d3.select(".app-container"));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // when re-render occurs, componentDidUpdate() is called
        // console.log("Parent Updated");
    }

    loadData() {
        const fetchData = async () => {
            const proxyurl = "https://cors-anywhere.herokuapp.com/"; // proxy url that is used in combination with real url

            let promises = []; // make an array of promises
            this.props.urls.split(",").forEach(function (url) {
                promises.push(axios(proxyurl + url)); // push request onto promise array
            });

            // order of promises is retained; reference: https://stackoverflow.com/questions/28066429/promise-all-order-of-resolved-values/28066851
            await Promise.all(promises)
                .then((result) => {
                    // console.log("Request successful");
                    this.state.carbonData = result[0].data.co2; // directly modifying the state like this does NOT force re-render
                    this.state.methaneData = result[1].data.methane;
                    this.state.nitrousData = result[2].data.nitrous;
                    this.state.temperatureData = result[3].data.result;
                })
                .catch((error) => {
                    console.log(error);
                    console.log("Switching to static files");
                    this.state.carbonData = carbonData.co2;
                    this.state.methaneData = methaneData.methane;
                    this.state.nitrousData = nitrousData.nitrous;
                    this.state.temperatureData = temperatureData.result;
                });


            this.setState({ dataIsLoaded: true }); // calling this.setState(...) forces re-render
        };
        fetchData();
    }

    createSlider(element) {
        // parameter is the app-container svg body
        const self = this; // reference constructor

        let formatDateIntoYear = d3.timeFormat("%Y");
        let formatDate = d3.timeFormat("%d %B %Y"); // DD MM YY https://github.com/d3/d3-time-format

        let startDate = new Date("1950-11-01"); // subject to change
        let endDate = new Date(); // subject to change (no params = current date)

        let margin = { top: 50, right: 50, bottom: 0, left: 75 };
        let width = window.innerWidth; // - margin.left - margin.right;

        let timer = 0;
        let currentValue = 0;
        let targetValue = width - 50;

        let sliderRange = element // appends svg on top of .App svg
            .append("div")
            .classed("slider-svg", true) // container class to make iresponsive
            .attr("id", "slider");

        let gRange = sliderRange // gRange is the svg body that will be made responsive
            .append("svg") // append the responsive svg container
            .attr("preserveAspectRatio", "xMinYMin meet") // responsive svg container needs to preserve aspect ratio for responsiveness
            .attr("viewBox", `0 0 ${window.innerWidth + margin.left * 2} 200`) // set aspect ratio for slider svg body
            // it seems that ADDING margin would actually shrink the slider svg body
            .append("g") // overlay the slider svg body; now gRange reflects the slider body
            .attr("transform", "translate(" + margin.left + ", 100)"); // shift slider to right and down
        // .classed("class", "slider") // apply slider css properties

        gRange // we want to add a foreign object embodied in a html element
            .append("foreignObject") // append the foreign object then set coordinates relative to slider svg body
            .attr("x", 20)
            .attr("y", 40)
            .attr("width", 200) // set width and height of the play button
            .attr("height", 60)
            .html(function (d) {
                // this is the html element we want to append
                return '<button id="play-button">Play</button>';
            });

        let playButton = d3.select("#play-button"); // get the play button svg

        playButton.on("click", function () {
            // set the play button's behavior
            let button = d3.select(this); // note that 'this' references the play button svg
            if (button.text() === "Pause") {
                // if paused, clear interval and change text to 'play'
                clearInterval(timer);
                button.text("Play");
            } else {
                // otherwise set behavior for the play button
                timer = setInterval(function () {
                    // play interval asynchronously
                    update(x.invert(currentValue)); // update handle position and adjust current value tick jumps
                    currentValue = currentValue + targetValue / 151;
                    if (currentValue > targetValue) {
                        // if at end of range, clear interval and change text to 'play'
                        clearInterval(timer); // this will stop the asynchronous interval
                        playButton.text("Play");
                    }
                    self.setState({ currentDate: x.invert(currentValue) }); // ref parent constructor and communicate with child
                }, 200); // loops for about 20 seconds going from month to month (or longer)
                button.text("Pause"); // when play button is selected, change text to 'pause'
            }
        });

        let x = d3
            .scaleTime() // ref: https://observablehq.com/@d3/d3-scaletime
            .domain([startDate, endDate]) // use timescale domain between start and end dates
            .range([0, targetValue]) // define range of slider being from beginning to end of its range
            .clamp(true); // ensure that handle does not escape range

        gRange
            .append("line")
            .attr("class", "track") // apply track css properties within slider svg body
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true)); // not sure what this is yet
            })
            .attr("class", "track-inset") // apply track-inset css properties within slider svg body
            .select(function () {
                return this.parentNode.appendChild(this.cloneNode(true));
            })
            .attr("class", "track-overlay") // apply track-overlay css properties within slider svg body
            .call(
                d3
                    .drag() // dragging behavior
                    .on("start.interrupt", function () {
                        // handle interrupts
                        gRange.interrupt();
                    })
                    .on("start drag", function (event) {
                        // while hande is dragged, store current value and update handle location
                        currentValue = event.x;
                        update(x.invert(currentValue));
                    })
                    .on("end", function (event) {
                        // when handle is released, use the last recorded current value
                        self.setState({ currentDate: x.invert(currentValue) });
                    })
            );

        let handle = gRange
            .insert("circle", ".track-overlay") // inserts the track
            .attr("class", "handle") // apply handle css properties to track within slider svg body
            .attr("r", 9); // set radius of handle

        let label = gRange
            .append("text") // append text onto slider which will be our tick representations
            .attr("class", "label") // apply label css properties
            .attr("text-anchor", "middle") // anchor text to middle
            .attr("font-family", 'Raleway, Helvetica, sans-serif')
            .attr("font-weight", "700")
            .attr("fill", "rgba(0, 0, 0, 0.750)")
            .text(formatDate(startDate)) // display currently selected date in text
            .attr("transform", "translate(0," + -25 + ")"); // shift text to left

        document.addEventListener("keydown", function (event) {
            // listen for keypresses
            switch (
                event.key // we are only concerned about left/right arrow keys
            ) {
                case "ArrowLeft":
                    currentValue = // ensure handle does not decrement below zero
                        currentValue === 0 ? currentValue : currentValue - 1;
                    update(x.invert(currentValue)); // shift handle one tick to left
                    break;
                case "ArrowRight":
                    currentValue++; // increment current value
                    update(x.invert(currentValue)); // shift handle one tick to right
                    break;
                default:
                    break;
            }
        });

        gRange
            .insert("g", ".track-overlay") // create the track overlay
            .attr("class", "ticks") // apply ticks css properties within slider svg body
            .attr("transform", "translate(0," + 18 + ")") // shift to right
            .selectAll("text") // apply following changes to all text on slider (ticks)
            .data(x.ticks(10)) // ref: https://observablehq.com/@d3/d3-scaletime
            .enter() // ref: https://observablehq.com/@dnarvaez27/understanding-enter-exit-merge-key-function
            .append("text") // append text representing ticks then set its coordinates (x-coordinate is variable, y-coordinate is fixed)
            .attr("x", x)
            .attr("y", 10)
            .attr("text-anchor", "middle") // center text on tick
            .attr("font-family", 'Raleway, Helvetica, sans-serif')
            .attr("font-weight", "700")
            .attr("fill", "rgba(0, 0, 0, 0.750)")
            .attr("class", "track-text")
            .text((d) => formatDateIntoYear(d)); // write formatted date as text

        function update(h) {
            // update position and text of label according to slider scale
            handle.attr("cx", x(h)); // update handle position
            label // update tick label position and tick label content to new date
                .attr("x", x(h))
                .text(formatDate(h));
        }
    }
}

export default App;
