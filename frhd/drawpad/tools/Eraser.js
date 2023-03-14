import Tool from "./Tool.js";

export default class extends Tool {
	_size = 20;
	element = new (function (parent) {
		this.tool = parent;
		this.opacity = .8;
		this.position = {
			x: 0,
			y: 0
		}
		this.draw = function (ctx) {
			ctx.beginPath();
			ctx.fillStyle = 'khaki';
			ctx.arc(this.tool.mouse.position.x, this.tool.mouse.position.y, this.tool.size, 0, 2 * Math.PI);
			ctx.fill();
		}
	})(this);
	init() {
		this.element.position.x = this.mouse.position.x;
		this.element.position.y = this.mouse.position.y;
	}

	press(event) {
		this.element.position.x = this.mouse.position.x;
		this.element.position.y = this.mouse.position.y;
		if (this.mouse.down && !this.mouse.isAlternate) {
			this.canvas.layer.lines.forEach(line => {
				if (line.erase(event)) {
					this.canvas.events.push({
						action: 'remove',
						value: line
					});
				}
			});
		}
	}

	stroke(event) {
		if (!this.mouse.down) {
			return;
		}

		this.element.position.x = this.mouse.position.x;
		this.element.position.y = this.mouse.position.y;
		this.canvas.layer.lines.forEach(line => {
			if (line.erase(event)) {
				this.canvas.events.push({
					action: 'remove',
					value: line
				});
			}
		});
	}
}