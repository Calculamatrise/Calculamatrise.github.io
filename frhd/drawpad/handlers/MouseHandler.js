import EventEmitter from "../../../utils/EventEmitter.js";

export default class extends EventEmitter {
	down = false;
	old = {x: 0, y: 0};
	position = {
		x: 0,
		y: 0,
		toCanvas(canvas) {
			return {
				x: (this.x - canvas.view.width / 2 + canvas.camera.x) / canvas.zoom,
				y: (this.y - canvas.view.height / 2 + canvas.camera.y) / canvas.zoom
			}
		}
	}

	get isAlternate() {
		return this.down && (event.buttons & 1) != 1;
	}

	get locked() {
		return document.pointerLockElement === this.canvas;
	}

	lockedToTarget(event) {
		return document.pointerLockElement === event.target;
	}

	init(target = document) {
		target.addEventListener('pointerdown', this.pointerdown.bind(this, target));
		target.addEventListener('pointermove', this.move.bind(this, target));
		target.addEventListener('pointerup', this.up.bind(this, target));
		target.addEventListener('wheel', this.wheel.bind(this, target), { passive: false });
		this.close = this.close.bind(this, target);
	}

	pointerdown(target, event) {
		event.preventDefault();
		layers.style.display !== 'none' && layers.style.setProperty('display', 'none');
		this.down = true;
		this.locked || (this.position.x = event.offsetX * window.devicePixelRatio,
		this.position.y = event.offsetY * window.devicePixelRatio,
		this.old = Object.assign({}, this.position),
		target.setPointerCapture(event.pointerId));
		this.emit('down', event);
	}

	move(target, event) {
		event.preventDefault();
		this.position.x = event.offsetX * window.devicePixelRatio;
		this.position.y = event.offsetY * window.devicePixelRatio;
		this.emit('move', event);
	}

	up(target, event) {
		event.preventDefault();
		this.down = false;
		this.locked || (target.releasePointerCapture(event.pointerId));
		this.emit('up', event);
	}

	wheel(target, event) {
		event.preventDefault();
		// if (event.ctrlKey) {
		// 	if (event.deltaY < 0) {
		// 		if (this.parent.zoom <= 1) {
		// 			return;
		// 		}

		// 		this.parent.zoom -= this.parent.zoomIncrementValue;
		// 		// this.parent.view.setAttribute("viewBox", `${this.parent.view.x + (this.parent.view.width - window.innerWidth * this.parent.zoom) / 2} ${this.parent.view.y + (this.parent.view.height - window.innerHeight * this.parent.zoom) / 2} ${window.innerWidth * this.parent.zoom} ${window.innerHeight * this.parent.zoom}`);
		// 		this.parent.text.setAttribute("y", 25 + this.parent.view.y);
		// 	} else {
		// 		if (this.parent.zoom >= 10) {
		// 			return;
		// 		}

		// 		this.parent.zoom += this.parent.zoomIncrementValue;
		// 		// this.parent.view.setAttribute("viewBox", `${this.parent.view.x - (window.innerWidth * this.parent.zoom - this.parent.view.width) / 2} ${this.parent.view.y - (window.innerHeight * this.parent.zoom - this.parent.view.height) / 2} ${window.innerWidth * this.parent.zoom} ${window.innerHeight * this.parent.zoom}`);
		// 		this.parent.text.setAttribute("y", 25 + this.parent.view.y);
		// 	}

		// 	return;
		// }

		// if (event.deltaY > 0 && this.parent.tool.size <= 2) {
		// 	return;
		// } else if (event.deltaY < 0 && this.parent.tool.size >= 100) {
		// 	return;
		// }

		// this.parent.tool.size -= event.deltaY / 100;

		// const zoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--size'));
		// if (event.deltaY > 0 && zoom >= 100 || event.deltaY < 0 && zoom < 1) {
		// 	return;
		// }

		// document.documentElement.style.setProperty("--size", zoom + event.deltaY / 1000);
		this.emit('wheel', event);
	}

	close(target) {
		target.removeEventListener('pointerdown', this.pointerdown.bind(this));
		target.removeEventListener('pointermove', this.move.bind(this));
		target.removeEventListener('pointerup', this.up.bind(this));
	}
}