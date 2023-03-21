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

	erase(event) {
		const positionX = (this.mouse.position.x - this.canvas.view.width / 2 + this.canvas.camera.x) / this.canvas.zoom;
		const positionY = (this.mouse.position.y - this.canvas.view.height / 2 + this.canvas.camera.y) / this.canvas.zoom;
		this.canvas.layers.forEach((layer, index, objects) => {
			for (const line of layer.physics) {
				for (let i = 0; i < line.length - 2; i += 2) {
					// if (this.size > Math.sqrt((line[i] - positionX) ** 2 + (line[i + 1] - positionY) ** 2)) {
					// 	this.canvas.objects.splice(objectIndex, 1);
					// 	return;
					// }

					let vector = {
						x: line[i] - line[i + 2],
						y: line[i + 1] - line[i + 3]
					}

					let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
					let b = (positionX - line[i + 2]) * (vector.x / len) + (positionY - line[i + 3]) * (vector.y / len);
					if (b >= len) {
						vector.x = line[i] - positionX;
						vector.y = line[i + 1] - positionY;
					} else {
						const clone = structuredClone(vector);
						vector.x = line[i + 2] - positionX;
						vector.y = line[i + 3] - positionY;
						if (b > 0) {
							vector.x += clone.x / len * b;
							vector.y += clone.y / len * b;
						}
					}

					if (Math.sqrt(vector.x ** 2 + vector.y ** 2) <= this.size) {
						objects.splice(index, 1);
						return;
					}
				}
			}
		});
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