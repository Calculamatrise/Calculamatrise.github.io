export default class {
	constructor(x, y) {
		this.position = {
			x,
			y
		},
		this.old = {
			x,
			y
		}
	}
	size = 10;
	draw(ctx) {
		ctx.save();
		ctx.fillStyle = JSON.parse(localStorage.getItem("dark")) ? "white" : "black";
		ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
		ctx.restore();
	}
}