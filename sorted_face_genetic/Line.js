export class Line {
    constructor(x1, y1, x2, y2, weight, col, direction) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.weight = weight;
        this.color = col;
        this.direction = direction;
        this.heightLevel = this.computeHeight(); // height of line on x=0
        this.length = Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
    }

    deepClone() {
        return new Line(this.x1, this.y1, this.x2, this.y2, this.weight, this.color, this.direction)
    }

    computeHeight() {
        const reverseDirectionAmount = this.x1 / this.direction.x;
        return this.y1 - (reverseDirectionAmount * this.direction.y);
    }

    draw(pg) {
        pg.stroke(this.color);
        pg.strokeWeight(this.weight);
        pg.line(this.x1, this.y1, this.x2, this.y2);
    }

    drawMain() {
        stroke(this.color);
        strokeWeight(this.weight);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}
