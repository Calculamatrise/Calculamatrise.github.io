import Tool from "./Tool.js";

import Stroke from "../utils/Stroke.js";

export default class extends Tool {
    static id = "line";
    
    _size = 4;
    element = new Stroke();
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

        this.element.strokeWidth = this.size;
        this.element.points.splice(this.element.points.length - 2, 2);
        this.element.addPoints([
            this.mouse.position.x,
            this.mouse.position.y
        ]);
    }
    clip(event) {
        if (!this.active) {
            return;
        }

        this.active = false;
        if (this.mouse.pointA.x === this.mouse.pointB.x && this.mouse.pointA.y === this.mouse.pointB.y) {
            return;
        }

        this.element.points.splice(this.element.points.length - 2, 2);
        this.element.addPoints([
            this.mouse.pointB.x,
            this.mouse.pointB.y
        ]);
        
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