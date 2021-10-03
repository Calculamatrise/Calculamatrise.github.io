import Gamepad from "./Gamepad.js";
import Part from "./Part.js";
import Consumable from "./Consumable.js";
import Vector from "./Vector.js";

export default class {
	constructor(parent, { id }) {
		this.parent = parent;

		this.parts = Array.from({ length: 5 }, function() {
			const part = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			part.setAttribute("x", Math.round(parent.canvas.width.baseVal.value / 2));
			part.setAttribute("y", Math.round(parent.canvas.height.baseVal.value / 2));
			part.setAttribute("width", 10);
			part.setAttribute("height", 10);
			part.setAttribute("rx", 1);
			part.setAttribute("fill", "#d2a5ff");
			part.old = new Vector();
			part.draw = function(ctx) {
				ctx.svg.prepend(this);
			}
			
			Object.defineProperty(part, "position", {
				get: function() {
					return new Vector(this.getAttribute("x"), this.getAttribute("y"));
				}
			});

			return part;
			//return new Part(Math.round(parent.canvas.width.baseVal.value / 2 / 10), Math.round(parent.canvas.height.baseVal.value / 2 / 10));
		});
		
		this.id = id;
		this.dead = false;
		this.consumed = 0;
		
		this.consumable = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		this.consumable.setAttribute("x", Math.ceil(Math.random() * (parent.canvas.height.baseVal.value - 10)));
        this.consumable.setAttribute("y", Math.ceil(Math.random() * (parent.canvas.height.baseVal.value - 10)));
        this.consumable.setAttribute("width", 10);
        this.consumable.setAttribute("height", 10);
		this.consumable.setAttribute("rx", 1);
        this.consumable.setAttribute("fill", "#d2a5ff");
		this.consumable.old = new Vector();
		this.consumable.draw = function(ctx) {
			ctx.canvas.prepend(this);
		}

		Object.defineProperty(this.consumable, "position", {
			get: function() {
				return new Vector(this.getAttribute("x"), this.getAttribute("y"));
			}
		});

		this.gamepad = new Gamepad();
		this.gamepad.on("keydown", this.control.bind(this));
	}
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
		this.dead = false;
		this.consumed = 0;
		this.orientation = Math.ceil(Math.random() * 4);
		
		for (const part in this.parts) {
			if (part == 0)
				continue;
			
			const position = {
				x: parseInt(this.parts[part].getAttribute("x")),
				y: parseInt(this.parts[part].getAttribute("y"))
			}
			
			switch(this.orientation) {
				case 1:
					position.y += part * 10;
				break;
					
				case 2:
					position.x -= part * 10;
				break;
					
				case 3:
					position.y -= part * 10;
				break;
					
				case 4:
					position.x += part * 10;
				break;
			}
			
			this.parts[part].setAttribute("x", position.x);
			this.parts[part].setAttribute("y", position.y);
		}
		
		this.consumable.draw(parent);
	}
	consume() {
		const lastPart = this.parts[this.parts.length - 1].position;
		this.parts.push(new Part(lastPart.x, lastPart.y));

		this.consumable.init(this.parent);

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
			this.parts.splice(this.parts.indexOf(part), 1);
		}
	}
}