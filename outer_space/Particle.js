import { Element2D } from "../utils/element2D.js";
import { gravityConstant } from "./constants.js";

export class Particle {
    constructor(id, initX, initY, particleColor, size = 1, weight = 1) {
        this.id = id;
        this.initX = initX;
        this.initY = initY;
        this.x = initX;
        this.y = initY;
        this.size = size;
        this.weight = weight;
        this.color = particleColor;
        this.speed = new Element2D(0, 0);
    }

    distanceTo(particle) {
        const xgap = this.x - particle.x;
        const ygap = this.y - particle.y;
        return Math.pow(xgap * xgap + ygap * ygap, 0.5);
    }

    draw() {
        stroke(this.color);
        strokeWeight(this.size);
        point(this.x, this.y);
    }

    updatePosition(particles) {
        particles.forEach((p) => {
            if (p.id === this.id) return;
            const diffVector = new Element2D(p.x - this.x, p.y - this.y).normalize();
            // force = m*a
            const accelerationAmount =
                (gravityConstant * ((this.weight * p.weight) / Math.pow(this.distanceTo(p), 2))) /
                this.weight;
            diffVector.multiply(accelerationAmount);
            this.speed.add(diffVector);
        });
        this.x += this.speed.x;
        this.y += this.speed.y;
    }
}
