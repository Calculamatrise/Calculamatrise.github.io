import Vector from "../../utils/Vector.js";

export default class {
	size = 10;
	init(parent) {
		let rand = Math.ceil(Math.random() * (parent.canvas.width - 10));
		let randTwo = Math.ceil(Math.random() * (parent.canvas.height - 10));
		this.position = new Vector(rand - rand % 10, randTwo - randTwo % 10);
	}

	draw(ctx) {
		ctx.save();
		ctx.fillStyle = "#d2a5ff";
		ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
		ctx.restore();
	}
}