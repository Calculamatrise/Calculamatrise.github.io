import Vector from "./Vector.js";

export default class {
	size = 1;
	init(parent) {
		this.position = new Vector(Math.ceil(Math.random() * (parent.canvas.height.baseVal.value - 10) / 10), Math.ceil(Math.random() * (parent.canvas.height.baseVal.value - 10) / 10));
	}
	draw(ctx) {
		console.log(ctx, this)
		ctx.fillStyle = "#d2a5ff";
		ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
	}
}