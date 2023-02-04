var canvasWidth = 1000;
var canvasHeight = 1000;

let all_branches = [];
let drawing_step = 0;

let perlin_base_factor = 0.018;


// NICE SEEDS
// Random seed = 624793 / Perlin seed = 221390
// Random seed = 580955 / Perlin seed = 432440
function seed_random_modules() {
  const random_seed = Math.floor(random(0, 900000));
  const perlin_seed = Math.floor(random(0, 900000));
  randomSeed(random_seed);
  noise_module.seed(perlin_seed)
  console.log("Random seed =", random_seed, "/ Perlin seed =", perlin_seed);
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);

  blendMode(ADD);
  //blendMode(EXCLUSION);
  background(0);
  colorMode(RGB);

  seed_random_modules()

  stroke(255);

  // put setup code here
  all_branches.push(new Branch(200, 1050, direction = createVector(3, -5), division_rate = 0.03, width = 62));

  draw_tree();
  write_text();
}


function draw_tree() {
  while (all_branches.length != 0) {
    var new_branches = [];
    all_branches.forEach(branch => new_branches.push(...branch.draw()));
    all_branches.push(...new_branches);
    drawing_step += 1;

    all_branches = all_branches.filter(branch => branch.is_active);
  }
}


class Branch {
  constructor(xstart, ystart, direction, division_rate, width) {
    this.curx = xstart;
    this.cury = ystart;
    this.direction = direction.normalize();
    this.division_rate = division_rate;
    this.width = width;
    this.is_active = true;
    this.last_division = drawing_step;
    this.perlin_noise_factor = perlin_base_factor;
    this.color_state = "white";
  }

  draw() {
    // this function returns an array of new branches if the current one divided during this frame
    if (!this.is_active) return [];

    this.update_color_and_perlin_factor();

    // draw the next line for this branch
    orthogonal_vector = get_orthogonal_vector(this.direction);
    line(
      this.curx + orthogonal_vector.x * (this.width / 2),
      this.cury + orthogonal_vector.y * (this.width / 2),
      this.curx - orthogonal_vector.x * (this.width / 2),
      this.cury - orthogonal_vector.y * (this.width / 2),
    )

    // update all values
    this.update_position();
    this.update_width();
    this.update_direction();
    this.update_division_rate();
    this.update_activity();

    // decide division of branch
    return this.get_new_branches();
  }

  get_new_branches() {
    var new_branches = [];
    var random_uniform, random_angle, new_direction, new_division_rate;
    while ((Math.random() < this.division_rate && drawing_step - this.last_division > 200) || (drawing_step - this.last_division > 420)) {

      // compute random direction on the left or right of current branch
      random_uniform = Math.random();
      if (random_uniform < 0.5) random_angle = randomInterval(-HALF_PI / 2.2, -HALF_PI / 4);
      else random_angle = randomInterval(HALF_PI / 2.2, HALF_PI / 4);
      new_direction = p5.Vector.rotate(this.direction, random_angle);

      new_division_rate = 0.8 * this.division_rate;

      new_branches.push(
        new Branch(
          this.curx,
          this.cury,
          direction = new_direction,
          division_rate = 0.5 * this.division_rate,
          width = randomInterval(0.4 * this.width, 0.7 * this.width)
        )
      )

      // update last_division timestamp to avoid looping forever here
      this.last_division = drawing_step;
    }
    return new_branches;
  }

  update_position() {
    this.curx += this.direction.x * 0.5;
    this.cury += this.direction.y * 0.5;
  }

  update_width() {
    if (this.width > 30) this.width -= 0.03;
    else if (this.width > 10) this.width -= 0.02;
    else this.width -= 0.007;

    this.width += noise_module.simplex2(this.curx, this.cury) * 0.2;
  }

  update_direction() {
    var random_perlin = noise_module.simplex2(this.curx, this.cury) * this.perlin_noise_factor;
    this.direction.rotate(random_perlin);
  }

  update_division_rate() {
    // increase division rate if width is low
    if (this.width < 5) {
      this.division_rate = 0.03;
    }
  }

  update_activity() {
    if (!(-200 <= this.curx <= canvasHeight + 200)) this.is_active = false;
    if (!(-200 <= this.cury <= canvasWidth + 200)) this.is_active = false;
    if (this.width < 0.001) this.is_active = false;
  }

  update_color_and_perlin_factor() {
    if (this.width < 1 && drawing_step > canvasWidth * 1.7) {
      this.color_state = "red";
    }

    if (this.color_state == "red") {
      stroke(200, 20, 50, 255);
      this.perlin_noise_factor = perlin_base_factor * 10;
    }
    else {
      stroke(255, 255, 255, 255);
      this.perlin_noise_factor = perlin_base_factor;
    }
  }
}

function write_text() {
  stroke(0);
  textAlign(CENTER, CENTER);
  blendMode(EXCLUSION);
  textSize(45);
  fill(255);
  text("aleph", canvasWidth / 2, canvasHeight / 3 - 30)
  //fill(255,0,0);
  text("blood tree", canvasWidth / 2, canvasHeight / 3 + 30);
}

function draw() {

}