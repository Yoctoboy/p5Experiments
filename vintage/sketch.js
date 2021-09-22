var canvas_width = 1400;
var canvas_height = 1400;


// put setup code here
var disks_per_line = 5;
var disks_lines = 12;
var disk_size = randomInterval(80, 100);
var min_reflections_alpha = 0.5;

function seed_random_modules(){
  const random_seed = Math.floor(random(0, 900000));
  const perlin_seed = Math.floor(random(0, 900000));
  randomSeed(random_seed);
  noise_module.seed(perlin_seed)
  console.log("Random seed =", random_seed, "/ Perlin seed =", perlin_seed);
}

class Point{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  translate(xdir, ydir){
    this.x += xdir;
    this.y += ydir;
  }
}

function generate_disks_centers(){
  // This variable will start by containing relative position (from coordinates 0, 0) and is then centered using the barycenter of all positions with the center
  var disks_centers = [];

  var gap_between_disks = randomInterval(disk_size * 1.1, disk_size * 1.2);

  var xbary = 0, ybary = 0;

  var cury = 0; curx = 0;
  random_start = randInt(0,1);
  for(var line = 0; line < disks_lines; line++){
    curx = 0;
    if((line + random_start) % 2 == 1) curx += gap_between_disks / 2;
    for(var disk = 0; disk < disks_per_line; disk++){
      let new_point = new Point(curx, cury);
      xbary += curx; ybary += cury;
      disks_centers.push(new_point);
      curx += gap_between_disks;
    }
    cury += Math.sqrt(3/4) * gap_between_disks;
  }

  xbary /= (disks_per_line * disks_lines); ybary /= (disks_per_line * disks_lines);
  translate_x = (canvas_width)/2 - xbary;
  translate_y = (canvas_height/2) - ybary;

  disks_centers.forEach(element => {
    element.translate(translate_x, translate_y);
  });

  return disks_centers
}

function draw_disks(disks_centers){

  var empty_center_size = disk_size / 4;
  var reflections_direction = randomInterval(0, 2 * PI); // rad
  var reflections_angle = randomInterval(PI / 4, (5/12) * PI); // rad, size of each reflection
  var reflections_amount = randInt(2, 3);
  var reflections_width = randInt(3, Math.min(5, (disk_size - empty_center_size) / (reflections_amount * 3)));
  var reflections_color = color(255, 255, 255);
  var disks_color = color(190, 0, 190);

  var gap_between_reflections = randomInterval(reflections_width * 1.5, ((disk_size - empty_center_size) / (reflections_amount + 1) ));  // gap between the center of each reflection
  var all_reflections_size = gap_between_reflections * (reflections_amount - 1) + reflections_width;
  var first_arc_diameter = randomInterval(empty_center_size + reflections_width, (disk_size - all_reflections_size));
  console.log(reflections_amount, reflections_width, gap_between_reflections, ((disk_size - empty_center_size) / reflections_amount));

  for(var i = 0; i < disks_centers.length; i++){
    // draw outside of disk
    stroke(0);
    fill(disks_color);
    circle(disks_centers[i].x, disks_centers[i].y, disk_size);

    // draw

    // draw empty center
    fill(0);
    circle(disks_centers[i].x, disks_centers[i].y, empty_center_size);

    // draw reflections
    noFill();
    strokeWeight(0.5);
    var arc_diameter = first_arc_diameter;
    for(var reflection = 0; reflection < reflections_amount; reflection++){
      for(var j = 0; j < reflections_width; j++){

        // compute color of the arc (lerpcolor between reflection_color and disk_color)
        var alpha_value = 1 - (1 - min_reflections_alpha) * norm(Math.abs(j - reflections_width / 2), 0, reflections_width / 2);
        arc_color = lerpColor(disks_color, reflections_color, alpha_value);
        stroke(arc_color);

        // compute angle for the arc we are going to draw
        var ellipse_a = (reflections_width/2), ellipse_b = reflections_angle;
        arc_angle = (ellipse_b/ellipse_a) * Math.sqrt((ellipse_a ** 2) - ((j-(reflections_width/2) ** 2)));

        arc(disks_centers[i].x, disks_centers[i].y, arc_diameter, arc_diameter, reflections_direction - (arc_angle / 2), reflections_direction + (arc_angle / 2));
        arc(disks_centers[i].x, disks_centers[i].y, arc_diameter, arc_diameter, PI + reflections_direction - (arc_angle / 2), PI + reflections_direction + (arc_angle / 2));

        // update diameter of each ray of reflections
        arc_diameter += 1;
      }
      arc_diameter += gap_between_reflections - reflections_width;
    }
  }
}


function setup() {
  createCanvas(canvas_width, canvas_height);
  smooth()
  background(0);
  colorMode(RGB);

  seed_random_modules()

  var disk_centers = generate_disks_centers();
  draw_disks(disk_centers);

}


function draw() {
}