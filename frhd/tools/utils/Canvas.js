import MouseHandler from "./MouseHandler.js";
import EventHandler from "./EventHandler.js";
import ToolHandler from "./ToolHandler.js";

import LayerManager from "./LayerManager.js";

export default class {
	constructor(view) {
		this.view = view;
        this.view.x = 0;
        this.view.y = 0;

        this.ctx = this.view.getContext("2d");

        this.layers.create();

		this.mouse.init();
		this.mouse.on("down", this.mouseDown.bind(this));
		this.mouse.on("move", this.mouseMove.bind(this));
		this.mouse.on("up", this.mouseUp.bind(this));

		window.addEventListener("resize", this.resize.bind(this));
        this.resize();

		document.addEventListener("keydown", this.keyDown.bind(this));
	}
	zoom = 1;
	zoomIncrementValue = 0.5;
    #layer = 1;
	#fill = false;
	mouse = new MouseHandler(this);
    layers = new LayerManager();
	events = new EventHandler();
	tools = new ToolHandler(this);
	text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	get dark() {
		return JSON.parse(localStorage.getItem("dark")) ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	get tool() {
		return this.tools.selected;
	}
	get primary() {
		return this.dark ? "#fff" : "#000";
	}
	get secondary() {
		return this.dark ? "#999" : "#aaa";
	}
	get fill() {
		return this.#fill;
	}
	set fill(boolean) {
		this.text.setAttribute("fill", boolean ? this.primary : "#FFFFFF00");
		this.tool.element.setAttribute("fill", boolean ? this.primary : "#FFFFFF00");

		this.#fill = boolean;
	}
    get layerDepth() {
		return this.#layer;
	}
	set layerDepth(layer) {
		clearTimeout(this.text.timeout);

		this.text.innerHTML = "Layer " + layer;
		this.text.setAttribute("x", this.viewBox.width / 2 + this.viewBox.x - this.text.innerHTML.length * 2.5);
		this.text.setAttribute("y", 25 + this.viewBox.y);
		this.text.setAttribute("fill", this.dark ? "#FBFBFB" : "1B1B1B");
		this.view.appendChild(this.text);

		this.text.timeout = setTimeout(() => {
			this.text.remove();
		}, 2000);

		this.#layer = layer;
	}
	get layer() {
		return this.layers.get(this.#layer);
	}
	get container() {
		return this.view.parentElement || document.querySelector("#container");
	}
	import(data) {
		try {
            throw new Error("INCOMPLETE METHOD");
			// this.close();

			// const newView = new DOMParser().parseFromString(data, "text/xml").querySelector("svg");

			// this.view.innerHTML = newView.innerHTML;
		} catch(error) {
			console.error(error);
		}
	}
	resize(event) {
		this.view.setAttribute("height", getComputedStyle(this.view).getPropertyValue('height').slice(0, -2) * window.devicePixelRatio);
		this.view.setAttribute("width", getComputedStyle(this.view).getPropertyValue('width').slice(0, -2) * window.devicePixelRatio);

		this.text.setAttribute("x", this.view.width / 2 + this.view.x - this.text.innerHTML.length * 2.5);
		this.text.setAttribute("y", 25);

        this.draw(this);
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

				case "move_selected":
					event.data.selected.map(function(line, index) {
						let type = parseInt(line.getAttribute("x")) ? 0 : parseInt(line.getAttribute("x1")) ? 1 : parseInt(line.getAttribute("cx")) ? 2 : parseInt(line.getAttribute("points")) ? 3 : NaN;
						if (isNaN(type)) {
							return;
						}
		
						switch(type) {
							case 0:
								line.setAttribute("x", event.data.cache[index].getAttribute("x"));
								line.setAttribute("y", event.data.cache[index].getAttribute("y"));
		
								break;
		
							case 1:
								line.setAttribute("x1", event.data.cache[index].getAttribute("x1"));
								line.setAttribute("y1", event.data.cache[index].getAttribute("y1"));
								line.setAttribute("x2", event.data.cache[index].getAttribute("x2"));
								line.setAttribute("y2", event.data.cache[index].getAttribute("y2"));
		
								break;
		
							case 2:
								line.setAttribute("cx", event.data.cache[index].getAttribute("cx"));
								line.setAttribute("cy", event.data.cache[index].getAttribute("cy"));
		
								break;

							case 3:
								line.setAttribute("points", event.data.cache[index].getAttribute("points"));

								break;
						}
					});

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

				case "move_selected":
					event.data.selected.map(function(line, index) {
						let type = parseInt(line.getAttribute("x")) ? 0 : parseInt(line.getAttribute("x1")) ? 1 : parseInt(line.getAttribute("cx")) ? 2 : parseInt(line.getAttribute("points")) ? 3 : NaN;
						if (isNaN(type)) {
							return;
						}
		
						switch(type) {
							case 0:
								line.setAttribute("x", event.data.secondaryCache[index].getAttribute("x"));
								line.setAttribute("y", event.data.secondaryCache[index].getAttribute("y"));
		
								break;
		
							case 1:
								line.setAttribute("x1", event.data.secondaryCache[index].getAttribute("x1"));
								line.setAttribute("y1", event.data.secondaryCache[index].getAttribute("y1"));
								line.setAttribute("x2", event.data.secondaryCache[index].getAttribute("x2"));
								line.setAttribute("y2", event.data.secondaryCache[index].getAttribute("y2"));
		
								break;
		
							case 2:
								line.setAttribute("cx", event.data.secondaryCache[index].getAttribute("cx"));
								line.setAttribute("cy", event.data.secondaryCache[index].getAttribute("cy"));
		
								break;

							case 3:
								line.setAttribute("points", event.data.secondaryCache[index].getAttribute("points"));

								break;
						}
					});

					break;
			}

			return event;
		}

		return null;
	}
	mouseDown(event) {
		const patchNotes = this.container.querySelector("#patch-notes") || {};
		if (patchNotes.iframe) {
			patchNotes.iframe.remove();

			patchNotes.iframe = null;
		}

		if (event.button === 1) {
			this.tools.select(this.tool.constructor.id === "line" ? "brush" : this.tool.constructor.id === "brush" ? "eraser" : this.tool.constructor.id === "eraser" ? "camera" : "line");
			
			return;
		} else if (event.button === 2) {
			// draw scenery lines
			
			return;
		}

		if (!this.mouse.isAlternate) {
			if (event.shiftKey) {
				clearTimeout(this.text.timeout);

				this.text.innerHTML = "Camera";
				this.text.setAttribute("x", this.view.width / 2 - this.text.innerHTML.length * 2 + this.view.x);
				this.text.setAttribute("y", 20 + this.view.y);
				this.view.appendChild(this.text);

				this.text.timeout = setTimeout(() => {
					this.text.remove();
				}, 2000);

				return;
			}

			if (event.ctrlKey) {
				this.tools.select("select");
			}

			this.tool.press(event);
		}

        this.draw();
		
		return;
	}
	mouseMove(event) {
		if (this.mouse.isDown && !this.mouse.isAlternate) {	
			if (event.shiftKey) {
				this.tools.get("camera").stroke(event);
	
				return;
			}

			this.tool.stroke(event);
		}

		if (["curve", "eraser"].includes(this.tool.constructor.id)) {
			this.tool.stroke(event);
		}

        if (this.tool.active) {
            this.draw();
        }

		return;
	}
	mouseUp(event) {
		if (!this.mouse.isAlternate) {
			this.tool.clip(event);
		}

        this.draw();
		
		return;
	}
	keyDown(event) {
		event.preventDefault();
		event.stopPropagation();
		switch(event.key) {
			case "Escape":
				if (layers.style.display !== "none") {
					layers.style.display = "none";
					
					break;
				}
	
				//settings.style.visibility = "show";
				settings.style.display = settings.style.display === "flex" ? "none" : "flex";
				break;
			
			case "=":
				if (this.tool.constructor.id === "camera" || event.ctrlKey) {
					if (this.zoom <= 1) {
						break;
					}

					this.zoom -= this.zoomIncrementValue;

                    this.view.x = this.view.x + (this.view.width - window.innerWidth * this.zoom) / 2;
                    this.view.y = this.view.y + (this.view.height - window.innerHeight * this.zoom) / 2;
					
                    this.text.setAttribute("y", 25 + this.view.y);
					this.tool.init();

					break;
				}

				if (this.tool.size >= 100) {
					break;
				}
	
				this.tool.size += 1;
				break;
				
			case "-":
				if (this.tool.constructor.id === "camera" || event.ctrlKey) {
					if (this.zoom >= 10) {
						break;
					}

					this.zoom += this.zoomIncrementValue;

                    this.view.x = this.view.x - (window.innerWidth - this.view.width) / 2;
                    this.view.y = this.view.y - (window.innerHeight - this.view.height) / 2;

					this.text.setAttribute("y", 25 + this.view.y);
					this.tool.init();

					break;
				}

				if (this.tool.size <= 2) {
					break;
				}
	
				this.tool.size -= 1;
				break;
	
			case "0":
				this.tools.select("camera");
				break;
	
			case "1":
				this.tools.select("line");
				break;
			
			case "2":
				this.tools.select("brush");
				break;
	
			case "3":
				this.tools.select("circle");
				break;
	
			case "4":
				this.tools.select("rectangle");
				break;
	
			case "5":
				this.tools.select("eraser");
				break;
	
			case "f":
				this.fill = !this.fill;
				break;
	
			case "z":
				this.undo();
				break;
	
			case "x":
				this.redo();
				break;
	
			case "c":
				if (this.tool.constructor.id === "select" && event.ctrlKey) {
					this.tool.copy();
	
					break;
				}
				
				break;
	
			case "v":
				if (this.tool.constructor.id === "select" && event.ctrlKey) {
					this.tool.paste();
	
					break;
				}
	
				break;
		}
	}
    draw() {
        this.ctx.clearRect(0, 0, this.view.width, this.view.height);
        this.layers.cache.forEach(layer => layer.draw(this));
    }
	toString() {
		return this.view.outerHTML;
	}
	close() {
		this.mouse.close();
		this.events.close();
	}
}