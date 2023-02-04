import { Element2D } from "./Element2D.js";
import { Solution } from "./Solution.js";
import { canvasHeight, canvasWidth, image_name } from './constants.js';


// "yarn serve" at the root of the repo
// then go to http://127.0.0.1:8080/sorted_face/index.html


/*
 * BESTS SO FAR
 * 3743.44
 * - 23.2% (gen 20)
 */

let img;


function preload() {
  img = loadImage('assets/' + image_name);
}

function getImagePixels() {
  img.loadPixels();
  const flatPixels = img.pixels;
  let imgPixels = new Array(canvasHeight);
  for (var i = 0; i < canvasHeight; i++) {
    imgPixels[i] = new Array();
    for (var j = 0; j < canvasWidth; j++) {
      imgPixels[i].push(flatPixels.subarray((i * 4 * canvasHeight) + 4 * j, i * 4 * canvasHeight + 4 * j + 4))
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

  let blackenedPixels = new Array(canvasHeight);
  for (var i = 0; i < canvasHeight; i++) {
    blackenedPixels[i] = new Array(canvasWidth)
    for (var j = 0; j < canvasWidth; j++) {
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



function pixelGlitch(directionVector, pixelsToFollow) {
  // draw a bunch of random lines along the same direction vector
  // then use a genetic algorithm to make these lines as close as possible to the pixelsToFollow matrix
  const maxGeneration = 50; // amount of generation iterations
  const populationSize = 350; // amount of item per generation
  const bestSolutionsToKeepInEachGenerationAmount = 30;
  const randomSolutionsToKeepInEachGenerationAmount = 12;
  const initialSolutionsToKeepInEachGenerationAmount = 4;
  const totalSolutionsToKeepInEachGenerationAmount = bestSolutionsToKeepInEachGenerationAmount + randomSolutionsToKeepInEachGenerationAmount + initialSolutionsToKeepInEachGenerationAmount;
  const mutationRate = 0.1;
  const mutationStrengthFactor = 0.04;
  const linesPerSolutionAmount = 500;
  const firstGenerationSolutions = []
  for (var i = 0; i < populationSize; i++) {
    firstGenerationSolutions.push(
      Solution.initializeRandomLocalizedSolution(
        directionVector,
        linesPerSolutionAmount,
      )
    )
  };
  firstGenerationSolutions.forEach(x => {
    x.draw(pixelsToFollow);
  });

  // breeding
  let currentGenerationSolutions = firstGenerationSolutions.sort((x, y) => x.distance < y.distance ? -1 : 1);
  let firstGenDistance = currentGenerationSolutions[0].distance;
  let lastGenDistance = currentGenerationSolutions[0].distance;
  console.log(`Start: ${firstGenDistance}`);
  let currentGeneration = 0;
  let newGenerationSolutions = [];
  let curBest = 0;
  while (currentGeneration < maxGeneration) {
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
    for (var i = 0; i < initialSolutionsToKeepInEachGenerationAmount; i++) {
      newGenerationSolutions.push(Solution.initializeRandomLocalizedSolution(directionVector, linesPerSolutionAmount, canvasHeight, canvasWidth));
    }
    // make children between some of the best solutions of the current generation
    while (newGenerationSolutions.length < populationSize) {
      const index1 = randInt(0, totalSolutionsToKeepInEachGenerationAmount - 1)
      const index2 = randInt(0, totalSolutionsToKeepInEachGenerationAmount - 1)
      const newSol = newGenerationSolutions[index1].makeChild(newGenerationSolutions[index2])
      newSol.mutate(mutationRate, mutationStrengthFactor);
      newGenerationSolutions.push(newSol.clone())
      newGenerationSolutions.at(-1).draw(pixelsToFollow);
    }
    currentGenerationSolutions = newGenerationSolutions.map(s => s.deepClone());
    newGenerationSolutions = newGenerationSolutions.map(x => x.clear()).map(() => null)
    currentGenerationSolutions = currentGenerationSolutions.sort((x, y) => x.distance < y.distance ? -1 : 1);
    let thisGenDistance = currentGenerationSolutions[0].distance;
    console.log(`Best of generation ${currentGeneration}: ${(thisGenDistance).toFixed(2)} (this: -${invertPercentage(thisGenDistance, lastGenDistance).toFixed(2)}%, total: -${invertPercentage(thisGenDistance, firstGenDistance).toFixed(2)}%)`);
    lastGenDistance = thisGenDistance;
  }
  currentGenerationSolutions = currentGenerationSolutions.sort((x, y) => x.distance < y.distance ? -1 : 1);
  currentGenerationSolutions[0].drawMain();
}


function setup() {
  createCanvas(canvasWidth, canvasHeight);
  image(img, 0, 0, canvasWidth, canvasHeight);
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