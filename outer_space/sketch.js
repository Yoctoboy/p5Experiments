import { maxIterations, particlesAmount } from "./constants.js";
import { Particle } from "./Particle.js";

var canvasWidth = 800;
var canvasHeight = 800;

function seed_random_modules() {
    const random_seed = Math.floor(random(0, 900000));
    const perlin_seed = Math.floor(random(0, 900000));
    randomSeed(random_seed);
    noise_module.seed(perlin_seed);
    console.log("Random seed =", random_seed, "/ Perlin seed =", perlin_seed);
}

let particles = [];

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    particles = Array.from({ length: particlesAmount }).map(
        (_, i) =>
            new Particle(
                i,
                Math.random() * 800,
                Math.random() * 800,
                color(Math.random() * 255, Math.random() * 255, Math.random() * 255),
                3
            )
    );

    background(0);
    colorMode(RGB, 255);

    seed_random_modules();

    // put setup code here
}

let iteration = 0;
function draw() {
    background(0);
    stroke(255);
    particles.forEach((p) => p.updatePosition(particles));
    particles.forEach((p) => p.draw());
    iteration += 1;
    if (iteration >= maxIterations) noLoop();
    // put drawing code here
}

window.draw = draw;
window.setup = setup;
