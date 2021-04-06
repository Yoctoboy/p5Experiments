let canvas_width = 2000;
let canvas_height = 2000;
let branches_amount = 2000;

let min_alpha_position = 350;
let max_alpha_position = 1000;
let min_alpha_value = 1;
let max_alpha_value = 105;


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
  horizontal_branches_lengths = get_branches_lengths(1000, 19);
  vertical_branches_lengths = get_branches_lengths(1000, 8);
  branches_ystarts.forEach(ystart => {
    all_branches.push(new Branch(ystart, horizontal_branches_lengths, vertical_branches_lengths));
  });

  // draw branches
  for(var i = 0; i < branches_amount; i++){
    all_branches[i].draw();
    if(i % 100 == 0) console.log(i, "/", branches_amount, "done")
  }
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
    this.vvector = createVector(3, -8).normalize();
    this.horizontal_branches_lengths = horizontal_branches_lengths;
    this.vertical_branches_lengths = vertical_branches_lengths;
    this.alpha = map(ystart, min_alpha_position, max_alpha_position, min_alpha_value, max_alpha_value, true);
    this.left_color = color(100, 10, 200, this.alpha);
    this.right_color = color(50, 200, 110, this.alpha);
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