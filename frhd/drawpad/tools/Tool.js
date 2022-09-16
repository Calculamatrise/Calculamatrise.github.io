export default class {
    constructor(parent) {
        this.parent = parent;
    }
    _size = null;
    active = false;
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

        clearTimeout(this.canvas.text.timeout);

        this.canvas.text.innerHTML = this.parent._selected.charAt(0).toUpperCase() + this.parent._selected.slice(1) + " size - " + this.size;
		this.canvas.text.setAttribute("x", this.canvas.view.width / 2 - this.canvas.text.innerHTML.length * 2.5 + this.canvas.view.x);
		this.canvas.text.setAttribute("y", 25 + this.canvas.view.y);
		this.canvas.text.setAttribute("fill", this.canvas.dark ? "#FBFBFB" : "1B1B1B");
		this.canvas.view.appendChild(this.canvas.text);

        this.canvas.text.timeout = setTimeout(() => {
			this.canvas.text.remove();
		}, 2000);
    }

    init() {}
    press() {}
    stroke() {}
    clip() {}
    close() {}
}