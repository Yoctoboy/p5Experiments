var canvas_width = 1000;
var canvas_height = 1000;

let all_branches = [];
let drawing_step = 0;

function setup() {
  createCanvas(canvas_width, canvas_height);

  blendMode(ADD);
  background(0);
  colorMode(RGB);

  noise_module.seed(1);
  randomSeed(2);

  stroke(255);

  // put setup code here
  all_branches.push(new Branch(250, 1000, direction=createVector(4, -5), division_rate=0.01, width=30))
}


class Branch{
  constructor(xstart, ystart, direction, division_rate, width){
    this.curx = xstart;
    this.cury = ystart;
    this.direction = direction.normalize();
    this.division_rate = division_rate;
    this.width = width;
    this.is_active = true;
    this.last_division = -100000;
  }

  draw(){
    // this function returns an array of new branches if the current one divided during this frame
    if (!this.is_active) return [];

    // draw the next line for this branch
    orthogonal_vector = get_orthogonal_vector(this.direction);
    line(
      this.curx + orthogonal_vector.x * (this.width/2),
      this.cury + orthogonal_vector.y * (this.width/2),
      this.curx - orthogonal_vector.x * (this.width/2),
      this.cury - orthogonal_vector.y * (this.width/2),
    )

    // update all values
    this.update_position();
    this.update_width();
    this.update_direction();
    this.update_activity();

    // decide division of branch
    return this.get_new_branches();
  }

  get_new_branches(){
    var new_branches = [];
    var random_angle, new_direction, new_division_rate;
    while(Math.random() < this.division_rate && drawing_step - this.last_division > 80){

      // compute random direction on the left or right of current branch
      random_angle = 2 * (Math.random() - 0.5); // between -1 & 1
      random_angle *= HALF_PI/2; // between -PI/4 and PI/4
      if (random_angle < 0) random_angle -= HALF_PI/2;
      else random_angle += HALF_PI/2;
      new_direction = p5.Vector.rotate(this.direction, random_angle);

      new_division_rate = this.division_rate / 2;

      new_branches.push(
        new Branch(
          this.curx,
          this.cury,
          direction=new_direction,
          division_rate=this.division_rate / 2,
          width=getRandomArbitrary(0, this.width/2)
        )
      )

      this.last_division = drawing_step;

    }
    return new_branches;
  }

  update_width(){
    this.width -= 0.01;
  }

  update_direction(){
    var random_perlin = noise_module.simplex2(this.curx, this.cury) * (0.01);
    this.direction.rotate(random_perlin);
  }

  update_position(){
    this.curx += this.direction.x * 0.5;
    this.cury += this.direction.y * 0.5;
  }

  update_activity(){
    if (!(-200 <= this.curx <= canvas_height + 200)) this.is_active = false;
    if (!(-200 <= this.cury <= canvas_width + 200)) this.is_active = false;
    if(this.width < 0.01) this.is_active = false;
  }
}


function draw() {

  var new_branches = [];
  all_branches.forEach(branch => new_branches.push(...branch.draw()));
  all_branches.push(...new_branches);
  drawing_step += 1;

  all_branches = all_branches.filter(branch => branch.is_active === true);

  console.log(all_branches.length);

  // terminate the program by using an unexisting function
  if(all_branches.length == 0) fail();
}