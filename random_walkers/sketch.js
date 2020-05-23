/*
 * Greatly inspired by u/Mamboleoo's post on r/generative subreddit:
 * https://www.reddit.com/r/generative/comments/erl01u/how_to_generate_a_random_walkers_pattern/
 * This code also uses josephg/noisejs library for perlin and simplex noises:
 * https://github.com/josephg/noisejs
 */


let all_branches = [];


function setup() {
  createCanvas(1800, 1075);

  background(0);
  colorMode(RGB);

  // ensure the generated pattern is different on each page refresh
  noise_module.seed(random(0, 100000));

  create_branches(1000);

  stroke(255);
  strokeWeight(1);
  blendMode(BLEND);
}

// higher factor makes the branches faster and makes them stay more grouped
// recommended range: [0.1, 10]
const noise_speed_factor = 1;

class Branch {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.prevx = x;
    this.prevy = y;
    this.color = color(random(100, 200), random(100, 200), random(100, 200));
    this.speedx = random(-5, 5);
    this.speedy = random(-5, 5);
    this.visible = true;
  }

  move() {
    // updates current position of the branch
    this.speedx += noise_speed_factor * noise_module.simplex3(this.x * 0.003, this.y * 0.003, millis() * 0.0001);
    this.speedy += noise_speed_factor * noise_module.simplex3(this.y * 0.003, this.x * 0.003, millis() * 0.0001);
    this.x += this.speedx;
    this.y += this.speedy;
  }

  draw() {
    // draws a straight, semi-transparent line between former and current position of the branch
    if (this.visible) {
      stroke(255, 255, 255, 50);
      line(this.prevx, this.prevy, this.x, this.y);
    }
  }

  update_visible() {
    // if the current position of the branch is outside the canvas' boundaries, do not draw it anymore
    this.prevx = this.x;
    this.prevy = this.y;
    if (this.x < 0 || this.y < 0 || this.x > width || this.y > height) this.visible = false;
  }
}

function create_branches(amount) {
  all_branches = [];
  for (let i = 0; i < amount; i++) {
    const x = min(width, max(0, randomGaussian(width / 2, 20)));
    const y = height / 2;
    all_branches.push(new Branch(x, y));
  }
}

function draw() {
  all_branches.forEach(branch => {
    branch.move();
    branch.draw();
    branch.update_visible();
  })
}