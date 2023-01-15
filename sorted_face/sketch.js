import { Element2D } from "./Element2D.js";
import { Line } from "./Line.js";
import { Solution } from "./Solution.js";

// "yarn serve" at the root of the repo
// then go to http://127.0.0.1:8080/sorted_face/index.html

let img;

const image_name = 'face_1_687.jpg'
var canvas_width = 687;
var canvas_height = 687;

function preload() {
  img = loadImage('assets/' + image_name);
}

function getImagePixels() {
  img.loadPixels();
  const flatPixels = img.pixels;
  let pixels = new Array(canvas_height);
  for (var i = 0; i < canvas_height; i++) {
    pixels[i] = new Array();
    for (var j = 0; j < canvas_width; j++) {
      pixels[i].push(flatPixels.subarray((i * 4 * canvas_height) + 4 * j, i * 4 * canvas_height + 4 * j + 4))
    }
  }
  return pixels;
}


function seed_random_modules() {
  const random_seed = Math.floor(random(0, 900000));
  const perlin_seed = Math.floor(random(0, 900000));
  randomSeed(random_seed);
  noise_module.seed(perlin_seed)
  console.log("Random seed =", random_seed, "/ Perlin seed =", perlin_seed);
}


function blacken() {
  let pix = getImagePixels();
  let min = 255, max = 0;
  pix.forEach(line => line.forEach(pixel => min = Math.min(min, pixel[0])));
  pix.forEach(line => line.forEach(pixel => max = Math.max(max, pixel[0])));
  // const threshold = (max + min) / 2;
  const threshold = 80

  let blackenedPixels = new Array(canvas_height);
  for (var i = 0; i < canvas_height; i++) {
    blackenedPixels[i] = new Array(canvas_width)
    for (var j = 0; j < canvas_width; j++) {
      if (pix[i][j][0] < threshold)
        blackenedPixels[i][j] = [0, 0, 0, 0];
      else
        blackenedPixels[i][j] = [255, 255, 255, 255];
    }
  }
  updatePixels();
}


function constructRandomSolution(direction, pixelsToFollow, linesAmount) {
  let solutionLines = [];
  const weight = 1;
  for (var i = 0; i < linesAmount; i++) {
    let shade = randInt(0, 255);
    let x1 = randInt(canvas_height / 4, 3 * canvas_width / 4);
    let y1 = randInt(canvas_height / 4, 3 * canvas_width / 4);
    let point = new Element2D(x1, y1);
    let point2 = point.translate(direction, randInt(canvas_height / 10, canvas_height / 2));
    let x2 = point2.x;
    let y2 = point2.y;
    solutionLines.push(
      new Line(x1, y1, x2, y2, weight, shade)
    )
  }
  return new Solution(solutionLines, pixelsToFollow, canvas_height, canvas_width);
}



function pixelGlitch(directionVector, pixelsToFollow) {
  // draw a bunch of random lines along the same direction vector
  // then use a genetic algorithm to make these lines as close as possible to the pixelsToFollow matrix
  const populationSize = 10; // amount of item per generation
  const maxGeneration = 10; // amount of generation iterations
  const mutationRate = 0.1;
  const linesPerSolutionAmount = 100;
  const firstGenerationSolutions = []
  for (var i = 0; i < populationSize; i++) {
    firstGenerationSolutions.push(
      constructRandomSolution(
        directionVector,
        pixelsToFollow,
        linesPerSolutionAmount,
      )
    )
  };
  firstGenerationSolutions[0].draw();
}


function setup() {
  createCanvas(canvas_width, canvas_height);
  image(img, 0, 0);
  colorMode(RGB);
  seed_random_modules()

  // put setup code here
  redraw()
  noLoop();
}


function draw() {
  // put drawing code here
  const blackenedPixels = blacken();
  pixelGlitch(new Element2D(1, 1), blackenedPixels);
}

window.draw = draw;
window.preload = preload;
window.setup = setup;