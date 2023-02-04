import { getAllPixels } from './getAllPixels.js';
import { Element2D } from "./Element2D.js";
import { Line } from "./Line.js";
import { canvasHeight, canvasWidth, maxLinesPerSolutionAmount } from './constants.js';



export class Solution {
    constructor(lines) {
        this.lines = lines;
        this.lines.sort((l1, l2) => l1.heightLevel < l2.heightLevel);
        this.distance = undefined;
    }

    setDistance(dist) {
        this.distance = dist;
    }

    deepClone() {
        const sol = new Solution(this.lines.map(l => l.deepClone()), canvasHeight, canvasWidth);
        sol.setDistance(this.distance);
        return sol;
    }

    /*
     * Builder for localized initial solution
     */
    static initializeRandomLocalizedSolution(directionVector, linesAmount) {
        let solutionLines = [];
        const weight = 1;
        let topLeft, bottomRight;
        if (Math.random() < 0.2) {
            topLeft = new Element2D(randInt(0, canvasWidth / 8), randInt(0, canvasHeight / 8));
            bottomRight = new Element2D(randInt(7 * canvasWidth / 8, canvasWidth), randInt(7 * canvasHeight / 8, canvasHeight));
        } else {
            const squareSize = randInt(80, 180);
            topLeft = new Element2D(randInt(0, canvasWidth), randInt(0, canvasHeight));
            bottomRight = new Element2D(topLeft.x + squareSize, topLeft.y + squareSize)
        }
        for (var i = 0; i < linesAmount; i++) {
            let shade = randInt(10, 255);
            let x1 = randInt(topLeft.x, bottomRight.x);
            let y1 = randInt(topLeft.y, bottomRight.y);
            let point = new Element2D(x1, y1);
            let point2 = point.translate(directionVector, randInt(canvasHeight / 10, canvasHeight / 2));
            let x2 = point2.x;
            let y2 = point2.y;
            solutionLines.push(
                new Line(x1, y1, x2, y2, weight, shade, directionVector)
            )
        }
        return new Solution(solutionLines);
    }

    clear() {
        // this.lines.map(x => null);
        this.lines = null;
        this.distance = null;
    }

    computeDistance(pixelsToFollow, renderer) {
        const imgPixels = getAllPixels(canvasHeight, canvasWidth, renderer);
        let dist = 0;
        for (var i = 0; i < canvasHeight; i++) {
            for (var j = 0; j < canvasWidth; j++) {
                dist += Math.abs(imgPixels[i][j][0] - pixelsToFollow[i][j][0]) ** 2;
            }
        }
        this.distance = dist / 1e6;
        return this.distance;
    }

    draw(pixelsToFollow) {
        let renderer = createGraphics(canvasWidth, canvasHeight);

        renderer.background(0);
        this.lines.forEach(line => {
            line.draw(renderer);
        });
        image(renderer, 0, 0, canvasWidth, canvasHeight);
        renderer.updatePixels();
        this.computeDistance(pixelsToFollow, renderer);
        renderer.remove();
        renderer.elt = null;
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
                let x1 = randInt(0, canvasWidth);
                let y1 = randInt(0, canvasHeight);
                let point = new Element2D(x1, y1);
                let point2 = point.translate(line.direction, randInt(canvasHeight / 10, canvasHeight / 2));
                return new Line(x1, y1, point2.x, point2.y, 1, shade, line.direction)
            }
            else if (choice < 0.55) { // modify a random line along its axis
                let shade = clip(line.shade + randInt(-50, 50), 10, 255) // modify shade by something in [-50, 50]
                let point = new Element2D(line.x1, line.y1);
                let point2 = point.translate(line.direction, line.length + randInt(-Math.min(line.length / 4, 50), 50));
                return new Line(line.x1, line.y1, point2.x, point2.y, 1, shade, line.direction)
            } else {
                let shade = clip(line.shade + randInt(-50, 50), 10, 255) // modify shade by something in [-50, 50]
                let point2 = new Element2D(line.x2, line.y2);
                let point = point2.translate(line.direction, - (line.length + randInt(-Math.min(line.length / 4, 50), 50)));
                return new Line(point.x1, point.y1, line.x2, line.y2, 1, shade, line.direction)
            }
        })
    }

    clone() {
        return new Solution(this.lines)
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

        // merge all lines but cap at maxLinesPerSolutionAmount
        else if (choice < 0.45) {
            childLines = shuffleArray(this.lines.concat(otherSolution.lines)).slice(0, maxLinesPerSolutionAmount);
            return new Solution(childLines);
        }

        // 2 : upper side and lower side of each parent
        else {
            const l = this.lines.length;
            childLines = this.lines.slice(0, l / 2 + 1).concat(otherSolution.lines.slice(l / 2 + 1, l));
        }

        // build and return child solution
        return new Solution(childLines)
    }
}

export default Solution;