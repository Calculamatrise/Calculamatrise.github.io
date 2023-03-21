export default class {
	_size = null;
	active = false;
	constructor(parent) {
		this.parent = parent;
	}

	get canvas() {
		return this.parent.canvas;
	}

	get mouse() {
		return this.canvas.mouse;
	}

	get size() {
		return this._size;
	}

	set size(size) {
		this._size = size;
		this.init();
	}

	draw() {}
	init() {}
	press() {}
	stroke() {}
	clip() {}
	close() {}
	keydown() {}
}