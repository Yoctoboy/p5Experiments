import { Element2D } from "./Element2D.js";
import { Line } from "./Line.js";
import { Solution } from "./Solution.js";
// import cloneDeep from 'lodash.clonedeep';


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
  let imgPixels = new Array(canvas_height);
  for (var i = 0; i < canvas_height; i++) {
    imgPixels[i] = new Array();
    for (var j = 0; j < canvas_width; j++) {
      imgPixels[i].push(flatPixels.subarray((i * 4 * canvas_height) + 4 * j, i * 4 * canvas_height + 4 * j + 4))
    }
  }
  return imgPixels;
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
  pixels = blackenedPixels
  updatePixels();
  return blackenedPixels;
}


function constructRandomSolution(direction, pixelsToFollow, linesAmount) {
  let solutionLines = [];
  const weight = 1;
  for (var i = 0; i < linesAmount; i++) {
    let shade = randInt(10, 255);
    let x1 = randInt(0, canvas_width);
    let y1 = randInt(0, canvas_height);
    let point = new Element2D(x1, y1);
    let point2 = point.translate(direction, randInt(canvas_height / 10, canvas_height / 2));
    let x2 = point2.x;
    let y2 = point2.y;
    solutionLines.push(
      new Line(x1, y1, x2, y2, weight, shade, direction)
    )
  }
  return new Solution(solutionLines, canvas_height, canvas_width);
}



function pixelGlitch(directionVector, pixelsToFollow) {
  // draw a bunch of random lines along the same direction vector
  // then use a genetic algorithm to make these lines as close as possible to the pixelsToFollow matrix
  const maxGeneration = 100; // amount of generation iterations
  const populationSize = 250; // amount of item per generation
  const bestSolutionsToKeepInEachGenerationAmount = 40;
  const randomSolutionsToKeepInEachGenerationAmount = 5;
  const mutationRate = 0.1;
  const mutationStrengthFactor = 0.04;
  const linesPerSolutionAmount = 500;
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
  firstGenerationSolutions.forEach(x => {
    x.draw(pixelsToFollow);
  });

  // breeding
  let currentGenerationSolutions = firstGenerationSolutions
  let currentGeneration = 0;
  let newGenerationSolutions = [];
  let curBest = 0;
  while (currentGeneration < maxGeneration) {
    currentGenerationSolutions = currentGenerationSolutions.sort((x, y) => x.distance < y.distance ? -1 : 1);
    console.log(`Best of generation ${currentGeneration}: ${(currentGenerationSolutions[0].distance).toFixed(2)}`);
    curBest = currentGenerationSolutions[0].distance;
    currentGeneration += 1;
    newGenerationSolutions = [];
    for (var i = 0; i < bestSolutionsToKeepInEachGenerationAmount; i++) {
      newGenerationSolutions.push(currentGenerationSolutions[i]);
    }
    for (var i = 0; i < randomSolutionsToKeepInEachGenerationAmount; i++) {
      const index = randInt(bestSolutionsToKeepInEachGenerationAmount, populationSize - 1)
      newGenerationSolutions.push(currentGenerationSolutions[index]);
    }
    // make children between some of the best solutions of the current generation
    while (newGenerationSolutions.length < populationSize) {
      const index1 = randInt(0, bestSolutionsToKeepInEachGenerationAmount + randomSolutionsToKeepInEachGenerationAmount - 1)
      const index2 = randInt(0, bestSolutionsToKeepInEachGenerationAmount + randomSolutionsToKeepInEachGenerationAmount - 1)
      const newSol = newGenerationSolutions[index1].makeChild(newGenerationSolutions[index2])
      newSol.mutate(mutationRate, mutationStrengthFactor);
      newGenerationSolutions.push(newSol.clone())
      newGenerationSolutions.at(-1).draw(pixelsToFollow);
    }
    currentGenerationSolutions = newGenerationSolutions.map(s => s.deepClone());
    newGenerationSolutions.map(x => x.clear())
  }
  currentGenerationSolutions = currentGenerationSolutions.sort((x, y) => x.distance < y.distance ? -1 : 1);
  console.log(`Best of generation ${maxGeneration}: ${(currentGenerationSolutions[0].distance).toFixed(2)}`);
}


function setup() {
  createCanvas(canvas_width, canvas_height);
  image(img, 0, 0, canvas_width, canvas_height);
  colorMode(RGB);
  seed_random_modules()

  // put setup code here
  redraw()
  noLoop();
}


function draw() {
  // put drawing code here
  const blackenedPixels = blacken();
  pixelGlitch(new Element2D(1, 1), JSON.parse(JSON.stringify(blackenedPixels)));
}

window.draw = draw;
window.preload = preload;
window.setup = setup;