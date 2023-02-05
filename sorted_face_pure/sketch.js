import { Element2D } from "./Element2D.js";

import { PixelMatrix } from "./PixelMatrix.js";

import {
  canvasHeight,
  canvasWidth,
  image_name,
  directionVector,
  oppositeDirectionVector,
  backwardOverlapLengthAverage,
  forwardOverlapLengthAverage,
  maximumShadeMarginToBreakLine,
  minimumPixelShade,
  minimumLineLengthAverage,
  minimumLineShadeAverage,
  averageStokeWeight,
} from './constants.js';

// "yarn serve" at the root of the repo
// then go to http://127.0.0.1:8080/sorted_face/index.html

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
      imgPixels[i].push(flatPixels.subarray((i * 4 * canvasWidth) + 4 * j, i * 4 * canvasWidth + 4 * j + 4))
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
  const threshold = 95

  let blackenedPixels = Array.from(Array(canvasHeight), () => new Array(canvasWidth));
  for (var i = 0; i < canvasHeight; i++) {
    for (var j = 0; j < canvasWidth; j++) {
      if (pix[i][j][0] < threshold)
        blackenedPixels[i][j] = [0, 0, 0, 0];
      else
        blackenedPixels[i][j] = [255, 255, 255, 255];
      set(j, i, blackenedPixels[i][j][0])
    }
  }
  pixels = blackenedPixels
  updatePixels();
  return new PixelMatrix(blackenedPixels);
}

/*
 * Returns true if the current pixel is different enough from precedent pixels
 * to either start or end a line there
 * param shadeSum: number - sum of shades of all pixels in the current line (if any)
 * param shadeAmount: number - number of pixel shades summed to obtain shadeSum
 * param currentPixelShade: number - shade of current pixel
 */
function startOrEndCondition(shadeSum, shadesAmount, currentPixelShade, currentMinimumLineLength = 0) {
  if (shadesAmount == 0) // no current line
    return currentPixelShade > minimumPixelShade && Math.random() < 0.95  // condition to start a new line
  else { // return wether we do continue on the current line
    if (shadesAmount < currentMinimumLineLength) return true;
    if (Math.abs(currentPixelShade - shadeSum) < (shadeSum / shadesAmount) + randInt(0, maximumShadeMarginToBreakLine)) {
      return true;
    }
    return false;
  }
}


function drawPure(matrixToFollow) {
  background(0);
  // const linesColor = [randInt(50, 255), randInt(0, 160), randInt(80, 255)];
  const linesColor = [255, 255, 255]
  for (var height = -500; height < canvasHeight; height += randomAround(averageStokeWeight, 0.8)) {
    if (Math.random() < 0.2) continue; // skip a line from time to time

    let curx = 0;
    let cury = height;
    let start = null;
    let end = null;
    let shadeSum = 0, shadesAmount = 0;
    let currentMinimumLineLength;
    while (curx < canvasWidth) {
      if (cury < 10) { // avoid border effects at the top of the picture
        curx += directionVector.x;
        cury += directionVector.y;
        continue;
      };
      let currentPixelShade = matrixToFollow.get(cury, curx)[0]
      if (startOrEndCondition(shadeSum, shadesAmount, currentPixelShade, currentMinimumLineLength)) {
        if (start == null) {
          currentMinimumLineLength = randomAround(minimumLineLengthAverage);
          start = new Element2D(curx, cury);
        } else {
          end = new Element2D(curx, cury);
        }
        shadeSum += currentPixelShade;
        shadesAmount += 1;
      } else {
        if (end != null) {
          // draw a line between start and end and reset both values
          let lineStart = start.translate(oppositeDirectionVector, randomExponentialAvg(backwardOverlapLengthAverage));
          let lineEnd = end.translate(directionVector, randomExponentialAvg(forwardOverlapLengthAverage));
          stroke(color([...linesColor, clip(shadeSum / shadesAmount + randInt(-20, 5), minimumLineShadeAverage, 255)]));
          strokeWeight(randomAround(averageStokeWeight, 0.8))
          line(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);

          // reset everything
          start = null;
          end = null;
          shadeSum = 0;
          shadesAmount = 0;
        }
      }
      curx += directionVector.x;
      cury += directionVector.y;
    }
  }
}


function setup() {
  createCanvas(canvasWidth, canvasHeight);
  image(img, 0, 0, canvasWidth, canvasHeight);
  colorMode(RGB);
  seed_random_modules()

  // put setup code here
  redraw()
  noLoop();
  smooth();

  // const blackenedPixels = blacken();
  // getImagePixels()
  drawPure(new PixelMatrix(getImagePixels()));
}


function draw() {
  // put drawing code here
}


window.draw = draw;
window.preload = preload;
window.setup = setup;