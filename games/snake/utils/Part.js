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
	get dark() {
		// return window.matchMedia("(prefers-color-scheme: dark)").matches;
		return JSON.parse(localStorage.getItem("dark"));
	}
	draw(ctx) {
		ctx.save();
		ctx.fillStyle = this.dark ? "white" : "black";
		ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
		ctx.restore();
	}
}