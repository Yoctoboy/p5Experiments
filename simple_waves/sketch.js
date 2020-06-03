let all_waves = [];
const saturation = 20;
const brightness = 100;
const noise_speed_factor = 0.5;

// not a reachable value so you may want to increase this in order to get bigger y moves
const min_max_y_speed = 3;

let cur_x, max_x;
let x_speed, y_speed;




function setup() {
  createCanvas(1920, 1080);

  background(0);
  colorMode(HSB);

  noise_module.seed(random(0, 100000));

  blendMode(BLEND);
  amount = Math.floor(random(2, 15));
  create_waves(amount);
}


class Wave {
  constructor(base_x, base_y, color, thickness) {
    this.x = base_x;
    this.y = base_y;
    this.prevx = base_x;
    this.prevy = base_y;
    this.color = color;
    this.thickness = thickness;
    this.visible = true;
  }

  draw(x_speed, y_speed) {
    this.x += x_speed;
    this.y += y_speed;
    stroke(this.color);
    line(this.prevx, this.prevy, this.x, this.y);
    this.prevx = this.x;
    this.prevy = this.y;
  }
}


function create_waves(amount) {
  /* define waves starting positions */

  // ensure the final drawing will be horinzontally centered
  cur_x = max(0, min(0.45 * width, randomGaussian(width / 6, 150)));
  max_x = width - cur_x;

  // ensure the final drawing will be vertically centered
  y_offset = random(12, 35);
  middle_y = height / 2;
  base_y = middle_y - (amount / 2 * y_offset);

  // set global stroke weight before drawing
  thickness = y_offset / 5;
  strokeWeight(thickness);

  // choose initial color and offset between each line
  base_hue = random(0, 360);
  hue_offset = random(120 / amount, 360 / amount);

  for (let i = 0; i < amount; i++) {
    col = color((base_hue + i * hue_offset) % 360, saturation, brightness);
    all_waves.push(new Wave(cur_x, base_y + i * y_offset, col, thickness));
  }

  y_speed = random(-2, 2);
  x_speed = 15;
}


function draw() {
  // put drawing code here
  // create a random line with perlin noise
  if (cur_x < max_x) {
    all_waves.forEach(wave => wave.draw(x_speed, y_speed));
    y_speed = min_max_y_speed * noise_module.perlin3(0.005 * cur_x, 0.002 * y_speed, random(0, 0.001));
    y_speed = min(min_max_y_speed, max(-min_max_y_speed, y_speed));
    cur_x += x_speed;
  }
}