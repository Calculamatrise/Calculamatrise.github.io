export default class {
    constructor(parent) {
        this.parent = parent;
    }
    size = null;
    #primary = "#87CEEB";
	#secondary = "#967BB6";
    get canvas() {
        return this.parent.canvas;
    }
    get mouse() {
        return this.canvas.mouse;
    }
    get primary() {
		return localStorage.getItem("primaryColor") || this.#primary;
	}
	set primary(color) {
		localStorage.setItem("primaryColor", color);

		this.#primary = color;
	}
	get secondary() {
		return localStorage.getItem("secondaryColor") || this.#secondary;
	}
	set secondary(color) {
		localStorage.setItem("secondaryColor", color);

		this.#secondary = color;
	}
    init() {}
    mouseDown() {}
    mouseMove() {}
    mouseUp() {}
    close() {}
}