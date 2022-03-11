import Tool from "./Tool.js";

import Stroke from "../utils/Stroke.js";

export default class extends Tool {
    _size = 4;
    element = new Stroke();
    get x() {
        return this.mouse.position.x - this.mouse.pointA.x > 0 ? this.mouse.pointA.x : this.mouse.position.x;
    }

    get y() {
        return this.mouse.position.y - this.mouse.pointA.y > 0 ? this.mouse.pointA.y : this.mouse.position.y;
    }

    get width() {
        return Math.abs(this.mouse.position.x - this.mouse.pointA.x);
    }

    get height() {
        return Math.abs(this.mouse.position.y - this.mouse.pointA.y);
    }

    init() {
        this.element.strokeWidth = this.size;
    }

    press(event) {
        this.active = true;

        this.element.strokeStyle = this.canvas.primary;
        this.element.strokeWidth = this.size;
        this.element.addPoints([ this.x, this.y ], [ this.x, this.y + 1 ], [ this.x + 1, this.y + 1 ], [ this.x + 1, this.y ], [ this.x, this.y ]);
    }

    stroke(event) {
        if (!this.active) {
            return;
        }

        this.element.strokeWidth = this.size;
        this.element.points = [];
        this.element.addPoints([ this.x, this.y ], [ this.x, this.y + this.height ], [ this.x + this.width, this.y + this.height ], [ this.x + this.width, this.y ], [ this.x, this.y ]);
    }

    clip(event) {
        if (!this.active) {
            return;
        }

        this.active = false;
        if (this.mouse.pointA.x === this.mouse.pointB.x && this.mouse.pointA.y === this.mouse.pointB.y) {
            return;
        }
        
        const line = this.element.clone();

        this.element.points = []

        this.canvas.layer.lines.push(line);
        this.canvas.events.push({
            action: "add",
            value: line
        });
    }

    close() {
        this.active = false;
        
        this.element.points = []
    }
}