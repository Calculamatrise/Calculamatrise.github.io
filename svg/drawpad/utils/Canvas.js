import Mouse from "./Mouse.js";

export default class {
	constructor(view) {
		this.view = view;
		this.view.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);

		this.mouse = new Mouse(this);
		this.mouse.init();
		this.mouse.on("down", this.mouseDown.bind(this));
		this.mouse.on("move", this.mouseMove.bind(this));
		this.mouse.on("up", this.mouseUp.bind(this));
	}
	tool = "line";
	toolSize = 4;
	color = localStorage.getItem("--color") || "skyblue";
	eraser = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	connection = document.createElementNS("http://www.w3.org/2000/svg", "line");
	#lines = []
	get viewBox() {
		const viewBox = this.view.getAttribute("viewBox").split(/\s+/g);
		return {
			x: parseInt(viewBox[0]),
			y: parseInt(viewBox[1])
		}
	}
	mouseDown(event) {
		if (event.button === 1) {
			this.tool = this.tool === "line" ? "brush" : this.tool === "brush" ? "eraser" : this.tool === "eraser" ? "camera" : "line";
			view.parentElement.style.cursor = this.tool === "camera" ? "move" : "default";
			
			this.connection.remove();
			this.eraser.remove();

			if (this.tool === "eraser") {
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
		
		if (this.tool === "eraser") {
			this.#lines.forEach(line => line.erase(event));
		}

		if (!this.mouse.isAlternate && ["line", "brush"].includes(this.tool)) {
			this.connection.setAttribute("stroke-width", this.toolSize);
			this.connection.setAttribute("x1", this.mouse.pointA.x);
			this.connection.setAttribute("y1", this.mouse.pointA.y);
			this.connection.setAttribute("x2", this.mouse.position.x);
			this.connection.setAttribute("y2", this.mouse.position.y);
			this.connection.setAttribute("stroke", this.color);
			view.prepend(this.connection);
		}
		
		return;
	}
	mouseMove(event) {
		if (this.tool === "eraser") {
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
			if (this.tool === "camera") {
				this.view.setAttribute("viewBox", `${this.viewBox.x - event.movementX} ${this.viewBox.y - event.movementY} ${window.innerWidth} ${window.innerHeight}`);

				return;
			}

			this.connection.setAttribute("stroke-width", this.toolSize);
			this.connection.setAttribute("x1", this.mouse.pointA.x);
			this.connection.setAttribute("y1", this.mouse.pointA.y);
			this.connection.setAttribute("x2", this.mouse.position.x);
			this.connection.setAttribute("y2", this.mouse.position.y);
			this.connection.setAttribute("stroke", this.color);
			
			if (this.tool === "brush") {
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
				view.prepend(line);
				this.#lines.push(line);
				
				this.mouse.pointA = this.mouse.position;
			}
		}
		
		return;
	}
	mouseUp(event) {
		this.connection.remove();
		if (!this.mouse.isAlternate && this.tool === "line") {
			if (this.mouse.pointA.x === this.mouse.position.x || this.mouse.pointA.y === this.mouse.position.y) {
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
			view.prepend(line);
			this.#lines.push(line);
		}
		
		return;
	}
}