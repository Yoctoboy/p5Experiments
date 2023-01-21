export class Line {
    constructor(x1, y1, x2, y2, weight, col, direction) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.weight = weight;
        this.color = col;
        this.direction = direction
        this.heightLevel = this.computeHeight(); // height of line on x=0
    }

    computeHeight(){
        const reverseDirectionAmount = this.x1 / this.direction.x;
        return this.y1 - (reverseDirectionAmount * this.direction.y); 
    }

    draw(pg) {
        pg.stroke(this.color);
        pg.strokeWeight(this.weight);
        pg.line(this.x1, this.y1, this.x2, this.y2);
    }
}
