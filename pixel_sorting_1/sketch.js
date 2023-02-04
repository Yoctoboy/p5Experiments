// start chrome with
// chromium-browser --disable-web-security --allow-file-access-from-files --user-data-dir="Documents/perso/p5Experiments/tmp"

// replace these values with image size
let canvasWidth = 1920;
let canvasHeight = 1080;
let image_name = "cyberpunk_1.jpg"

let p5Image, pixmat;

let debug = false;

// controls how much glitch there will be in the picture, lower is more glitch
let glitch_factor = 0.3

function preload() {
  p5Image = loadImage('assets/' + image_name);
}


function seed_random_modules() {
  const random_seed = Math.floor(random(0, 900000));
  const perlin_seed = Math.floor(random(0, 900000));
  randomSeed(random_seed);
  noise_module.seed(perlin_seed)
  console.log("Random seed =", random_seed, "/ Perlin seed =", perlin_seed);
}

function compute_pixel_matrix(img) {
  // display image
  image(img, 0, 0, canvasWidth, canvasHeight);
  img.loadPixels();
  flat_pixels = img.pixels;
  var mat = new Array(canvasHeight).fill(0).map(_ => new Array(canvasWidth).fill(0));
  for (var line = 0; line < canvasHeight; line++) {
    for (var column = 0; column < canvasWidth; column++) {
      mat[line][column] = [
        flat_pixels[line * (4 * canvasWidth) + 4 * column],
        flat_pixels[line * (4 * canvasWidth) + 4 * column + 1],
        flat_pixels[line * (4 * canvasWidth) + 4 * column + 2],
        flat_pixels[line * (4 * canvasWidth) + 4 * column + 3]
      ]
    }
  }
  return mat;
}

function compute_brightness_regions(pixmat) {
  // compute pixel average and divide all pixels in 2 regions based on brightness
  var pixelsAmount = canvasHeight * canvasWidth;
  var pixelsSum = 0;
  pixmat.forEach(line => line.forEach(pixel => pixelsSum += (pixel[0] + pixel[1] + pixel[2]) / 3));
  pixelsSum /= pixelsAmount;

  pixelsSum *= glitch_factor;

  // each pixel is either in region 0 or 1
  let regionMat = new Array(canvasHeight).fill(0).map(_ => new Array(canvasWidth).fill(0));
  for (var line = 0; line < canvasHeight; line++) {
    for (var column = 0; column < canvasWidth; column++) {
      pixel = pixmat[line][column];
      brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;
      if (brightness > pixelsSum) regionMat[line][column] = 1;
      else regionMat[line][column] = 0;
    }
  }

  // display region matrix
  if (debug) {
    for (var line = 0; line < canvasHeight; line++) {
      for (var column = 0; column < canvasWidth; column++) {
        if (regionMat[line][column] == 1) set(column, line, color(255));
        else set(column, line, color(0));
      }
    }
    updatePixels();
  }
  return regionMat;
}

function pixel_sort(pixmat, region_map) {
  // for each column, take the first interval of 'bright' pixels and sort them
  var first_line, last_line;
  for (var column = 0; column < canvasWidth; column++) {
    first_line = 0;
    while (region_map[first_line][column] == 0) first_line++;
    last_line = first_line;
    while (region_map[last_line][column] == 1 && last_line < canvasHeight - 1) last_line++;
    pixColumnToSort = []
    for (var line = first_line; line <= last_line; line++) {
      pixColumnToSort.push(pixmat[line][column]);
    }
    // sort on brightness
    // pixColumnToSort.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
    // sort on  reverse brightness
    // pixColumnToSort.sort((a, b) => (b[0] + b[1] + b[2]) - (a[0] + a[1] + a[2]));

    // sort on red
    // pixColumnToSort.sort((a, b) => a[0] - b[0]);
    // sort on yellow
    pixColumnToSort.sort((a, b) => (a[0] + a[1]) - (b[0] + b[1]));
    // sort on blue
    //pixColumnToSort.sort((a, b) => a[2] - b[2]);
    for (var line = first_line; line <= last_line; line++) {
      set(column, line, pixColumnToSort[line - first_line])
    }
  }

  updatePixels();
}


function setup() {
  createCanvas(canvasWidth, canvasHeight)
  //background(0);
  colorMode(RGB);

  seed_random_modules()

  mat = compute_pixel_matrix(p5Image);
  regionMap = compute_brightness_regions(mat);
  pixel_sort(mat, regionMap);
}


function draw() {
}