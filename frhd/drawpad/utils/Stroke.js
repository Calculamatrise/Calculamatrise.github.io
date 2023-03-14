export default class {
	alpha = 1;
	strokeWidth = 4;
	strokeStyle = '#000000';
	fillStyle = '#000000';
	points = [];
	constructor(points, { strokeWidth, strokeStyle, fillStyle } = {}) {
		if (points !== void 0) {
			this.points.push(...points);
			this.strokeWidth = strokeWidth;
			this.strokeStyle = strokeStyle;
			this.fillStyle = fillStyle;
		}
	}

	addPoints(x, y) {
		if (Array.isArray(arguments[0])) {
			for (const argument of arguments) {
				if (Array.isArray(argument)) {
					this.addPoints(...argument);
				} else {
					throw new Error("INVALID OBJECT");
				}
			}

			return;
		}

		for (const argument of arguments) {
			if (Array.isArray(argument)) {
				this.addPoints(...argument);
				continue;
			}

			if (isNaN(parseInt(argument))) {
				throw new Error("INVALID VALUE");
			}
		}

		this.points.push(parseInt(x), parseInt(y));
	}

	draw(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeWidth = this.strokeWidth * window.devicePixelRatio;
		ctx.strokeStyle = this.strokeStyle;
		ctx.fillStyle = this.fillStyle;
		for (let i = 0; i in this.points; i += 2) {
			if (i <= 1) {
				ctx.moveTo(this.points[i], this.points[i + 1]);
				continue;
			}

			ctx.lineTo(this.points[i], this.points[i + 1]);
		}

		ctx.stroke();
		ctx.restore();
	}

	erase(event) {
		return !!this.points.find((point, index, points) => {
			if (!points[index - 3]) {
				return false;
			}

			let vector = {
				x: points[index - 3] - window.canvas.view.x - points[index - 1] - window.canvas.view.x,
				y: points[index - 2] - window.canvas.view.y - point - window.canvas.view.y
			}

			let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
			let b = (event.offsetX - (points[index - 1] - window.canvas.view.x)) * (vector.x / len) + (event.offsetY - (point - window.canvas.view.y)) * (vector.y / len);
			if (b >= len) {
				vector.x = points[index - 3] - window.canvas.view.x - event.offsetX;
				vector.y = points[index - 2] - window.canvas.view.y - event.offsetY;
			} else {
				const clone = structuredClone(vector);
				vector.x = parseInt(points[index - 1]) - window.canvas.view.x - event.offsetX;
				vector.y = parseInt(point) - window.canvas.view.y - event.offsetY;
				if (b > 0) {
					vector.x += clone.x / len * b;
					vector.y += clone.y / len * b;
				}
			}

			return Math.sqrt(vector.x ** 2 + vector.y ** 2) <= window.canvas.tool.size && !!(this.points.splice(index - 3, 4));
		});
	}

	clone() {
		const clone = new this.constructor(this.points, {
			strokeWidth: this.strokeWidth,
			strokeStyle: this.strokeStyle,
			fillStyle: this.fillStyle
		});

		return clone;
	}
}