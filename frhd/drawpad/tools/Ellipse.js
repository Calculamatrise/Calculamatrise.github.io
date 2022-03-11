import Tool from "./Tool.js";

import Stroke from "../utils/Stroke.js";

export default class extends Tool {
    _size = 4;
    segmentLength = 2;
    element = new Stroke();
    get radius() {
        return Math.sqrt((this.mouse.position.x - this.mouse.pointA.x) ** 2 + (this.mouse.position.y - this.mouse.pointA.y) ** 2);
    }

    init() {
        this.element.strokeWidth = this.size;
    }

    press(event) {
        this.active = true;

        this.element.strokeStyle = this.canvas.primary;
        this.element.strokeWidth = this.size;
        this.element.addPoints([
            this.mouse.pointA.x,
            this.mouse.pointA.y
        ], [
            this.mouse.position.x,
            this.mouse.position.y
        ]);
    }

    stroke(event) {
        if (!this.active) {
            return;
        }

        this.element.points = [];
        this.element.strokeWidth = this.size;
        for (let i = 0; i <= 360; i += this.segmentLength) {
            this.element.addPoints([
                this.mouse.pointA.x + Math.sqrt((this.mouse.position.x - this.mouse.pointA.x) ** 2) * Math.cos(i * Math.PI / 180),
                this.mouse.pointA.y + Math.sqrt((this.mouse.position.y - this.mouse.pointA.y) ** 2) * Math.sin(i * Math.PI / 180)
            ]);
        }
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

        this.element.points = [];

        this.canvas.layer.lines.push(line);
        this.canvas.events.push({
            action: "add",
            value: line
        });
    }

    close() {
        this.active = false;
        
        this.element.points = [];
    }
}