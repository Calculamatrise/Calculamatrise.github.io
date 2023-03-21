import Tool from "./Tool.js";

export default class extends Tool {
	_size = 20;
	draw(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'khaki';
		ctx.globalAlpha = .8;
		ctx.arc((this.mouse.position.x - this.canvas.view.width / 2 + this.canvas.camera.x) / this.canvas.zoom, (this.mouse.position.y - this.canvas.view.height / 2 + this.canvas.camera.y) / this.canvas.zoom, this.size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.restore();
	}

	erase(event) {
		const positionX = (this.mouse.position.x - this.canvas.view.width / 2 + this.canvas.camera.x) / this.canvas.zoom;
		const positionY = (this.mouse.position.y - this.canvas.view.height / 2 + this.canvas.camera.y) / this.canvas.zoom;
		this.canvas.objects.forEach((object, index, objects) => {
			for (const line of object.physics) {
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
		this.mouse.isAlternate || this.erase(event);
	}

	stroke(event) {
		if (!this.mouse.down || this.mouse.isAlternate) return;
		this.erase(event);
	}
}