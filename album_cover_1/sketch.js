/*
 * Greatly inspired by u/Mamboleoo's post on r/generative subreddit:
 * https://www.reddit.com/r/generative/comments/erl01u/how_to_generate_a_random_walkers_pattern/
 * This code also uses josephg/noisejs library for perlin and simplex noises:
 * https://github.com/josephg/noisejs
 */


let all_branches = [];


function setup() {
  createCanvas(1000, 1000);

  background(0);
  colorMode(RGB);

  // ensure the generated pattern is different on each page refresh
  // const perlin_seed = Math.floor(random(0, 900000));
  const perlin_seed = 468354;
  // GOOD SEEDS: 468354, 511720
  console.log(perlin_seed)
  noise_module.seed(perlin_seed);

  create_branches(1000);

  stroke(255);
  strokeWeight(1);
  blendMode(BLEND);
}

// higher factor makes the branches faster and makes them stay more grouped
// recommended range: [0.1, 10]
const noise_speed_factor = 0.2;

const min_speedy = -2;
const max_speedy = -1;

class Branch {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.prevx = x;
    this.prevy = y;
    this.speedx = random(2, 3);
    this.speedy = random(min_speedy, max_speedy);
    this.color = color(map(this.speedy, min_speedy, max_speedy, 120, 220), 0, 100, 40);
    this.visible = true;
  }

  move() {
    // updates current position of the branch
    this.speedx += noise_speed_factor * noise_module.simplex3(this.x * 0.002, this.y * 0.002, millis() * 0.001);
    this.speedy += noise_speed_factor * noise_module.simplex3(this.y * 0.002, this.x * 0.002, millis() * 0.001);
    this.x += this.speedx;
    this.y += this.speedy;
  }

  draw() {
    // draws a straight, semi-transparent line between former and current position of the branch
    if (this.visible) {
      stroke(this.color);
      line(this.prevx, this.prevy, this.x, this.y);
    }
  }

  update_visible() {
    // if the current position of the branch is outside the canvas' boundaries, do not draw it anymore
    this.prevx = this.x;
    this.prevy = this.y;
    if (this.x < -width || this.y < 0 || this.x > width || this.y > height) this.visible = false;
  }
}

function create_branches(amount) {
  all_branches = [];
  for (let i = 0; i < amount; i++) {
    const x = - width / 20;
    const y = height;
    //const x = width / 2;
    //const y = height / 2;
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