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
    createElementNS(element, properties = {}) {
        if (typeof element !== "string" || element === void 0) {
			throw new Error("Invalid element! What were you thinking?");
		} else if (typeof properties !== "object" || properties === void 0) {
			throw new Error("Invalid property object! What were you thinking?");
		}

        element = document.createElementNS("http://www.w3.org/2000/svg", element);
        for (const property in properties) {
            if (typeof properties[property] === "function") {
                throw new Error("Haven't gotten to this yet.");

                continue;
            } else if (property.toLowerCase() === "style" && typeof properties[property] === "object") {
                for (const style in properties[property]) {
                    element.style.setProperty(style, properties[property][style]);
                }
                
                continue;
            }

            element.setAttribute(property, properties[property]);
        }

        return element;
    }
    init() {}
    mouseDown() {}
    mouseMove() {}
    mouseUp() {}
    close() {}
}