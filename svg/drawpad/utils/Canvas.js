import EventHandler from "./EventHandler.js";
import LayerManager from "./LayerManager.js";

import ToolHandler from "./ToolHandler.js";

import Mouse from "./Mouse.js";

export default class {
	constructor(view) {
		this.view = view;
		this.view.setAttribute("viewBox", `0 0 ${view.width.baseVal.value} ${view.height.baseVal.value}`);

		this.layers.create();

		this.mouse.init();
		this.mouse.on("down", this.mouseDown.bind(this));
		this.mouse.on("move", this.mouseMove.bind(this));
		this.mouse.on("up", this.mouseUp.bind(this));
	}
	toolSize = 4;
	#fill = false;
	#primary = "#87CEEB";
	#secondary = "#967BB6";
	text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	#layer = 1;
	selected = []
	clipboard = []
	mouse = new Mouse(this);
	tools = new ToolHandler(this);
	layers = new LayerManager();
	events = new EventHandler();
	get tool() {
		return this.tools.selected;
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
	get layerDepth() {
		return this.#layer;
	}
	set layerDepth(layer) {
		clearTimeout(this.text.timeout);

		this.text.setAttribute("x", this.view.width.baseVal.value / 2);
		this.text.setAttribute("y", 20 + this.viewBox.y);
		this.text.setAttribute("fill", this.primary);
		this.text.innerHTML = "Layer " + layer;
		this.view.appendChild(this.text);

		this.text.timeout = setTimeout(() => {
			this.text.remove();
		}, 2000);

		this.#layer = layer;
	}
	get layer() {
		return this.layers.get(this.#layer);
	}
	get fill() {
		return this.#fill;
	}
	set fill(boolean) {
		this.text.setAttribute("fill", boolean ? this.primary : "#FFFFFF00");
		this.circle.setAttribute("fill", boolean ? this.primary : "#FFFFFF00");
		this.rectangle.setAttribute("fill", boolean ? this.primary : "#FFFFFF00");

		this.#fill = boolean;
	}
	get container() {
		return this.view.parentElement;
	}
	get viewBox() {
		const viewBox = this.view.getAttribute("viewBox").split(/\s+/g);
		return {
			x: parseInt(viewBox[0]),
			y: parseInt(viewBox[1])
		}
	}
	undo() {
		const event = this.events.pop();
		if (event) {
			switch(event.action) {
				case "add":
					event.value.remove();
					break;

				case "remove":
					this.view.prepend(event.value);
					break;
			}

			return event;
		}

		return null;
	}
	redo() {
		const event = this.events.cache.pop();
		if (event) {
			switch(event.action) {
				case "add":
					this.view.prepend(event.value);
					break;

				case "remove":
					event.value.remove();
					break;
			}

			return event;
		}

		return null;
	}
	mouseDown(event) {
		if (event.button === 1) {
			this.tools.select(this.tool.constructor.id === "line" ? "brush" : this.tool.constructor.id === "brush" ? "eraser" : this.tool.constructor.id === "eraser" ? "camera" : "line");
			
			return;
		} else if (event.button === 2) {
			// open colour palette
			colour.style.left = this.mouse.real.x + "px";
			colour.style.top = this.mouse.real.y + "px";
			setTimeout(() => {
				colour.click();
			});
			
			return;
		}

		if (!this.mouse.isAlternate) {
			if (event.shiftKey) {
				clearTimeout(this.text.timeout);

				this.text.innerHTML = "Camera";
				this.text.setAttribute("x", this.view.width.baseVal.value / 2 - this.text.innerHTML.length * 2 + this.viewBox.x);
				this.text.setAttribute("y", 20 + this.viewBox.y);
				this.text.setAttribute("fill", this.primary);
				this.view.appendChild(this.text);

				this.text.timeout = setTimeout(() => {
					this.text.remove();
				}, 2000);

				return;
			}

			if (event.ctrlKey) {
				this.tools.select("select");
			}

			this.tool.mouseDown(event);
		}
		
		return;
	}
	mouseMove(event) {
		if (this.tool.constructor.id === "eraser") {
			this.tool.mouseMove(event);
			
			return;
		}

		if (this.mouse.isDown && !this.mouse.isAlternate) {	
			if (event.shiftKey) {
				this.view.setAttribute("viewBox", `${this.viewBox.x - event.movementX} ${this.viewBox.y - event.movementY} ${window.innerWidth} ${window.innerHeight}`);
				this.text.setAttribute("x", this.view.width.baseVal.value / 2 - this.text.innerHTML.length * 2 + this.viewBox.x);
				this.text.setAttribute("y", 20 + this.viewBox.y);
	
				return;
			}

			this.tool.mouseMove(event);
		}

		return;
	}
	mouseUp(event) {
		if (!this.mouse.isAlternate) {
			this.tool.mouseUp(event);
		}
		
		return;
	}
}