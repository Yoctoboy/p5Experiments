import { getAllPixels } from './getAllPixels.js';
import { Element2D } from "./Element2D.js";
import { Line } from "./Line.js";


export class Solution {
    constructor(lines, pixelsToFollow, canvas_height, canvas_width) {
        this.lines = lines;
        this.lines.sort((l1, l2) => l1.heightLevel < l2.heightLevel);
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.distance = undefined;
        this.pixelsToFollow = pixelsToFollow;
    }

    computeDistance(pg) {
        const imgPixels = getAllPixels(this.canvas_height, this.canvas_width, pg);
        let dist = 0;
        for (var i = 0; i < this.canvas_height; i++) {
            for (var j = 0; j < this.canvas_width; j++) {
                dist += Math.abs(imgPixels[i][j][0] - this.pixelsToFollow[i][j][0]) ** 2;
            }
        }
        this.distance = dist;
        return dist;
    }

    draw() {
        let pg = createGraphics(this.canvas_width, this.canvas_height);
        pg.background(0);
        this.lines.forEach(line => {
            line.draw(pg);
        });
        image(pg, 0, 0, this.canvas_width, this.canvas_height);
        pg.updatePixels();
        this.computeDistance(pg);
    }

    drawMain() {
        background(0)
        this.lines.forEach(line => {
            line.drawMain();
        });
    }

    mutate(rate, strength) {
        if (rate < Math.random()) return;
        this.lines = this.lines.map(line => {
            if (strength > Math.random()){
                let shade = randInt(10, 255);
                let x1 = randInt(0, this.canvas_width);
                let y1 = randInt(0, this.canvas_height);
                let point = new Element2D(x1, y1);
                let point2 = point.translate(line.direction, randInt(this.canvas_height / 10, this.canvas_height / 2));
                let x2 = point2.x;
                let y2 = point2.y;
                return new Line(x1, y1, x2, y2, 1, shade, line.direction)
            } else return line;
        })
    }

    clone() {
        return new Solution(this.lines, this.pixelsToFollow, this.canvas_height, this.canvas_width)
    }

    makeChild(otherSolution) {
        
        // two choices for mask
        const choice = Math.random();
        let childLines;

        // 1 : sort all lines and take half of them
        if(choice < 0.3){
            childLines = this.lines
                .concat(otherSolution.lines)
                .sort((l1, l2) => l1.heightLevel < l2.heightLevel)
                .filter((_, i) => i%2 == 0);
        }

        // 2 : upper side and lower side
        else {
            const l = this.lines.length;
            childLines = this.lines.slice(0, l/2 + 1).concat(otherSolution.lines.slice(l/2 + 1, l));
        }

        // build and return child solution
        return new Solution(childLines, this.pixelsToFollow, this.canvas_height, this.canvas_width)
    }
}

export default Solution;