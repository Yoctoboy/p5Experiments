/* Use a Perlin noise map as a density map to draw many small gradient rectangles
 */


function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

var canvasWidth = 2000;
var canvasHeight = 2000;
var density_factor = 0.0015; // the lower, the higher the 'zoom' on the perlin noise map
// var noise_seed = 1;  // set seed
var noise_seed = Math.floor(getRandomFloat(0, 1000000));  // random random seed
console.log("noise_seed =", noise_seed);
noise_module.seed(noise_seed);


function setup() {
  let start_time = Date.now();
  createCanvas(canvasWidth, canvasHeight);
  background(0);
  colorMode(RGB);

  let noise_value;
  let col;
  for (var i = 0; i < canvasWidth; i += 1) {
    for (var j = 0; j < canvasHeight; j += 1) {
      noise_value = (noise_module.perlin2(density_factor * i, density_factor * j) + 1) / 2; // between 0 and 1
      col = color(255 * noise_value, 255 * noise_value, 255 * noise_value);
      set(i, j, col);
    }
    // console.log(i, "/", canvasWidth);
  }
  updatePixels()
  let end_time = Date.now();
  var execution_time = (end_time - start_time) / 1000;
}



function draw() {
  // put drawing code here
}