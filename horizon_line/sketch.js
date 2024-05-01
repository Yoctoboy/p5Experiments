import { backgroundColorAverage, backgroundColorMarginAroundAverage } from "./constants.js";

var canvasWidth = 800;
var canvasHeight = 800;

let backgroundColor;

function seed_random_modules() {
    const random_seed = Math.floor(random(0, 900000));
    const perlin_seed = Math.floor(random(0, 900000));
    randomSeed(random_seed);
    noise_module.seed(perlin_seed);
    console.log("Random seed =", random_seed, "/ Perlin seed =", perlin_seed);
}

function generateBackground() {
    const r = randInt(
        backgroundColorAverage - backgroundColorMarginAroundAverage,
        backgroundColorAverage + backgroundColorMarginAroundAverage
    );
    const g = randInt(
        backgroundColorAverage - backgroundColorMarginAroundAverage,
        backgroundColorAverage + backgroundColorMarginAroundAverage
    );
    const b = randInt(
        backgroundColorAverage - backgroundColorMarginAroundAverage,
        backgroundColorAverage + backgroundColorMarginAroundAverage
    );
    backgroundColor = color(r, g, b);
    background(backgroundColor);
}

function generateHorizonLine() {
    const horizonLineBaseColor = color(255, 255, 255, 60);
    stroke(horizonLineBaseColor);
    const averagePointSize = 5; // in pixels
    strokeWeight(averagePointSize);
    const middleY = canvasHeight / 2;
    // for each pixel around middle horizonal line, paint a point with a certain probability
    for (var x = 0; x < canvasWidth; x++) {
        for (var y = 0; y < canvasHeight; y++) {
            if (randomExponential(0.4) > 2 + Math.abs(y - middleY)) {
                point(x, y);
            }
        }
    }
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    colorMode(RGB);
    seed_random_modules();

    // put setup code here
    generateBackground();
    generateHorizonLine();
}

function draw() {
    // put drawing code here
}

window.draw = draw;
window.setup = setup;
