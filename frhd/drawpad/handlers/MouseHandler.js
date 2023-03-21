import EventEmitter from "../../../utils/EventEmitter.js";

export default class extends EventEmitter {
	down = false;
	real = {
		x: 0,
		y: 0
	}
	pointA = Object.assign({}, this.real);
	pointB = Object.assign({}, this.real);
	constructor(parent) {
		super();
		this.parent = parent;
	}

	get isAlternate() {
		return this.down && (event.buttons & 1) != 1;
	}

	get locked() {
		return document.pointerLockElement === this.canvas;
	}

	get position() {
		return this.getPosition({
			offsetX: this.real.x,
			offsetY: this.real.y
		});
	}

	getPosition(event = event) {
		return {
			x: ((event.offsetX * this.parent.zoom) + this.parent.camera.x) * window.devicePixelRatio,
			y: ((event.offsetY * this.parent.zoom) + this.parent.camera.y) * window.devicePixelRatio
		}
	}

	init() {
		document.addEventListener('pointerdown', this.pointerdown.bind(this));
		document.addEventListener('pointermove', this.move.bind(this));
		document.addEventListener('pointerup', this.up.bind(this));
		document.addEventListener('wheel', this.wheel.bind(this), { passive: false });
	}

	pointerdown(event) {
		event.preventDefault();
		if (event.target.id !== 'container') return;
		if (layers.style.display !== 'none') {
			layers.style.display = 'none';
		}

		this.down = true;
		if (!this.locked) {
			this.real = {
				x: event.offsetX,
				y: event.offsetY
			}
			this.pointA = this.getPosition(event);
			this.parent.view.setPointerCapture(event.pointerId);
		}

		this.emit('down', event);
	}

	move(event) {
		event.preventDefault();
		this.real = {
			x: event.offsetX,
			y: event.offsetY
		}

		this.emit('move', event);
	}

	up(event) {
		event.preventDefault();
		if (event.target.id !== 'view') return;
		this.down = false;
		if (!this.locked) {
			this.pointB = this.getPosition(event);
			this.parent.view.releasePointerCapture(event.pointerId);
		}

		this.emit('up', event);
	}

	wheel(event) {
		event.preventDefault();
		event.stopPropagation();
		if (event.ctrlKey) {
			if (event.deltaY < 0) {
				if (this.parent.zoom <= 1) {
					return;
				}

				this.parent.zoom -= this.parent.zoomIncrementValue;
				// this.parent.view.setAttribute("viewBox", `${this.parent.view.x + (this.parent.view.width - window.innerWidth * this.parent.zoom) / 2} ${this.parent.view.y + (this.parent.view.height - window.innerHeight * this.parent.zoom) / 2} ${window.innerWidth * this.parent.zoom} ${window.innerHeight * this.parent.zoom}`);
				this.parent.text.setAttribute("y", 25 + this.parent.view.y);
			} else {
				if (this.parent.zoom >= 10) {
					return;
				}

				this.parent.zoom += this.parent.zoomIncrementValue;
				// this.parent.view.setAttribute("viewBox", `${this.parent.view.x - (window.innerWidth * this.parent.zoom - this.parent.view.width) / 2} ${this.parent.view.y - (window.innerHeight * this.parent.zoom - this.parent.view.height) / 2} ${window.innerWidth * this.parent.zoom} ${window.innerHeight * this.parent.zoom}`);
				this.parent.text.setAttribute("y", 25 + this.parent.view.y);
			}

			return;
		}

		if (event.deltaY > 0 && this.parent.tool.size <= 2) {
			return;
		} else if (event.deltaY < 0 && this.parent.tool.size >= 100) {
			return;
		}

		this.parent.tool.size -= event.deltaY / 100;

		// const zoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--size'));
		// if (event.deltaY > 0 && zoom >= 100 || event.deltaY < 0 && zoom < 1) {
		// 	return;
		// }

		// document.documentElement.style.setProperty("--size", zoom + event.deltaY / 1000);
		this.emit('wheel', event);
	}

	close() {
		document.removeEventListener('pointerdown', this.pointerdown.bind(this));
		document.removeEventListener('pointermove', this.move.bind(this));
		document.removeEventListener('pointerup', this.up.bind(this));
	}
}