export class Line {
    constructor(x1, y1, x2, y2, weight, col) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.weight = weight;
        this.color = col;
    }

    draw() {
        stroke(this.color);
        strokeWeight(this.weight);
        line(this.x1, this.y1, this.x2, this.y2);
    }
}
