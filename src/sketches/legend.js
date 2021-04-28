import { black } from "color-name";

export function drawGuide(p) {
    const maxWidth =
        window.screen.availWidth - (window.outerWidth - window.innerWidth);
    const width_ratio = p.windowWidth / maxWidth;

    const strokeWeight = 5; // font boldness

    const rightPadding = 80;
    const leftPadding = 80; // check if text box would go beyond window width
    const topPadding = 80;
    const bottomPadding = 150;

    const textSize = 24 * width_ratio; // scales with window width
    const textBoxWidth = p.width - rightPadding - leftPadding; // scales with window width
    const textBoxHeight = p.height - topPadding - bottomPadding; // scales with window height

    const fillColor = p.color(255, 255, 255);

    fillColor.setAlpha(200);
    p.noStroke();
    p.fill(fillColor);
    p.rect(leftPadding, topPadding, textBoxWidth, textBoxHeight);

    p.noFill();
    p.stroke(black);
    p.strokeWeight(strokeWeight);
    p.rect(leftPadding, topPadding, textBoxWidth, textBoxHeight);

    p.fill(0);
    p.strokeWeight(0.5);
    p.textAlign(p.LEFT);

    p.textSize(textSize);

    createText(
        "Interact with moving objects on the visualization to display value representation of pollutants corresponding with the current period in time." +
            "\n\nAudio: The audio adjusts intervals, detune, partials and effects processing based on all incoming data." +
            "\n\nBubbles: The bubbles rising up through the ocean represent methane entering the atmosphere, and increase and decrease in number accordingly." +
            "\n\nOcean Color: The color of the ocean is based on ocean pollution data, darkening as levels in the ocean increase." +
            "\n\nOcean Level: The sea level rises or descends based on sea level data" +
            "\n\nMicroplastics: The small white dots drifting downward through the ocean represent microplastics, tiny plastic particulates polluting the oceans. They increase and decrease in number based on microplastic levels in the oceans." +
            "\n\nMacroplastics: The large brown and grey shapes on the ocean surface represent macroplastics, larger plastic objects polluting the oceans. They increase and decrease in number based on macroplastic levels in the oceans." +
            "\n\nSky Color: The color of the sky is based on carbon dioxide data, darkening as CO2 levels in the atmosphere increase." +
            "\n\nSmog: The grey smog clouds increase and decrease in density, size, and number based on nitrous oxide levels in the atmosphere." +
            "\n\nSun Size: The sun increases and decreases in size based on global temperature averages - larger means hotter, smaller means cooler."
    );

    p.noStroke();

    /**
     * Create wrapped text box
     *
     * @param {*} text Text to create
     * @param {*} yoffset Optional parameter; offset from top to move text, otherwise 0 by default
     */
    function createText(text, yoffset) {
        if (!yoffset) yoffset = 0;
        p.text(
            text,
            leftPadding + strokeWeight, // x-offset
            topPadding + textSize - strokeWeight * 2 + yoffset, // y-offset
            p.width - leftPadding - rightPadding - strokeWeight * 2, // x-wrap
            p.height - bottomPadding - topPadding - strokeWeight * 2
        ); // y-wrap
    }
}

export function drawLegend(p, text, value) {
    const maxWidth =
        window.screen.availWidth - (window.outerWidth - window.innerWidth);
    const width_ratio = p.windowWidth / maxWidth;

    const strokeWeight = 5; // font boldness
    const bottomPadding = 3;
    const maxChars = 66;
    const numTextWraps = 1 + Math.ceil(text.length / maxChars); // add 1 for value representation

    const textSize = 20 * width_ratio; // scales with window width
    const textBoxWidth = 625 * width_ratio; // scales with window width
    const textBoxHeight =
        strokeWeight * numTextWraps + textSize * numTextWraps + bottomPadding; // scales with window height

    const leftMargin =
        p.mouseX + textBoxWidth + 20 > p.windowWidth ? -textBoxWidth - 20 : 20; // check if text box would go beyond window width

    const fillColor = p.color(255, 255, 255);

    const wrappedText = text.replace(
        // wrap text around 66 chars maximum
        /(?![^\n]{1,66}$)([^\n]{1,66})\s/g,
        "$1\n"
    );

    fillColor.setAlpha(200);
    p.noStroke();
    p.fill(fillColor);
    p.rect(leftMargin + p.mouseX, p.mouseY, textBoxWidth, textBoxHeight);

    p.noFill();
    p.stroke(black);
    p.strokeWeight(strokeWeight);
    p.rect(leftMargin + p.mouseX, p.mouseY, textBoxWidth, textBoxHeight);

    p.fill(0);
    p.strokeWeight(0.5);
    p.textAlign(p.LEFT);

    p.textSize(textSize);

    if (value) {
        p.text(
            wrappedText,
            leftMargin + strokeWeight + p.mouseX,
            p.mouseY + textSize
        );
        p.text(
            value,
            leftMargin + strokeWeight + p.mouseX,
            p.mouseY + (bottomPadding + textSize) * numTextWraps
        );
    }

    p.noStroke();
}
