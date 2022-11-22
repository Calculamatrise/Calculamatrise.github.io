import Vector from "../../utils/Vector.js";

export default class {
	color = window.Application?.getColorScheme() === 'dark' ? 'white' : 'black';
	size = 10;
	constructor(x, y) {
		this.position = new Vector(x - x % 10, y - y % 10);
		this.old = this.position.clone();
	}

	draw(ctx) {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
		ctx.restore();
	}
}