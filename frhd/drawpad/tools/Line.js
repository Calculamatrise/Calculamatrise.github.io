import Tool from "./Tool.js";

export default class extends Tool {
	_size = 4;
	scenery = 0;
	draw(ctx) {
		if (!this.active) return;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.scenery ? this.canvas.sceneryStyle : this.canvas.physicsStyle;
		const old = this.mouse.old.toCanvas(this.canvas);
		ctx.moveTo(old.x, old.y);
		const position = this.mouse.position.toCanvas(this.canvas);
		ctx.lineTo(position.x, position.y);
		ctx.stroke();
		ctx.restore();
	}

	press() {
		this.active = true;
		this.mouse.isAlternate && (this.scenery |= 2);
	}

	clip() {
		if (!this.active) return;
		this.active = false;
		const old = this.mouse.old.toCanvas(this.canvas);
		const position = this.mouse.position.toCanvas(this.canvas);
		if (Math.sqrt((position.x - old.x) ** 2 + (position.y - old.y) ** 2) < 2) {
			return;
		}

		this.canvas.layers.selected[this.scenery ? 'scenery' : 'physics'].push([old.x, old.y, position.x, position.y]);
		this.canvas.events.push({
			action: 'add',
			value: [old.x, old.y, position.x, position.y]
		});

		(this.scenery & 2) == 2 && (this.scenery = 0);
	}

	close() {
		this.active = false;
	}
}