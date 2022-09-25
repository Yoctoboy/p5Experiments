// wood_lake & night_lights
var canvasWidth = 1230;
var canvasHeight = 1230;

let img;

var randomFunctionCalls = 0;
function randomSeeded(min = 0, max = 1) {
  // will work for as long as it is used for setup only, as random draw effect
  // will trigger this function in unpredictable way when changing constants
  randomFunctionCalls += 1;
  return map(
    noise_module.simplex3(
      (1.18416541 * randomFunctionCalls),
      (globalThis.randomSeed + 1.124568 * randomFunctionCalls),
      (3 * globalThis.randomSeed + 1.45971 * randomFunctionCalls)
    ),
    -1, 1, min, max);
}


class Branch {
  constructor(x, y, alpha, lineWidth, movementVariabilityFactor, colorVariabilityFactor, noiseSpeedFactor) {
    this.x = x
    this.y = y
    this.oldx = x;
    this.oldy = y;
    //this.startVectorVariabilityFactor = 0.002;
    this.movementVariabilityFactor = movementVariabilityFactor;
    this.colorVariabilityFactor = colorVariabilityFactor;
    this.noiseSpeedFactor = noiseSpeedFactor;
    this.speedVector = new p5.Vector(
      randomSeeded(-3.5, -3),
      randomSeeded(2, 2.5)
    )
    this.speedVectorNorm = this.speedVector.mag();
    this.normalizedSpeedVector = new p5.Vector(this.speedVector.x, this.speedVector.y).normalize();
    this.visible = true;
    this.alpha = alpha;
    this.overlayCompensationFactor = 0.95;
    this.lineWidth = lineWidth
  }


  draw() {
    if (this.visible) {
      // updates current position of the branch
      this.oldx = this.x + (this.lineWidth * this.overlayCompensationFactor * this.normalizedSpeedVector.x);
      this.oldy = this.y + (this.lineWidth * this.overlayCompensationFactor * this.normalizedSpeedVector.y);
      this.speedVector.x += this.noiseSpeedFactor * noise_module.simplex3(this.x * this.movementVariabilityFactor, this.y * this.movementVariabilityFactor, 0);
      this.speedVector.y += this.noiseSpeedFactor * noise_module.simplex3(this.y * this.movementVariabilityFactor + 200, this.x * this.movementVariabilityFactor, 0);
      this.speedVector.normalize().mult(this.speedVectorNorm)
      this.x += this.speedVector.x;
      this.y += this.speedVector.y;

      // draws a straight, semi-transparent line between former and current position of the branch
      strokeWeight(this.lineWidth);
      stroke(
        map(noise_module.simplex3(this.x * this.colorVariabilityFactor, this.y * this.colorVariabilityFactor, 0), -1, 1, 50, 255),
        map(noise_module.simplex3(this.y * this.colorVariabilityFactor + 200, this.x * this.colorVariabilityFactor, 0), -1, 1, 50, 200),
        map(noise_module.simplex3(this.x * this.colorVariabilityFactor + 400, this.y * this.colorVariabilityFactor, 10), -1, 1, 50, 255),
        this.alpha
      );
      // stroke(200, 0, 200, 12)
      line(this.oldx, this.oldy, this.x, this.y);
    }
  }

  update_visible() {
    // if the current position of the branch is outside the canvas' boundaries, do not draw it anymore
    if (this.y < -100 || this.x < 0 || this.x > canvasWidth || this.y > canvasHeight) this.visible = false;
  }
}

class RandomWalkers {
  // higher factor makes the branches faster and makes them stay more grouped
  // recommended range: [0.1, 10]

  constructor(amount, alpha, lineWidth, maxSteps) {
    this.amount = amount
    this.allBranches = [];
    this.alpha = alpha
    this.lineWidth = lineWidth ?? 1;
    this.maxSteps = maxSteps
  }

  create_branches() {
    var movementVariabilityFactor = randomSeeded(0.0005, 0.0008);
    var colorVariabilityFactor = randomSeeded(0.00035, 0.0005);
    var noiseSpeedFactor = randomSeeded(0.09, 0.15);
    var startPositionLeft = new p5.Vector(400, -100)
    var startPositionRight = new p5.Vector(1000, 290);
    var branches = [];
    for (let i = 0; i < this.amount; i++) {
      const x = lerp(startPositionLeft.x, startPositionRight.x, i / this.amount);
      const y = lerp(startPositionLeft.y, startPositionRight.y, i / this.amount);
      branches.push(new Branch(x, y, this.alpha, this.lineWidth, movementVariabilityFactor, colorVariabilityFactor, noiseSpeedFactor));
    }
    return branches;
  }

  drawAll() {
    var step = 0;
    var allBranches = this.create_branches();
    while (allBranches.length > (this.amount * 0.001) && step < this.maxSteps) {
      step++;
      allBranches = allBranches.filter(branch => branch.visible);
      allBranches.forEach(branch => {
        branch.draw();
        branch.update_visible();
      })
      if (step % 10 == 0) console.log("step", step, "/ branches left", allBranches.length);
    }
  }
}

function seed_random_modules(perlinSeed, randomSeed) {
  // nice values: 227504
  perlinSeed = perlinSeed ?? Math.floor(random(0, 900000));
  noise_module.seed(perlinSeed)
  globalThis.randomSeed = randomSeed ?? Math.floor(random(0, 900000));
  console.log("Perlin seed =", perlinSeed, "/ Random seed =", globalThis.randomSeed);
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

class PixelSortedLines {
  constructor(lineWidth, layers) {
    this.lineWidth = lineWidth;
    this.layers = layers;
  }

  buildSortedPixelGroups() {
    var startPoints1 = [];
    var startPoints2 = [];
    // left side group
    for (var y = canvasHeight - 550; y <= canvasHeight - 470; y += this.lineWidth) startPoints1.push(new Element2D(canvasWidth - 200, y));
    // right side group
    for (var y = 470; y <= 550; y += this.lineWidth) startPoints2.push(new Element2D(200, y));

    return [
      new SortedPixelGroup(startPoints2, 800, new Element2D(1, 0)),
      new SortedPixelGroup(startPoints1, 800, new Element2D(-1, 0)),
    ];
  }

  drawLines(sortedPixelGroups) {
    var singleLineLength, firstLine
    for (const sortedPixelGroup of sortedPixelGroups) {
      for (const p of sortedPixelGroup.startPoints) {
        // start and end of a long line of smaller pixel sorted lines
        var sortedPixelLineStart = p;
        var sortedPixelLineStartColor = color(210, 0, 150, 200);
        var sortedPixelLineEndColor = color(50, 0, 50, 0);

        var currentStartVector = new Element2D(0, 0);
        var firstLine = true;
        while (currentStartVector.length <= sortedPixelGroup.maxLength) {
          // current line start is sortedPixelLineStart + currentStartVector
          var currentSquareStart = sortedPixelLineStart.translate(currentStartVector);
          // build a single line
          singleLineLength = firstLine ? randomInterval(0, 15) : randomInterval(25, 85);
          firstLine = false;

          fill(randomInterval(100, 150), randomInterval(0, 80), randomInterval(150, 200), 20);
          for (var _x = 0; _x <= singleLineLength; _x += this.lineWidth * 0.9) {
            //fill(lerpColor(sortedPixelLineStartColor, sortedPixelLineEndColor, (singleLineLength - currentSquareStart.length) / singleLineLength));
            square(currentSquareStart.x, currentSquareStart.y, this.lineWidth, 0, 0, 0, 0);

            currentSquareStart = currentSquareStart.translate(sortedPixelGroup.directionVector, this.lineWidth * 0.9);
          }
          currentStartVector = currentStartVector.translate(sortedPixelGroup.directionVector, singleLineLength * randomInterval(0.6, 1.5));
        }
      }
    }
  }

  drawAll() {
    strokeWeight(0);
    var sortedPixelGroups = this.buildSortedPixelGroups();
    for (var x = 0; x < this.layers; x++) this.drawLines(sortedPixelGroups);
  }
}

class NoisyNoise {

  constructor() { };

  drawAll() {
    blendMode(BURN)
    strokeWeight(3);
    stroke(0, 0, 0, 95);
    for (var x = 1; x <= 10; x++) {
      var y = x + randomInterval(-0.2, 0.2)
      line(0, 2000 * y, 170 * y, 0);
    }

  }
}

class SquareFrame {

  constructor() { }

  drawAll(frameSize, frameColor) {
    color(frameColor)
    for (var x = 0; x < canvasWidth; x++) {
      for (var y = 0; y < frameSize; y++) set(x, y, frameColor);
      for (var y = canvasHeight - frameSize; y < canvasHeight; y++) set(x, y, frameColor);
    }

    for (var y = frameSize; y <= canvasHeight - frameSize; y++) {
      for (var x = 0; x < frameSize; x++) set(x, y, frameColor);
      for (var x = canvasWidth - frameSize; x < canvasWidth; x++) set(x, y, frameColor);
    }
    updatePixels();
  }
}

class AlbumTextSetup {
  constructor() { }
  draw() {
    stroke(0)
    strokeWeight(0.8)
    line(480, canvasHeight - 135, canvasWidth - 480, canvasHeight - 135);
  }
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(0);
  blendMode(BLEND);
  //smooth();
  colorMode(RGB);
  // new PixelSortedLines(lineWidth = 2, layers = 5).drawAll();
  seed_random_modules()
  new RandomWalkers(7000, 15, 1.5, 500).drawAll();
  // new NoisyNoise().drawAll();
  new SquareFrame().drawAll(270, 255);
  new AlbumTextSetup().draw();
}

function draw() {

}