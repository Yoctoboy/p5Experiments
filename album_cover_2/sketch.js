var canvasWidth = 1230;
var canvasHeight = 1230;
let img;

function seed_random_modules() {
  const random_seed = Math.floor(random(0, 900000));
  const perlin_seed = Math.floor(random(0, 900000));
  randomSeed(random_seed);
  noise_module.seed(perlin_seed)
  console.log("Random seed =", random_seed, "/ Perlin seed =", perlin_seed);
}

class Element2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = Math.pow(x * x + y * y, 0.5);
  }

  normalize() {
    this.length = 1;
    return new Element2D(this.x / this.length, this.y / this.length);
  }

  distance(point) {
    return Math.pow(Math.pow(this.x - point.x, 2) + Math.pow(this.y - point.y, 2), 0.5);
  }

  translate(vector, length = 1) { // vector is Element2D
    // translate a point or add a vector to an other vector
    vector = vector.normalize();
    return new Element2D(this.x + vector.x * length, this.y + vector.y * length);
  }
}

class SortedPixelGroup {
  constructor(startPoints, maxLength, directionVector) {
    this.startPoints = startPoints;
    this.maxLength = maxLength;
    this.directionVector = directionVector;
  }
}


function setup() {
  createCanvas(canvasWidth, canvasHeight);

  seed_random_modules()

  // put setup code here
  img = new Image();
  img.src = './background_neg.jpg'
  //background(img)
  //img.hide();

  drawingContext.drawImage(img, 0, 0);
  blendMode(BLEND);
  //smooth();
  colorMode(RGB);
  const lineWidth = 2;
  // circlePoints are sorted from left to right
  sortedPixelGroups = buildSortedPixelGroups(lineWidth);
  //circlePoints.forEach(p => point(p.x, p.y))
  drawLines(sortedPixelGroups, lineWidth);
}

function buildSortedPixelGroups(lineWidth) {
  var startPoints1 = [];
  var startPoints2 = [];
  // left side group
  for (var y = 470; y <= 550; y += lineWidth) startPoints1.push(new Element2D(canvasWidth - 200, y));
  // right side group
  for (var y = canvasHeight - 550; y <= canvasHeight - 470; y += lineWidth) startPoints2.push(new Element2D(200, y));

  return [
    new SortedPixelGroup(startPoints2, maxLength = 700, directionVector = new Element2D(1, 0)),
    new SortedPixelGroup(startPoints1, maxLength = 700, directionVector = new Element2D(-1, 0)),
  ];
}

var x = 0;
function drawLines(sortedPixelGroups, lineWidth) {
  strokeWeight(0);
  for (const sortedPixelGroup of sortedPixelGroups) {
    for (const p of sortedPixelGroup.startPoints) {
      // start and end of a long line of smaller pixel sorted lines
      var sortedPixelLineStart = p;
      var sortedPixelLineStartColor = color(210, 0, 150, 200);
      var sortedPixelLineEndColor = color(50, 0, 50, 0);

      var currentStartVector = new Element2D(0, 0);
      while (currentStartVector.length <= sortedPixelGroup.maxLength) {
        // current line start is sortedPixelLineStart + currentStartVector
        var currentSquareStart = sortedPixelLineStart.translate(currentStartVector);
        // build a single line
        singleLineLength = randomInterval(15, sortedPixelGroup.maxLength / 2);

        for (var _x = 0; _x <= singleLineLength; _x += lineWidth) {
          //fill(lerpColor(sortedPixelLineStartColor, sortedPixelLineEndColor, (singleLineLength - currentSquareStart.length) / singleLineLength));
          fill(255);
          square(currentSquareStart.x, currentSquareStart.y, lineWidth, 0, 0, 0, 0);

          currentSquareStart = currentSquareStart.translate(sortedPixelGroup.directionVector, lineWidth);
        }
        currentStartVector = currentStartVector.translate(sortedPixelGroup.directionVector, singleLineLength);
      }
    }
  }
}

function draw() {

}