// wood_lake & night_lights
var canvasWidth = 1230;
var canvasHeight = 1230;

let img;


class Branch {
  constructor(x, y, alpha, lineWidth) {
    this.x = x
    this.y = y
    this.oldx = x;
    this.oldy = y;
    this.movementVariabilityFactor = 0.002;
    this.colorVariabilityFactor = 0.0006;
    this.speedVector = new p5.Vector(-4, 5);
    this.normalizedSpeedVector = new p5.Vector(-4, 5).normalize();
    this.visible = true;
    this.noiseSpeedFactor = 0.05;
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
      this.x += this.speedVector.x;
      this.y += this.speedVector.y;

      // draws a straight, semi-transparent line between former and current position of the branch
      strokeWeight(this.lineWidth);
      stroke(
        map(noise_module.simplex3(this.x * this.colorVariabilityFactor, this.y * this.colorVariabilityFactor, 0), -1, 1, 0, 255),
        map(noise_module.simplex3(this.y * this.colorVariabilityFactor + 200, this.x * this.colorVariabilityFactor, 0), -1, 1, 0, 255),
        map(noise_module.simplex3(this.x * this.colorVariabilityFactor + 400, this.y * this.colorVariabilityFactor, 0), -1, 1, 0, 255),
        this.alpha
      );
      // stroke(200, 0, 200, 12)
      line(this.oldx, this.oldy, this.x, this.y);
    }
  }

  update_visible() {
    // if the current position of the branch is outside the canvas' boundaries, do not draw it anymore
    if (this.y < - 200 || this.x < - 200 || this.x > canvasWidth + 200 || this.y > canvasHeight + 200) this.visible = false;
  }
}

class RandomWalkers {
  // higher factor makes the branches faster and makes them stay more grouped
  // recommended range: [0.1, 10]

  constructor(amount, alpha, lineWidth) {
    this.amount = amount
    this.allBranches = [];
    this.alpha = alpha
    this.lineWidth = lineWidth ?? 1
  }

  create_branches() {
    var branches = [];
    for (let i = 0; i < this.amount; i++) {
      const x = (i / this.amount) * canvasWidth;
      const y = - 100;
      branches.push(new Branch(x, y, this.alpha, this.lineWidth));
    }
    return branches;
  }

  drawAll() {
    var step = 0;
    var allBranches = this.create_branches();
    while (allBranches.length > (this.amount * 0.001) && step < 1000) {
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

function seed_random_modules(perlinSeed) {
  // nice values: 227504
  perlinSeed = perlinSeed ?? Math.floor(random(0, 900000));
  noise_module.seed(perlinSeed)
  console.log("Perlin seed =", perlinSeed);
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

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(0);
  blendMode(BLEND);
  //smooth();
  colorMode(RGB);
  // new PixelSortedLines(lineWidth = 2, layers = 5).drawAll();
  seed_random_modules()
  new RandomWalkers(30000, 7).drawAll();
  // new NoisyNoise().drawAll();
  new SquareFrame().drawAll(270, 255);
}

function draw() {

}