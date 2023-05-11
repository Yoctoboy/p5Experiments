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
  averageStrokeWeight,
  linesToSkipRatioAverage,
  clippingPower,
  lineBrightnessRandomAdjustmentMargin,
  minimumLineShade,
  defineConstants,
  lineAlpha,
  maximumLineShade,
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
      imgPixels[i].push(
        flatPixels.subarray((i * 4 * canvasWidth) + 4 * j, i * 4 * canvasWidth + 4 * j + 4)
      )
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
 * param shadeSum: rgb array - sum of shades of all pixels in the current line (if any)
 * param shadeAmount: number - number of pixel shades summed to obtain shadeSum
 * param currentPixelShade: rgb array - shade of current pixel
 */
function startOrEndConditionColored(shadeSum, shadesAmount, currentPixelShade, currentMinimumLineLength = 0) {
  // shadeSum and currentPixelShade are 3-uples (RGB colors from 0 to 255)
  const averageShade = (currentPixelShade[0] + currentPixelShade[1] + currentPixelShade[2]) / 3
  if (shadesAmount == 0) // no current line
    return averageShade > minimumPixelShade //&& Math.random() < 0.95  // condition to start a new line
  else { // return wether we do continue on the current line
    if (shadesAmount < currentMinimumLineLength) return true;
    if (Math.abs(currentPixelShade[0] - shadeSum[0]) < (shadeSum[0] / shadesAmount) + randInt(0, maximumShadeMarginToBreakLine)) {
      return true;
    }
    if (Math.abs(currentPixelShade[1] - shadeSum[1]) < (shadeSum[1] / shadesAmount) + randInt(0, maximumShadeMarginToBreakLine)) {
      return true;
    }
    if (Math.abs(currentPixelShade[2] - shadeSum[2]) < (shadeSum[2] / shadesAmount) + randInt(0, maximumShadeMarginToBreakLine)) {
      return true;
    }
    return false;
  }
}


function drawPure(matrixToFollow) {


  const linesColor = [randInt(100, 255), randInt(0, 160), randInt(80, 255)];
  // const linesColor = [230, 110, 200]
  // const linesColor = [255, 255, 255]
  for (var height = -Math.max(canvasHeight, canvasWidth); height < canvasHeight; height += randomAround(averageStrokeWeight, 0.8)) {
    if (Math.random() < randomAround(linesToSkipRatioAverage, 0.5)) continue; // skip a line from time to time

    let curx = 0;
    let cury = height;
    let start = null;
    let end = null;
    let shadeSum = [0, 0, 0], shadesAmount = 0;
    let currentMinimumLineLength;
    while (curx < canvasWidth && cury < canvasHeight) {
      if (cury < 2 * forwardOverlapLengthAverage || curx < 2 * backwardOverlapLengthAverage) { // avoid border effects at the top of the picture
        curx += directionVector.x;
        cury += directionVector.y;
        continue;
      };
      // console.log(shadeSum)
      let currentPixelShade = matrixToFollow.get(cury, curx)
      if (startOrEndConditionColored(shadeSum, shadesAmount, currentPixelShade, currentMinimumLineLength)) {
        if (start == null) {
          currentMinimumLineLength = randomAround(minimumLineLengthAverage);
          start = new Element2D(curx, cury);
        } else {
          end = new Element2D(curx, cury);
        }
        shadeSum = shadeSum.map((currentShadeSum, index) => currentShadeSum + currentPixelShade[index]);
        shadesAmount += 1;
      } else {
        if (end != null) {
          // draw a line between start and end and reset both values
          let lineStart = start.translate(oppositeDirectionVector, randomExponentialAvg(backwardOverlapLengthAverage));
          let lineEnd = end.translate(directionVector, randomExponentialAvg(forwardOverlapLengthAverage));
          let heightRandomOffset = randomInterval(0.5, 0.5);
          const lineColor = shadeSum.map(shade => shade / shadesAmount)
          const randomBrightnessAdjustment = randInt(-lineBrightnessRandomAdjustmentMargin, lineBrightnessRandomAdjustmentMargin);
          stroke(color([...(lineColor.map(shade => poweredClip(shade + randomBrightnessAdjustment, minimumLineShade, maximumLineShade, clippingPower))), lineAlpha]));
          strokeWeight(randomAround(averageStrokeWeight, 0.8))
          line(lineStart.x, lineStart.y + heightRandomOffset, lineEnd.x, lineEnd.y + heightRandomOffset);

          // reset everything
          start = null;
          end = null;
          shadeSum = [0, 0, 0];
          shadesAmount = 0;
        }
      }
      curx += directionVector.x;
      cury += directionVector.y;
    }
  }
}

class SquareFrame {

  constructor() { }

  drawAll(frameSize, frameColor) {
    color(frameColor)
    for (var x = 0; x < canvasWidth; x++) {
      for (var y = 0; y < frameSize; y++) set(x, y, frameColor);
      for (var y = canvasHeight - frameSize; y < canvasHeight; y++) set(x, y, frameColor);
    }

    for (var y = frameSize; y <= canvasHeight - frameSize; y++) {
      for (var x = 0; x < frameSize; x++) set(x, y, frameColor);
      for (var x = canvasWidth - frameSize; x < canvasWidth; x++) set(x, y, frameColor);
    }
    updatePixels();
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
  noSmooth();
  smooth();

  // const blackenedPixels = blacken();
  // getImagePixels()

  background(0);
  // blendMode(BLEND)

  // blendMode(LIGHTEST) // very bright
  blendMode(ADD) // default
  // blendMode(); // do not reset background with this blendMode
  // blendMode(SOFT_LIGHT) // do not reset background with this blendMode
  // blendMode(OVERLAY) // do not reset background with this blendMode
  // blendMode(DODGE) // do not reset background with this blendMode

  const matrixToFollow = getImagePixels()
  let pass = 1
  while (pass <= 3) {
    defineConstants(pass)
    drawPure(new PixelMatrix(matrixToFollow));
    pass++;
  }

  // new SquareFrame().drawAll(260, 255);
}


function draw() {
  // put drawing code here
}


window.draw = draw;
window.preload = preload;
window.setup = setup;