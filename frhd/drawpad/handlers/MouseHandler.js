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
		event.stopPropagation();
		this.emit('wheel', event);
	}

	close(target) {
		target.removeEventListener('pointerdown', this.pointerdown.bind(this));
		target.removeEventListener('pointermove', this.move.bind(this));
		target.removeEventListener('pointerup', this.up.bind(this));
	}
}