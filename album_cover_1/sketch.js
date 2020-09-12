import { draw_bottom_branches } from "./bottom_branches.js"
import { draw_polygons } from "./polygons.js"


function setup() {
  createCanvas(1000, 1000);

  background(0);
  colorMode(RGB);


  draw_everything();


  stroke(255);
  strokeWeight(1);
}


function draw_everything() {
  draw_bottom_branches();
  draw_polygons();
}


window.setup = setup;