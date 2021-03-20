let canvas_width = 1000;
let canvas_height = 1000;
let branches_amount = 10;

let min_alpha_position = 600;
let max_alpha_position = 1000;
let min_alpha_value = 1;
let max_alpha_value = 255;


function setup() {
  createCanvas(canvas_width, canvas_height);

  background(0);
  colorMode(RGB);

  blendMode(SCREEN);
  strokeWeight(1);

  // setup code here
  branches_ystarts = new Array(branches_amount).fill(0).map(_ => canvas_height - randomExponential(1/200));


  // create branches
  all_branches = [];
  horizontal_branches_lengths = get_branches_lengths(1000, 11);
  vertical_branches_lengths = get_branches_lengths(1000, 4);
  branches_ystarts.forEach(ystart => {
    all_branches.push(new Branch(ystart, horizontal_branches_lengths, vertical_branches_lengths));
  });

  // draw branches
  all_branches.forEach(branch => {
    branch.draw();
  });

  console.log("done");
}


function get_branches_lengths(amount, mean){
  var lengths = [];
  for(var i = 0; i < amount; i ++){
    lengths.push(randomExponential(1/mean));
  }
  return lengths;
}


class Branch{
  constructor(ystart, horizontal_branches_lengths, vertical_branches_lengths){
    this.curx = 0;
    this.cury = ystart;
    this.hvector = createVector(11, 1).normalize();
    this.vvector = createVector(2, -7).normalize();
    this.horizontal_branches_lengths = horizontal_branches_lengths;
    this.vertical_branches_lengths = vertical_branches_lengths;
    this.alpha = map(ystart, min_alpha_position, max_alpha_position, min_alpha_value, max_alpha_value, true);
    console.log(this.alpha);
    this.left_color = color(200, 10, 210, this.alpha);
    this.right_color = color(200, 150, 50, this.alpha);
  }

  draw(){
    var direction = "h";  // h = hvector, v = vvector
    var newx, newy;
    var col;
    for(var i = 0; i < Math.min(this.horizontal_branches_lengths.length, this.vertical_branches_lengths.length); i++){
      if (direction == "h"){
        newx = this.curx + this.horizontal_branches_lengths[i] * this.hvector.x;
        newy = this.cury + this.horizontal_branches_lengths[i] * this.hvector.y;
        direction = "v";
      }
      else if (direction == "v"){
        newx = this.curx + this.vertical_branches_lengths[i] * this.vvector.x;
        newy = this.cury + this.vertical_branches_lengths[i] * this.vvector.y;
        direction = "h";
      }
      col = lerpColor(this.left_color, this.right_color, this.curx/canvas_width);
      console.log(col);
      stroke(col);
      line(this.curx, this.cury, newx, newy);
      this.curx = newx;
      this.cury = newy;
      if (this.curx > canvas_width){
        break;
      }
    }
  }
}


function draw() {

}