import { getAllPixels } from './getAllPixels.js';

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
        const dist = this.computeDistance(pg);
        console.log("distance:", dist);
    }

    make_child(otherSolution) {
        const childLines = this.lines
            .concat(otherSolution.lines)
            .sort((l1, l2) => l1.heightLevel < l2.heightLevel)
            .filter((_, i) => i%2 == 0);
        return new Solution(childLines, this.pixelsToFollow, this.canvas_height, this.canvas_width)
    }
}

export default Solution;