import EventEmitter from "../../../../utils/EventEmitter.js";

export default class extends EventEmitter {
	down = false;
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
	pointA = Object.assign({}, this.position);
	pointB = Object.assign({}, this.position);
	get isAlternate() {
		return this.down && (event.buttons & 1) != 1;
	}

	get locked() {
		return document.pointerLockElement !== null;
	}

	lockedToTarget(event) {
		return document.pointerLockElement === event.target;
	}

	init(target = document) {
		target.addEventListener('pointerdown', this.pointerdown = this.pointerdown.bind(this));
		target.addEventListener('pointermove', this.move = this.move.bind(this));
		target.addEventListener('pointerup', this.up = this.up.bind(this));
		target.addEventListener('wheel', this.wheel = this.wheel.bind(this), { passive: false });
		this.close = this.close.bind(target);
	}

	pointerdown(event) {
		event.preventDefault();
		this.down = true;
		this.locked || (this.pointA = Object.assign({}, this.position));
		this.emit('down', event);
	}

	move(event) {
		event.preventDefault();
		this.position.x = event.offsetX * window.devicePixelRatio;
		this.position.y = event.offsetY * window.devicePixelRatio;
		this.emit('move', event);
	}

	up(event) {
		event.preventDefault();
		this.down = false;
		this.locked || (this.pointB = Object.assign({}, this.position));
		this.emit('up', event);
	}

	wheel(event) {
		event.preventDefault();
		this.emit('wheel', event);
	}

	close() {
		this.removeEventListener('pointerdown', this.pointerdown);
		this.removeEventListener('pointermove', this.move);
		this.removeEventListener('pointerup', this.up);
		this.removeEventListener('wheel', this.wheel);
	}
}