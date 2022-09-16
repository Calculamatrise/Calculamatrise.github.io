import Vector from "./Vector.js";

export default class {
	size = 10;
	init(parent) {
		let rand = Math.ceil(Math.random() * (game.canvas.width - 10));
		rand -= rand % 10;
		let randTwo = Math.ceil(Math.random() * (game.canvas.height - 10));
		randTwo -= randTwo % 10;
		this.position = new Vector(rand, randTwo);
	}
	draw(ctx) {
		ctx.save();
		ctx.fillStyle = "#d2a5ff";
		ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
		ctx.restore();
	}
}