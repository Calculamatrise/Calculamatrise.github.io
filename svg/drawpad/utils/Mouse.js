export default class {
	constructor(parent) {
		this.parent = parent;
	}
	isDown = false;
	isAlternate = false;
	#events = new Map();
	pointA = {
		x: -50,
		y: -50
	}
	pointB = {
		x: -50,
		y: -50
	}
	real = {
		x: -50,
		y: -50
	}
	get position() {
		return {
			x: this.real.x + this.parent.viewBox.x,
			y: this.real.y + this.parent.viewBox.y
		}
	}
	
	init() {
		document.addEventListener("mousedown", this.down.bind(this));
		document.addEventListener("mousemove", this.move.bind(this));
		document.addEventListener("mouseup", this.up.bind(this));
		document.addEventListener("wheel", this.wheel.bind(this));
		document.addEventListener("touchstart", this.touchStart.bind(this));
		document.addEventListener("touchmove", this.touchMove.bind(this));
		document.addEventListener("touchend", this.touchEnd.bind(this));
		document.addEventListener("touchcancel", this.touchCancel.bind(this));
	}
	on(event, method) {
		this.#events.set(event, method);
	}
	emit(event, ...args) {
		if (!this.#events.has(event)) {
			return;
		}
		
		return this.#events.get(event)(...args);
	}
	down(event) {
		event.preventDefault();
		
		this.isAlternate = !!event.button;
		this.isDown = true;
		this.pointA = {
			x: event.offsetX + this.parent.viewBox.x,
			y: event.offsetY + this.parent.viewBox.y
		}
		
		return this.emit("down", event);
	}
	move(event) {
		event.preventDefault();
		
		this.real = {
			x: event.offsetX,
			y: event.offsetY
		}
		
		return this.emit("move", event);
	}
	up(event) {
		event.preventDefault();
		
		this.isDown = false;
		this.pointB = {
			x: event.offsetX + this.parent.viewBox.x,
			y: event.offsetY + this.parent.viewBox.y
		}
		
		return this.emit("up", event);
	}
	wheel(event) {
		const zoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom'));
		if (event.deltaY > 0 && zoom >= 100 || event.deltaY < 0 && zoom < 1) {
			return;
		}
		
		document.documentElement.style.setProperty("--zoom", zoom + event.deltaY / 1000);
	}
	touchStart(event) {
		event.stopPropagation();
		for (const touch of event.touches) {
			const mouseEvent = document.createEvent('MouseEvent');
			mouseEvent.initMouseEvent('mousedown', true, true, window, event.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			this.down(mouseEvent);
		}
	}
	touchMove(event) {
		event.stopPropagation();
		for (const touch of event.touches) {
			const mouseEvent = document.createEvent('MouseEvent');
			mouseEvent.initMouseEvent('mousemove', true, true, window, event.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
			
			this.move(mouseEvent);
		}
	}
	touchEnd(event) {
		event.stopPropagation();
		for (const touch of event.changedTouches) {
			const mouseEvent = document.createEvent('MouseEvent');
			mouseEvent.initMouseEvent('mouseup', true, true, window, event.detail, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);

			this.up(mouseEvent);
		}
	}
	touchCancel(event) {
		this.isDown = false;
	}
	close() {
		document.removeEventListener("mousedown", this.down.bind(this));
		document.removeEventListener("mousemove", this.move.bind(this));
		document.removeEventListener("mouseup", this.up.bind(this));
	}
}