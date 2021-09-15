export default class {
	size = 1;
	init(parent) {
		let x = Math.ceil(Math.random() * (parent.canvas.height - 10));
		while(x % 10 !== 0 || x < 0)
			x++;
		
		let y = Math.ceil(Math.random() * (parent.canvas.height - 10));		
		while(y % 10 !== 0 || y < 0)
			y++;

		this.position = {
			x,
			y
		}
	}
	draw(ctx) {
		ctx.save();
		ctx.fillStyle = "#d2a5ff";
		ctx.fillRect(this.position.x, this.position.y, 10, 10);
		ctx.restore();
	}
}