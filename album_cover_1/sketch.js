import { draw_bottom_branches } from "./bottom_branches.js"


function setup() {
  console.log("ok");
  createCanvas(1000, 1000);

  background(0);
  colorMode(RGB);


  draw_everything();


  stroke(255);
  strokeWeight(1);
  blendMode(BLEND);
}


function draw_everything() {
  draw_bottom_branches();
}


window.setup = setup;