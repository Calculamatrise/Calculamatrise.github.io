import EventHandler from "./EventHandler.js";
import LayerManager from "./LayerManager.js";

import Mouse from "./Mouse.js";

export default class {
	constructor(view) {
		this.view = view;
		this.view.setAttribute("viewBox", `0 0 ${view.width.baseVal.value} ${view.height.baseVal.value}`);

		this.layers.create();

		this.mouse = new Mouse(this);
		this.mouse.init();
		this.mouse.on("down", this.mouseDown.bind(this));
		this.mouse.on("move", this.mouseMove.bind(this));
		this.mouse.on("up", this.mouseUp.bind(this));
	}
	#tool = "line";
	toolSize = 4;
	#fill = false;
	#primary = "#87CEEB";
	#secondary = "#967BB6";
	text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	layerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
	line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	eraser = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	#layer = 1;
	layers = new LayerManager();
	#events = new EventHandler();
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
		clearTimeout(this.layerText.timeout);

		this.layerText.setAttribute("x", this.view.width.baseVal.value / 2);
		this.layerText.setAttribute("y", 20 + this.viewBox.y);
		this.layerText.setAttribute("fill", this.primary);
		this.layerText.innerHTML = "Layer " + layer;
		this.view.appendChild(this.layerText);

		this.layerText.timeout = setTimeout(() => {
			this.layerText.remove();
		}, 2000);

		this.#layer = layer;
	}
	get layer() {
		return this.layers.get(this.#layer);
	}
	get tool() {
		return this.#tool;
	}
	set tool(tool) {
		clearTimeout(this.text.timeout);

		this.line.remove();
		this.circle.remove();
		this.rectangle.remove();
		this.eraser.remove();
		
		this.view.parentElement.style.cursor = tool === "camera" ? "move" : "default";

		this.text.innerHTML = tool.charAt(0).toUpperCase() + tool.slice(1);
		this.text.setAttribute("x", this.view.width.baseVal.value / 2 - this.text.innerHTML.length * 2 + this.viewBox.x);
		this.text.setAttribute("y", 20 + this.viewBox.y);
		this.text.setAttribute("fill", this.primary);
		this.view.appendChild(this.text);

		if (tool === "eraser") {
			this.eraser.setAttribute("opacity", .8);
			this.eraser.setAttribute("fill", "khaki");
			this.eraser.setAttribute("cx", this.mouse.position.x);
			this.eraser.setAttribute("cy", this.mouse.position.y);
			this.eraser.setAttribute("r", this.toolSize * 5);
			this.view.appendChild(this.eraser);
		}

		this.text.timeout = setTimeout(() => {
			this.text.remove();
		}, 2000);

		this.#tool = tool;
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
	get viewBox() {
		const viewBox = this.view.getAttribute("viewBox").split(/\s+/g);
		return {
			x: parseInt(viewBox[0]),
			y: parseInt(viewBox[1])
		}
	}
	undo() {
		const event = this.#events.pop();
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
		const event = this.#events.cache.pop();
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
			this.tool = this.#tool === "line" ? "brush" : this.#tool === "brush" ? "eraser" : this.#tool === "eraser" ? "camera" : "line";

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
		
		if (this.#tool === "eraser") {
			this.layer.lines.filter(line => !!line.parentElement).forEach(line => {
				if (line.erase(event)) {
					this.#events.push({
						action: "remove",
						value: line
					});
				}
			});
		}

		if (!this.mouse.isAlternate) {
			if (event.ctrlKey) {
				this.tool = "select";
			}

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
			
			switch(this.#tool) {
				case "line":
				case "brush":
					this.line.setAttribute("stroke-width", this.toolSize);
					this.line.setAttribute("x1", this.mouse.pointA.x);
					this.line.setAttribute("y1", this.mouse.pointA.y);
					this.line.setAttribute("x2", this.mouse.position.x);
					this.line.setAttribute("y2", this.mouse.position.y);
					this.line.setAttribute("stroke", this.primary);
					this.view.prepend(this.line);
					break;

				case "circle":
					this.circle.setAttribute("stroke-width", this.toolSize);
					this.circle.setAttribute("cx", this.mouse.pointA.x);
					this.circle.setAttribute("cy", this.mouse.pointA.y);
					this.circle.setAttribute("r", 1);
					this.circle.setAttribute("stroke", this.primary);
					this.circle.setAttribute("fill", this.#fill ? this.primary : "#FFFFFF00");
					this.view.prepend(this.circle);
					break;

				case "rectangle":
					this.rectangle.setAttribute("stroke-width", this.toolSize);
					this.rectangle.setAttribute("x", this.mouse.pointA.x);
					this.rectangle.setAttribute("y", this.mouse.pointA.y);
					this.rectangle.setAttribute("width", 1);
					this.rectangle.setAttribute("height", 1);
					this.rectangle.setAttribute("stroke", this.primary);
					this.rectangle.setAttribute("fill", this.#fill ? this.primary : "#FFFFFF00");
					this.rectangle.setAttribute("rx", .5);
					this.view.prepend(this.rectangle);
					break;

				case "select":
					this.rectangle.setAttribute("stroke-width", this.toolSize);
					this.rectangle.setAttribute("x", this.mouse.pointA.x);
					this.rectangle.setAttribute("y", this.mouse.pointA.y);
					this.rectangle.setAttribute("width", 0);
					this.rectangle.setAttribute("height", 0);
					this.rectangle.setAttribute("stroke", "#87CEEB");
					this.rectangle.setAttribute("fill", "#87CEEB80");
					this.rectangle.setAttribute("rx", .5);
					this.view.appendChild(this.rectangle);
					break;
			}
		}
		
		return;
	}
	mouseMove(event) {
		if (this.mouse.isDown && !this.mouse.isAlternate && this.tool == "select") {
			if (this.mouse.position.x - this.mouse.pointA.x > 0) {
				this.rectangle.setAttribute("x", this.mouse.pointA.x);
				this.rectangle.setAttribute("width", this.mouse.position.x - this.mouse.pointA.x);
			} else {
				this.rectangle.setAttribute("x", this.mouse.position.x);
				this.rectangle.setAttribute("width", this.mouse.pointA.x - this.mouse.position.x);
			}

			if (this.mouse.position.y - this.mouse.pointA.y > 0) {
				this.rectangle.setAttribute("y", this.mouse.pointA.y);
				this.rectangle.setAttribute("height", this.mouse.position.y - this.mouse.pointA.y);
			} else {
				this.rectangle.setAttribute("y", this.mouse.position.y);
				this.rectangle.setAttribute("height", this.mouse.pointA.y - this.mouse.position.y);
			}

			return;
		}

		if (this.mouse.isDown && !this.mouse.isAlternate && event.shiftKey) {
			this.view.setAttribute("viewBox", `${this.viewBox.x - event.movementX} ${this.viewBox.y - event.movementY} ${window.innerWidth} ${window.innerHeight}`);
			this.text.setAttribute("x", this.view.width.baseVal.value / 2 - this.text.innerHTML.length * 2 + this.viewBox.x);
			this.text.setAttribute("y", 20 + this.viewBox.y);

			return;
		}

		if (this.#tool === "eraser") {
			this.eraser.setAttribute("cx", this.mouse.position.x);
			this.eraser.setAttribute("cy", this.mouse.position.y);
			if (this.mouse.isDown && !this.mouse.isAlternate) {
				this.layer.lines.filter(line => !!line.parentElement).forEach(line => {
					if (line.erase(event)) {
						this.#events.push({
							action: "remove",
							value: line
						});
					}
				});
			}
			
			return;
		}

		if (this.mouse.isDown && !this.mouse.isAlternate) {
			if (this.#tool === "camera") {
				this.view.setAttribute("viewBox", `${this.viewBox.x - event.movementX} ${this.viewBox.y - event.movementY} ${window.innerWidth} ${window.innerHeight}`);
				this.text.setAttribute("x", this.view.width.baseVal.value / 2 - this.text.innerHTML.length * 2 + this.viewBox.x);
				this.text.setAttribute("y", 20 + this.viewBox.y);

				return;
			}

			this.line.setAttribute("stroke-width", this.toolSize);
			this.line.setAttribute("x1", this.mouse.pointA.x);
			this.line.setAttribute("y1", this.mouse.pointA.y);
			this.line.setAttribute("x2", this.mouse.position.x);
			this.line.setAttribute("y2", this.mouse.position.y);
			this.line.setAttribute("stroke", this.primary);
			
			if (this.#tool === "brush") {
				if (this.mouse.pointA.x === this.mouse.position.x && this.mouse.pointA.y === this.mouse.position.y) {
					return;
				}
				
				const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
				line.setAttribute("stroke-width", this.toolSize);
				line.setAttribute("x1", this.mouse.pointA.x);
				line.setAttribute("y1", this.mouse.pointA.y);
				line.setAttribute("x2", this.mouse.position.x);
				line.setAttribute("y2", this.mouse.position.y);
				line.setAttribute("stroke", this.primary);
				line.erase = function(event) {
					let vector = {
						x: (parseInt(this.getAttribute("x2")) - window.canvas.viewBox.x) - (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x),
						y: (parseInt(this.getAttribute("y2")) - window.canvas.viewBox.y) - (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y)
					}
					let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
					let b = (event.offsetX - (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x)) * (vector.x / len) + (event.offsetY - (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y)) * (vector.y / len);
					const v = {
						x: 0,
						y: 0
					}

					if (b <= 0) {
						v.x = parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x;
						v.y = parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y;
					} else if (b >= len) {
						v.x = parseInt(this.getAttribute("x2")) - window.canvas.viewBox.x;
						v.y = parseInt(this.getAttribute("y2")) - window.canvas.viewBox.y;
					} else {
						v.x = (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x) + vector.x / len * b;
						v.y = (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y) + vector.y / len * b;
					}

					const res = {
						x: event.offsetX - v.x,
						y: event.offsetY - v.y
					}

					len = Math.sqrt(res.x ** 2 + res.y ** 2);
					if (len <= window.canvas.toolSize * 5) {
						this.remove();

						return true;
					}

					return false;
				}

				if (!this.layer.hidden) {
					this.view.prepend(line);
				}

				this.layer.lines.push(line);
				this.#events.push({
					action: "add",
					value: line
				});
				
				this.mouse.pointA = this.mouse.position;
			} else if (this.#tool === "circle") {
				let sumX = this.mouse.position.x - this.mouse.pointA.x;
				if (sumX < 0) {
					sumX *= -1;
				}

				let sumY = this.mouse.position.y - this.mouse.pointA.y;
				if (sumY < 0) {
					sumY *= -1;
				}

				let radius = sumX + sumY;
				if (radius < 0) {
					radius *= -1;
				}

				this.circle.setAttribute("r", radius / Math.PI * 2);
			} else if (this.#tool === "rectangle") {
				if (this.mouse.position.x - this.mouse.pointA.x > 0) {
					this.rectangle.setAttribute("x", this.mouse.pointA.x);
					this.rectangle.setAttribute("width", this.mouse.position.x - this.mouse.pointA.x);
				} else {
					this.rectangle.setAttribute("x", this.mouse.position.x);
					this.rectangle.setAttribute("width", this.mouse.pointA.x - this.mouse.position.x);
				}

				if (this.mouse.position.y - this.mouse.pointA.y > 0) {
					this.rectangle.setAttribute("y", this.mouse.pointA.y);
					this.rectangle.setAttribute("height", this.mouse.position.y - this.mouse.pointA.y);
				} else {
					this.rectangle.setAttribute("y", this.mouse.position.y);
					this.rectangle.setAttribute("height", this.mouse.pointA.y - this.mouse.position.y);
				}
			}
		}
		
		return;
	}
	mouseUp(event) {
		if (!this.mouse.isAlternate) {
			this.line.remove();
			this.circle.remove();
			this.rectangle.remove();
			switch(this.#tool) {
				case "line":
					if (this.mouse.pointA.x === this.mouse.pointB.x && this.mouse.pointA.y === this.mouse.pointB.y) {
						return;
					}
					
					const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
					line.setAttribute("stroke-width", this.toolSize);
					line.setAttribute("x1", this.mouse.pointA.x);
					line.setAttribute("y1", this.mouse.pointA.y);
					line.setAttribute("x2", this.mouse.pointB.x);
					line.setAttribute("y2", this.mouse.pointB.y);
					line.setAttribute("stroke", this.primary);
					line.erase = function(event) {
						let vector = {
							x: (parseInt(this.getAttribute("x2")) - window.canvas.viewBox.x) - (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x),
							y: (parseInt(this.getAttribute("y2")) - window.canvas.viewBox.y) - (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y)
						}
						let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
						let b = (event.offsetX - (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x)) * (vector.x / len) + (event.offsetY - (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y)) * (vector.y / len);
						const v = {
							x: 0,
							y: 0
						}

						if (b <= 0) {
							v.x = parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x;
							v.y = parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y;
						} else if (b >= len) {
							v.x = parseInt(this.getAttribute("x2")) - window.canvas.viewBox.x;
							v.y = parseInt(this.getAttribute("y2")) - window.canvas.viewBox.y;
						} else {
							v.x = (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x) + vector.x / len * b;
							v.y = (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y) + vector.y / len * b;
						}

						const res = {
							x: event.offsetX - v.x,
							y: event.offsetY - v.y
						}

						len = Math.sqrt(res.x ** 2 + res.y ** 2);
						if (len <= window.canvas.toolSize * 5) {
							this.remove();

							return true;
						}

						return false;
					}

					if (!this.layer.hidden) {
						this.view.querySelector(`g[data-id='${this.#layer}']`).prepend(line);
					}

					this.layer.lines.push(line);
					this.#events.push({
						action: "add",
						value: line
					});
					
					break;

				case "circle":
					const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					circle.setAttribute("stroke-width", this.toolSize);
					circle.setAttribute("cx", this.mouse.pointA.x);
					circle.setAttribute("cy", this.mouse.pointA.y);
					circle.setAttribute("stroke", this.primary);
					circle.setAttribute("fill", this.#fill ? this.primary : "#FFFFFF00");

					let sumX = this.mouse.position.x - this.mouse.pointA.x;
					if (sumX < 0) {
						sumX *= -1;
					}

					let sumY = this.mouse.position.y - this.mouse.pointA.y;
					if (sumY < 0) {
						sumY *= -1;
					}

					let radius = sumX + sumY;
					if (radius < 0) {
						radius *= -1;
					}

					circle.setAttribute("r", radius / Math.PI * 2);
					circle.erase = function(event) {
						let vector = {
							x: (parseInt(this.getAttribute("r")) - window.canvas.viewBox.x) - (parseInt(this.getAttribute("cx")) - window.canvas.viewBox.x),
							y: (parseInt(this.getAttribute("r")) - window.canvas.viewBox.y) - (parseInt(this.getAttribute("cy")) - window.canvas.viewBox.y)
						}
						let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
						let b = (event.offsetX - (parseInt(this.getAttribute("cx")) - window.canvas.viewBox.x)) * (vector.x / len) + (event.offsetY - (parseInt(this.getAttribute("cy")) - window.canvas.viewBox.y)) * (vector.y / len);
						const v = {
							x: 0,
							y: 0
						}
	
						if (b <= 0) {
							v.x = parseInt(this.getAttribute("cx")) - window.canvas.viewBox.x;
							v.y = parseInt(this.getAttribute("cy")) - window.canvas.viewBox.y;
						} else if (b >= len) {
							v.x = parseInt(this.getAttribute("r")) - window.canvas.viewBox.x;
							v.y = parseInt(this.getAttribute("r")) - window.canvas.viewBox.y;
						} else {
							v.x = (parseInt(this.getAttribute("cx")) - window.canvas.viewBox.x) + vector.x / len * b;
							v.y = (parseInt(this.getAttribute("cy")) - window.canvas.viewBox.y) + vector.y / len * b;
						}
	
						const res = {
							x: event.offsetX - v.x,
							y: event.offsetY - v.y
						}
	
						len = Math.sqrt(res.x ** 2 + res.y ** 2);
						if (len <= window.canvas.toolSize * 5) {
							this.remove();

							return true;
						}

						return false;
					}

					if (!this.layer.hidden) {
						this.view.querySelector(`g[data-id='${this.#layer}']`).prepend(circle);
					}

					this.layer.lines.push(circle);
					this.#events.push({
						action: "add",
						value: circle
					});

					break;

				case "rectangle":
					const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
					if (this.mouse.position.x - this.mouse.pointA.x > 0) {
						rectangle.setAttribute("x", this.mouse.pointA.x);
						rectangle.setAttribute("width", this.mouse.position.x - this.mouse.pointA.x);
					} else {
						rectangle.setAttribute("x", this.mouse.position.x);
						rectangle.setAttribute("width", this.mouse.pointA.x - this.mouse.position.x);
					}
	
					if (this.mouse.position.y - this.mouse.pointA.y > 0) {
						rectangle.setAttribute("y", this.mouse.pointA.y);
						rectangle.setAttribute("height", this.mouse.position.y - this.mouse.pointA.y);
					} else {
						rectangle.setAttribute("y", this.mouse.position.y);
						rectangle.setAttribute("height", this.mouse.pointA.y - this.mouse.position.y);
					}

					rectangle.setAttribute("stroke-width", this.toolSize);
					rectangle.setAttribute("stroke", this.primary);
					rectangle.setAttribute("fill", this.#fill ? this.primary : "#FFFFFF00");
					rectangle.setAttribute("rx", .5);
					rectangle.erase = function(event) {
						let vector = {
							x: (parseInt(this.getAttribute("width")) + parseInt(this.getAttribute("x")) - window.canvas.viewBox.x) - (parseInt(this.getAttribute("x")) - window.canvas.viewBox.x),
							y: (parseInt(this.getAttribute("height")) + parseInt(this.getAttribute("y")) - window.canvas.viewBox.y) - (parseInt(this.getAttribute("y")) - window.canvas.viewBox.y)
						}
						let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
						let b = (event.offsetX - (parseInt(this.getAttribute("x")) - window.canvas.viewBox.x)) * (vector.x / len) + (event.offsetY - (parseInt(this.getAttribute("y")) - window.canvas.viewBox.y)) * (vector.y / len);
						const v = {
							x: 0,
							y: 0
						}
	
						if (b <= 0) {
							v.x = parseInt(this.getAttribute("x")) - window.canvas.viewBox.x;
							v.y = parseInt(this.getAttribute("y")) - window.canvas.viewBox.y;
						} else if (b >= len) {
							v.x = parseInt(this.getAttribute("width")) + parseInt(this.getAttribute("x")) - window.canvas.viewBox.x;
							v.y = parseInt(this.getAttribute("height")) + parseInt(this.getAttribute("y")) - window.canvas.viewBox.y;
						} else {
							v.x = (parseInt(this.getAttribute("x")) - window.canvas.viewBox.x) + vector.x / len * b;
							v.y = (parseInt(this.getAttribute("y")) - window.canvas.viewBox.y) + vector.y / len * b;
						}
	
						const res = {
							x: event.offsetX - v.x,
							y: event.offsetY - v.y
						}
	
						len = Math.sqrt(res.x ** 2 + res.y ** 2);
						if (len <= window.canvas.toolSize * 5) {
							this.remove();

							return true;
						}

						return false;
					}

					if (!this.layer.hidden) {
						this.view.querySelector(`g[data-id='${this.#layer}']`).prepend(rectangle);
					}

					this.layer.lines.push(rectangle);
					this.#events.push({
						action: "add",
						value: rectangle
					});

					break;

				case "select":
					if (this.mouse.position.x - this.mouse.pointA.x > 0) {
						this.rectangle.setAttribute("x", this.mouse.pointA.x);
						this.rectangle.setAttribute("width", this.mouse.position.x - this.mouse.pointA.x);
					} else {
						this.rectangle.setAttribute("x", this.mouse.position.x);
						this.rectangle.setAttribute("width", this.mouse.pointA.x - this.mouse.position.x);
					}
		
					if (this.mouse.position.y - this.mouse.pointA.y > 0) {
						this.rectangle.setAttribute("y", this.mouse.pointA.y);
						this.rectangle.setAttribute("height", this.mouse.position.y - this.mouse.pointA.y);
					} else {
						this.rectangle.setAttribute("y", this.mouse.position.y);
						this.rectangle.setAttribute("height", this.mouse.pointA.y - this.mouse.position.y);
					}
		
					break;
			}
		}
		
		return;
	}
}