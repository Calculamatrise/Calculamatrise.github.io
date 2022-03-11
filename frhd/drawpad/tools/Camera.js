import Tool from "./Tool.js";

export default class extends Tool {
    stroke(event) {
        this.canvas.view.setAttribute("viewBox", `${this.canvas.view.x - event.movementX * this.canvas.zoom} ${this.canvas.view.y - event.movementY * this.canvas.zoom} ${this.canvas.view.width} ${this.canvas.view.height}`);
        this.canvas.text.setAttribute("x", this.canvas.view.width / 2 - this.canvas.text.innerHTML.length * 2 + this.canvas.view.x);
        this.canvas.text.setAttribute("y", 25 + this.canvas.view.y);
    }
}