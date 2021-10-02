import Vector from "./Vector.js";

export default class {
	constructor(x, y) {
		this.position = new Vector(x, y);
		this.old = new Vector(x, y);
	}
	size = 1;
	draw(ctx) {
		ctx.save();
		ctx.fillStyle = JSON.parse(localStorage.getItem("dark")) ? "white" : "black";
		ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
		ctx.restore();
	}
}