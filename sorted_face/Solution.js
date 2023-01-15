import { getAllPixels } from './getAllPixels.js';

export class Solution {
    constructor(lines, pixelsToFollow, canvas_height, canvas_width) {
        this.lines = lines;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.distance = undefined;
    }

    computeDistance(pixelsToFollow) {
        const pixels = getAllPixels(this.canvas_height, this.canvas_width);
        let dist = 0;
        for (var i = 0; i < this.canvas_height; i++) {
            for (var j = 0; j < this.canvas_width; j++) {
                dist += Math.abs(pixels[i][j][0] - pixelsToFollow[i][j][0]);
            }
        }
        this.distance = dist;
        return dist;
    }

    draw() {
        background(0);
        this.lines.forEach(line => line.draw());
        this.computeDistance();
    }
}

export default Solution;