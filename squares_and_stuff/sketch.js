/* Use a Perlin noise map as a density map to draw many small gradient rectangles
 */


function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

var canvas_width = 2000;
var canvas_height = 2000;
var density_factor = 0.007; // the lower, the higher the 'zoom' on the perlin noise map
// var noise_seed = 1;  // set seed
var noise_seed = Math.floor(getRandomFloat(0, 1000000));  // random random seed
console.log("noise_seed =", noise_seed);
noise_module.seed(noise_seed);

// Define static width and length of each rectangle
const rectangle_width = 24;
const rectangle_height = 4;
let rectangle_color, background_color;


function setup() {
  let start_time = Date.now();
  // rectangle_color = color(80, 0, 80);
  rectangle_color = color(180, 0, 150, 80);
  // background_color = color(180, 255, 255);
  background_color = color(0, 0, 0);
  createCanvas(canvas_width, canvas_height);
  background(background_color);
  colorMode(RGB);
  strokeWeight(1);
  blendMode(BLEND);
  //blendMode(LIGHTEST);


  let noise_value, adjusted_noise_value;
  let rectangles_drawn = 0;
  for (var i = -rectangle_width; i < canvas_width; i += 1) {
    for (var j = -rectangle_height; j < canvas_height; j += 1) {
      noise_value = (noise_module.perlin2(density_factor * i, density_factor * j) + 1) / 2; // between 0 and 1
      adjusted_noise_value = Math.pow(noise_value, 11) * 500;
      if (getRandomFloat(0, 1) < adjusted_noise_value) {
        draw_random_square(i, j);
        rectangles_drawn += 1;
        if (rectangles_drawn % 50000 == 0) {
          var percentage_done = (((i + rectangle_width) / (canvas_width + rectangle_width)) * 100).toFixed(1);
          console.log(`${rectangles_drawn} rectangles, approx ${percentage_done}% done`);
        }
      }
    }
    // console.log(i, "/", canvas_width);
  }
  let end_time = Date.now();
  var execution_time = (end_time - start_time) / 1000;
  console.log(`${rectangles_drawn} rectangles drawn in ${execution_time}s`);
}


function draw_random_square(x, y) {
  // console.log("rectangle:", x, y);
  for (var i = 0; i < rectangle_width; i += 1) {
    stroke(lerpColor(background_color, rectangle_color, (i + 1) / rectangle_width));
    line(x + i, y, x + i, y + rectangle_height);
  }
}


function draw() {
  // put drawing code here
}