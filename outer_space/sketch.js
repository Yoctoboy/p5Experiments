var canvasWidth = 800;
var canvasHeight = 800;

function seed_random_modules() {
    const random_seed = Math.floor(random(0, 900000));
    const perlin_seed = Math.floor(random(0, 900000));
    randomSeed(random_seed);
    noise_module.seed(perlin_seed);
    console.log("Random seed =", random_seed, "/ Perlin seed =", perlin_seed);
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);

    background(0);
    colorMode(RGB);

    seed_random_modules();

    // put setup code here
}

function draw() {
    // put drawing code here
}

window.draw = draw;
window.preload = preload;
window.setup = setup;
