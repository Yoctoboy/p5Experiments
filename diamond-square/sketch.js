function getRandomFloat(min, max){
  return Math.random() * (max - min) + min;
}


function setup() {
  // global params 
  var size = 513; // must be 2**n + 1
  var randomDivision = 1.3;
  var maxcolor = 120;
  
  createCanvas(size, size);
  
  // initialize 2D altitude matrix
  var mat = new Array(size).fill(0).map(_ => new Array(size).fill(0));
  
  // diamond-square
  var space = size - 1;
  var halfspace, avg, s, n, col, minalt = 100000.0, maxalt = -100000.0, result;
  var randomFactor = 10;
  while(space > 1){
    halfspace = space/2;

    // diamond step
    for(var x = halfspace; x < size; x += space){
      for(var y = halfspace; y < size; y += space){
        avg = (mat[x - halfspace][y - halfspace] + mat[x - halfspace][y + halfspace] + mat[x + halfspace][y - halfspace] + mat[x + halfspace][y + halfspace]) / 4;
        result = avg + getRandomFloat(-randomFactor, randomFactor);
        mat[x][y] = result;
        minalt = min(minalt, result);
        maxalt = max(maxalt, result);
      }
    }

    // square step
    offset = 0;
    for(var x = 0; x < size; x += halfspace){
      if(offset == 0) offset = halfspace;
      else offset = 0;
      for(var y = offset; y < size; y += space){
        s = 0;
        n = 0;
        if(x >= halfspace){
          s += mat[x - halfspace][y]
          n += 1;
        }
        if(x + halfspace < size){
          s += mat[x + halfspace][y];
          n += 1;
        }
        if(y >= halfspace){
          s += mat[x][y - halfspace]
          n += 1
        }
        if(y + halfspace < size){
          s += mat[x][y + halfspace];
          n += 1;
        }
        avg = s / n;
        result = avg + getRandomFloat(-randomFactor, randomFactor);
        mat[x][y] = result;
        minalt = min(minalt, result);
        maxalt = max(maxalt, result);
      }
    }
    randomFactor /= randomDivision;
    space = halfspace;
  }

  // rescale altitudes between 0 and maxcolor and set pixels accordingly
  for(var x = 0; x < size; x += 1){
    for(var y = 0; y < size; y += 1){
      mat[x][y] = ((mat[x][y] - minalt) / (maxalt - minalt)) * maxcolor;
      col = color(Math.floor(mat[x][y]), 0, Math.floor(mat[x][y])); // purple-ish color
      set(x, y, col);
    }
  }
  updatePixels();

}