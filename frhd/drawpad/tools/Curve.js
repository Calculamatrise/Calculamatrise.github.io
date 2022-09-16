import Tool from "./Tool.js";

import Stroke from "../utils/Stroke.js";

export default class extends Tool {
    _size = 4;
    active = false;
    anchorA = null;
    anchorB = null;
    segmentLength = 1;
    element = new Stroke();
    init() {
        this.element.strokeWidth = this.size;
    }

    press() {
        if (this.active) {
            return;
        }

        this.anchorA = this.mouse.pointA;

        this.element.strokeStyle = this.canvas.primary;
        this.element.strokeWidth = this.size;
        this.element.points = [];
        this.element.addPoints([ this.anchorA.x, this.anchorA.y ], [ this.mouse.position.x, this.mouse.position.y ]);
    }

    stroke() {
        if (this.active) {
            this.element.points = [];
            for (let i = 0; i < 1; i += this.segmentLength / 100) {
                this.element.addPoints([
                    Math.pow((1 - i), 2) * this.anchorA.x + 2 * (1 - i) * i * this.mouse.position.x + Math.pow(i, 2) * this.anchorB.x,
                    Math.pow((1 - i), 2) * this.anchorA.y + 2 * (1 - i) * i * this.mouse.position.y + Math.pow(i, 2) * this.anchorB.y
                ]);
            }
            return;
        } else if (this.mouse.isDown && !this.mouse.isAlternate) {
            this.element.points = [];
            this.element.addPoints([ this.anchorA.x, this.anchorA.y ], [ this.mouse.position.x, this.mouse.position.y ]);
        }
    }

    clip(event) {
        if (this.active) {
            this.active = false;

            const line = this.element.clone();

            this.element.points = [];

            this.canvas.layer.lines.push(line);
            this.canvas.events.push({
                action: "add",
                value: line
            });

            return;
        } else if (this.mouse.pointA.x === this.mouse.pointB.x && this.mouse.pointA.y === this.mouse.pointB.y) {
            return;
        }
        
        this.anchorB = this.mouse.pointB;

        this.element.points = [];
        this.element.addPoints([ this.anchorA.x, this.anchorA.y ], [ this.anchorB.x, this.anchorB.y ]);

        this.active = true;
    }
}