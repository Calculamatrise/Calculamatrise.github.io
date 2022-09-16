import Gamepad from "./Gamepad.js";
import Vector from "./Vector.js";

export default class {
	constructor(parent, { id }) {
		this.parent = parent;

		this.id = id;
		this.consumable = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		this.consumable.old = new Vector();
		let temp = Math.ceil(Math.random() * (parent.canvas.width.baseVal.value - 10));
		this.consumable.setAttribute("x", temp - temp % 10);
		temp = Math.ceil(Math.random() * (parent.canvas.height.baseVal.value - 10));
        this.consumable.setAttribute("y", temp - temp % 10);
        this.consumable.setAttribute("width", 10);
        this.consumable.setAttribute("height", 10);
		this.consumable.setAttribute("rx", 1);
        this.consumable.setAttribute("fill", "#d2a5ff");
		Object.defineProperty(this.consumable, "position", {
			get: function() {
				return new Vector(this.getAttribute("x"), this.getAttribute("y"));
			}
		});
		this.consumable.draw = function(ctx) {
			ctx.canvas.prepend(this);
		}

		// for (let part = 0, pos = {
		// 	x:  Math.round(parent.canvas.width.baseVal.value / 2),
		// 	y: Math.round(parent.canvas.height.baseVal.value / 2)
		// }; part < 5; part++) {
		// 	if (this.parts.length > 0) {
		// 		pos = this.parts[part - 1].position.sub(this.velocity.scale(10));
		// 	}
			
		// 	const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		// 	element.old = new Vector();
		// 	element.setAttribute("x", pos.x);
		// 	element.setAttribute("y", pos.y);
		// 	element.setAttribute("width", 10);
		// 	element.setAttribute("height", 10);
		// 	element.setAttribute("fill", this.parent.dark ? "#EBEBEB" : "1B1B1B");
		// 	Object.defineProperty(element, "position", {
		// 		get: function() {
		// 			return new Vector(this.getAttribute("x"), this.getAttribute("y"));
		// 		}
		// 	});
		// 	element.draw = function(ctx) {
		// 		ctx.svg.prepend(this);
		// 	}

		// 	this.parts.push(element);
		// }

		this.gamepad = new Gamepad();
		this.gamepad.on("keydown", this.control.bind(this));
	}
	dead = false;
	consumed = 0;
	orientation = Math.ceil(Math.random() * 4);
	parts = []
	get length() {
		return this.parts.length;
	}
	get velocity() {
		return new Vector(this.orientation === 2 ? 1 : this.orientation === 4 ? -1 : 0, this.orientation === 1 ? -1 : this.orientation === 3 ? 1 : 0);
	}
	get head() {
		return this.parts[0];
	}
	init(parent) {
		for (let part = 0, pos = {
			x:  Math.round(parent.canvas.width.baseVal.value / 2),
			y: Math.round(parent.canvas.height.baseVal.value / 2)
		}; part < 5; part++) {
			if (this.parts.length > 0) {
				pos = this.parts[part - 1].position.sub(this.velocity.scale(10));
			}
			
			const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			element.old = new Vector();
			element.setAttribute("x", pos.x);
			element.setAttribute("y", pos.y);
			element.setAttribute("width", 10);
			element.setAttribute("height", 10);
			element.setAttribute("fill", this.parent.dark ? "#EBEBEB" : "1B1B1B");
			Object.defineProperty(element, "position", {
				get: function() {
					return new Vector(this.getAttribute("x"), this.getAttribute("y"));
				}
			});
			element.draw = function(ctx) {
				ctx.svg.prepend(this);
			}

			this.parts.push(element);
			element.draw(this.parent.ctx);
		}
		
		this.consumable.draw(parent);
	}
	consume() {
		const pos = this.parts[this.parts.length - 1].position.sub(this.velocity.scale(10));
		const part = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		part.setAttribute("x", pos.x);
		part.setAttribute("y", pos.y);
		part.setAttribute("width", 10);
		part.setAttribute("height", 10);
		part.setAttribute("fill", this.parent.dark ? "#EBEBEB" : "1B1B1B");
		part.old = new Vector();
		part.draw = function(ctx) {
			ctx.svg.prepend(this);
		}
		
		Object.defineProperty(part, "position", {
			get: function() {
				return new Vector(this.getAttribute("x"), this.getAttribute("y"));
			}
		});
		
		this.parts.push(part);

		this.consumable.remove();
		let temp = Math.ceil(Math.random() * (this.parent.canvas.width.baseVal.value - 10));
		this.consumable.setAttribute("x", temp - temp % 10);
		temp = Math.ceil(Math.random() * (this.parent.canvas.height.baseVal.value - 10));
        this.consumable.setAttribute("y", temp - temp % 10);
		this.consumable.draw(this.parent);

		part.draw(this.parent.ctx);

		return this.consumed++;
	}
	kill() {
		const bestScore = JSON.parse(localStorage.getItem("best_score"));
		if (this.consumed > bestScore)
			localStorage.setItem("best_score", JSON.stringify(this.consumed));

		const bestScoreToday = JSON.parse(sessionStorage.getItem("best_score"));
		if (this.consumed > bestScoreToday)
			sessionStorage.setItem("best_score", JSON.stringify(this.consumed));

		this.dead = true;
	}
	update(delta) {
		if (this.parts.length < 1) {
			return;
		}
		
		this.head.old.copy(this.head.position);
		if (this.head.position.equals(this.consumable.position)) {
			this.consume(this.consumable);
		}

		let newPos = this.head.position.addToSelf(this.velocity.scale(10))//*/ this.head.position.lerpTowards(this.head.position.add(this.velocity), Math.cos(Math.PI * 0.5 * 1), delta);
		this.head.setAttribute("x", newPos.x);
		this.head.setAttribute("y", newPos.y);
		if (this.head.position.x < 0 || this.head.position.x >= this.parent.canvas.width.baseVal.value
		|| this.head.position.y < 0 || this.head.position.y >= this.parent.canvas.height.baseVal.value) {
			this.kill();

			return;
		}
		
		for (const part in this.parts) {
			if (part == 0)
				continue;
			
			if (this.head.position.equals(this.parts[part].position)) {
				this.kill();
				
				return;
			}
			
			this.parts[part].old.copy(this.parts[part].position);
			newPos = this.parts[part].position.copy(this.parts[part - 1].old);
			this.parts[part].setAttribute("x", newPos.x);
			this.parts[part].setAttribute("y", newPos.y);
		}
	}
	control(key) {
		switch(key) {
			case "ArrowUp":
				if (this.orientation === 3)
					break;
				
				this.orientation = 1;
			break;
				
			case "ArrowRight":
				if (this.orientation === 4)
					break;
				
				this.orientation = 2;
			break;
			
			case "ArrowDown":
				if (this.orientation === 1)
					break;
				
				this.orientation = 3;
			break;
				
			case "ArrowLeft":
				if (this.orientation === 2)
					break;
				
				this.orientation = 4;
			break;
		}
	}
	draw(ctx) {
		for (const part of this.parts) {
			part.draw(ctx);
		}
	}
	close() {
		for (const part of this.parts) {
			part.remove();
		}

		this.dead = false;
		this.consumed = 0;
		this.orientation = Math.ceil(Math.random() * 4);
		this.parts = []
	}
}