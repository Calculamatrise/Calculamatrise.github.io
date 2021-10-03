import Mouse from "./Mouse.js";

export default class {
	constructor(view) {
		this.view = view;
		this.view.setAttribute("viewBox", `0 0 ${view.width.baseVal.value} ${view.height.baseVal.value}`);

		this.mouse = new Mouse(this);
		this.mouse.init();
		this.mouse.on("down", this.mouseDown.bind(this));
		this.mouse.on("move", this.mouseMove.bind(this));
		this.mouse.on("up", this.mouseUp.bind(this));
	}
	#tool = "line";
	toolSize = 4;
	#fill = false;
	color = localStorage.getItem("--color") || "skyblue";
	text = document.createElementNS("http://www.w3.org/2000/svg", "text");
	line = document.createElementNS("http://www.w3.org/2000/svg", "line");
	circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	eraser = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	#lines = []
	get tool() {
		return this.#tool;
	}
	set tool(tool) {
		clearTimeout(this.text.timeout);

		this.line.remove();
		this.circle.remove();
		this.rectangle.remove();
		this.eraser.remove();
		
		this.text.setAttribute("x", 5 + this.viewBox.x);
		this.text.setAttribute("y", 20 + this.viewBox.y);
		this.text.setAttribute("fill", this.color);
		this.text.innerHTML = tool.charAt(0).toUpperCase() + tool.slice(1);
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
			this.view.removeChild(this.text);
		}, 2000);

		this.#tool = tool;
	}
	get fill() {
		return this.#fill;
	}
	set fill(boolean) {
		this.text.setAttribute("fill", boolean ? this.color : "#FFFFFF00");
		this.circle.setAttribute("fill", boolean ? this.color : "#FFFFFF00");
		this.rectangle.setAttribute("fill", boolean ? this.color : "#FFFFFF00");

		this.#fill = boolean;
	}
	get viewBox() {
		const viewBox = this.view.getAttribute("viewBox").split(/\s+/g);
		return {
			x: parseInt(viewBox[0]),
			y: parseInt(viewBox[1])
		}
	}
	mouseDown(event) {
		if (event.button === 1) {
			this.tool = this.#tool === "line" ? "brush" : this.#tool === "brush" ? "eraser" : this.#tool === "eraser" ? "camera" : "line";
			view.parentElement.style.cursor = this.#tool === "camera" ? "move" : "default";

			this.line.remove();
			this.eraser.remove();

			if (this.#tool === "eraser") {
				this.eraser.setAttribute("opacity", .8);
				this.eraser.setAttribute("fill", "khaki");
				this.eraser.setAttribute("cx", this.mouse.position.x);
				this.eraser.setAttribute("cy", this.mouse.position.y);
				this.eraser.setAttribute("r", this.toolSize * 5);
				view.appendChild(this.eraser);
				
				if (this.mouse.isDown && !this.mouse.isAlternate) {
					this.#lines.forEach(line => line.erase(event));
				}
			}

			return;
		} else if (event.button === 2) {
			// open colour palette
			colour.style.left = this.mouse.position.x + "px";
			colour.style.top = this.mouse.position.y + "px";
			setTimeout(() => {
				colour.click();
			});
			
			return;
		}
		
		if (this.#tool === "eraser") {
			this.#lines.forEach(line => line.erase(event));
		}

		if (!this.mouse.isAlternate) {
			if (this.#tool === "camera" || event.shiftKey) {
				this.text.setAttribute("x", 5 + this.viewBox.x);
				this.text.setAttribute("y", 20 + this.viewBox.y);
				this.text.setAttribute("fill", this.color);
				this.text.innerHTML = "Camera";
				this.view.appendChild(this.text);

				this.text.timeout = setTimeout(() => {
					this.view.removeChild(this.text);
				}, 2000);

				return;
			} else if (["line", "brush"].includes(this.#tool)) {
				this.line.setAttribute("stroke-width", this.toolSize);
				this.line.setAttribute("x1", this.mouse.pointA.x);
				this.line.setAttribute("y1", this.mouse.pointA.y);
				this.line.setAttribute("x2", this.mouse.position.x);
				this.line.setAttribute("y2", this.mouse.position.y);
				this.line.setAttribute("stroke", this.color);
				view.prepend(this.line);
			} else if (this.#tool === "circle") {
				this.circle.setAttribute("stroke-width", this.toolSize);
				this.circle.setAttribute("cx", this.mouse.pointA.x);
				this.circle.setAttribute("cy", this.mouse.pointA.y);
				this.circle.setAttribute("r", 1);
				this.circle.setAttribute("stroke", this.color);
				this.circle.setAttribute("fill", this.#fill ? this.color : "#FFFFFF00");
				view.prepend(this.circle);
			} else if (this.#tool === "rectangle") {
				this.rectangle.setAttribute("stroke-width", this.toolSize);
				this.rectangle.setAttribute("x", this.mouse.pointA.x);
				this.rectangle.setAttribute("y", this.mouse.pointA.y);
				this.rectangle.setAttribute("width", 1);
				this.rectangle.setAttribute("height", 1);
				this.rectangle.setAttribute("stroke", this.color);
				this.rectangle.setAttribute("fill", this.#fill ? this.color : "#FFFFFF00");
				this.rectangle.setAttribute("rx", .5);
				view.prepend(this.rectangle);
			}
		}
		
		return;
	}
	mouseMove(event) {
		if (this.mouse.isDown && !this.mouse.isAlternate && event.shiftKey) {
			this.view.setAttribute("viewBox", `${this.viewBox.x - event.movementX} ${this.viewBox.y - event.movementY} ${window.innerWidth} ${window.innerHeight}`);
			this.text.setAttribute("x", 5 + this.viewBox.x);
			this.text.setAttribute("y", 20 + this.viewBox.y);

			return;
		}

		if (this.#tool === "eraser") {
			this.eraser.setAttribute("opacity", .8);
			this.eraser.setAttribute("fill", "khaki");
			this.eraser.setAttribute("cx", this.mouse.position.x);
			this.eraser.setAttribute("cy", this.mouse.position.y);
			this.eraser.setAttribute("r", this.toolSize * 5);
			view.appendChild(this.eraser);
			
			if (this.mouse.isDown && !this.mouse.isAlternate) {
				this.#lines.forEach(line => line.erase(event));
			}
			
			return;
		}
		
		this.eraser.remove();
		if (this.mouse.isDown && !this.mouse.isAlternate) {
			if (this.#tool === "camera") {
				this.view.setAttribute("viewBox", `${this.viewBox.x - event.movementX} ${this.viewBox.y - event.movementY} ${window.innerWidth} ${window.innerHeight}`);
				this.text.setAttribute("x", 5 + this.viewBox.x);
				this.text.setAttribute("y", 20 + this.viewBox.y);

				return;
			}

			this.line.setAttribute("stroke-width", this.toolSize);
			this.line.setAttribute("x1", this.mouse.pointA.x);
			this.line.setAttribute("y1", this.mouse.pointA.y);
			this.line.setAttribute("x2", this.mouse.position.x);
			this.line.setAttribute("y2", this.mouse.position.y);
			this.line.setAttribute("stroke", this.color);
			
			if (this.#tool === "brush") {
				const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
				line.setAttribute("stroke-width", this.toolSize);
				line.setAttribute("x1", this.mouse.pointA.x);
				line.setAttribute("y1", this.mouse.pointA.y);
				line.setAttribute("x2", this.mouse.position.x);
				line.setAttribute("y2", this.mouse.position.y);
				line.setAttribute("stroke", this.color);
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
					}
				}

				line._remove = line.remove;
				line.remove = () => {
					this.#lines.splice(this.#lines.indexOf(line), 1);
					line._remove();
				}

				view.prepend(line);
				this.#lines.push(line);
				
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
					if (this.mouse.pointA.x === this.mouse.position.x && this.mouse.pointA.y === this.mouse.position.y) {
						return;
					}
					
					const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
					line.setAttribute("stroke-width", this.toolSize);
					line.setAttribute("x1", this.mouse.pointA.x);
					line.setAttribute("y1", this.mouse.pointA.y);
					line.setAttribute("x2", this.mouse.pointB.x);
					line.setAttribute("y2", this.mouse.pointB.y);
					line.setAttribute("stroke", this.color);
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
						}
					}

					line._remove = line.remove;
					line.remove = () => {
						this.#lines.splice(this.#lines.indexOf(line), 1);
						line._remove();
					}

					view.prepend(line);
					this.#lines.push(line);
					break;

				case "circle":
					const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
					circle.setAttribute("stroke-width", this.toolSize);
					circle.setAttribute("cx", this.mouse.pointA.x);
					circle.setAttribute("cy", this.mouse.pointA.y);
					circle.setAttribute("stroke", this.color);
					circle.setAttribute("fill", this.#fill ? this.color : "#FFFFFF00");

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
						}
					}

					this.view.prepend(circle);
					this.#lines.push(circle);

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
					rectangle.setAttribute("stroke", this.color);
					rectangle.setAttribute("fill", this.#fill ? this.color : "#FFFFFF00");
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
						}
					}

					view.prepend(rectangle);
					this.#lines.push(rectangle);

					break;
			}
		}
		
		return;
	}
}