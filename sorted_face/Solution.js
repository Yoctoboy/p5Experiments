import { getAllPixels } from './getAllPixels.js';
import { Element2D } from "./Element2D.js";
import { Line } from "./Line.js";


export class Solution {
    constructor(lines, canvas_height, canvas_width) {
        this.lines = lines;
        this.lines.sort((l1, l2) => l1.heightLevel < l2.heightLevel);
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.distance = undefined;
    }

    setDistance(dist) {
        this.distance = dist;
    }

    deepClone() {
        const sol = new Solution(this.lines.map(l => l.deepClone()), this.canvas_height, this.canvas_width);
        sol.setDistance(this.distance);
        return sol;
    }

    clear() {
        // this.lines.map(x => null);
        this.lines = null;
        this.canvas_width = null;
        this.canvas_height = null;
        this.distance = null;
    }

    computeDistance(pixelsToFollow, renderer) {
        const imgPixels = getAllPixels(this.canvas_height, this.canvas_width, renderer);
        let dist = 0;
        for (var i = 0; i < this.canvas_height; i++) {
            for (var j = 0; j < this.canvas_width; j++) {
                dist += Math.abs(imgPixels[i][j][0] - pixelsToFollow[i][j][0]) ** 2;
            }
        }
        this.distance = dist / 1e6;
        return this.distance;
    }

    draw(pixelsToFollow) {
        let renderer = createGraphics(this.canvas_width, this.canvas_height);

        renderer.background(0);
        this.lines.forEach(line => {
            line.draw(renderer);
        });
        image(renderer, 0, 0, this.canvas_width, this.canvas_height);
        renderer.updatePixels();
        this.computeDistance(pixelsToFollow, renderer);
        renderer.pInst = null;
        renderer = null;
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
            if (strength < Math.random()) return line;

            const choice = Math.random();
            if (choice < 0.1) { // delete and recreate a random line
                let shade = randInt(10, 255);
                let x1 = randInt(0, this.canvas_width);
                let y1 = randInt(0, this.canvas_height);
                let point = new Element2D(x1, y1);
                let point2 = point.translate(line.direction, randInt(this.canvas_height / 10, this.canvas_height / 2));
                return new Line(x1, y1, point2.x, point2.y, 1, shade, line.direction)
            }
            else if (choice < 0.55) { // modify a random line along its axis
                let shade = Math.min(Math.max(line.shade + randInt(-50, 50), 10), 255) // modify shade by something in [-50, 50]
                let point = new Element2D(line.x1, line.y1);
                let point2 = point.translate(line.direction, line.length + randInt(-Math.min(line.length / 4, 50), 50));
                return new Line(line.x1, line.y1, point2.x, point2.y, 1, shade, line.direction)
            } else {
                let shade = Math.min(Math.max(line.shade + randInt(-50, 50), 10), 255) // modify shade by something in [-50, 50]
                let point2 = new Element2D(line.x2, line.y2);
                let point = point2.translate(line.direction, - (line.length + randInt(-Math.min(line.length / 4, 50), 50)));
                return new Line(point.x1, point.y1, line.x2, line.y2, 1, shade, line.direction)
            }
        })
    }

    clone() {
        return new Solution(this.lines, this.canvas_height, this.canvas_width)
    }

    makeChild(otherSolution) {
        // two choices for mask
        const choice = Math.random();
        let childLines;

        // 1 : sort all lines and take half of them alternatively (not great ?)
        if (choice < 0.3) {
            childLines = this.lines
                .concat(otherSolution.lines)
                .sort((l1, l2) => l1.heightLevel < l2.heightLevel)
                .filter((_, i) => i % 2 == 0);
        }

        // 2 : upper side and lower side of each parent
        else {
            const l = this.lines.length;
            childLines = this.lines.slice(0, l / 2 + 1).concat(otherSolution.lines.slice(l / 2 + 1, l));
        }

        // build and return child solution
        return new Solution(childLines, this.canvas_height, this.canvas_width)
    }
}

export default Solution;