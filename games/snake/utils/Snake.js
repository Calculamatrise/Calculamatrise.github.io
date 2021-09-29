import Gamepad from "./Gamepad.js";
import Part from "./Part.js";
import Consumable from "./Consumable.js";
import Vector from "./Vector.js";

export default class {
	constructor(parent, { id }) {
		this.parent = parent;
		
		this.id = id;
		this.dead = false;
		this.consumed = 0;
		
		this.consumable = new Consumable();

		this.gamepad = new Gamepad();
		this.gamepad.on("keydown", this.control.bind(this));
	}
	get length() {
		return this.parts.length;
	}
	get velocity() {
		return new Vector(this.orientation === 2 ? 1 : this.orientation === 4 ? -1 : 0, this.orientation === 1 ? -1 : this.orientation === 3 ? 1 : 0);
	}
	init(parent) {
		this.dead = false;
		this.consumed = 0;
		this.orientation = Math.ceil(Math.random() * 4);
		
		this.parts = Array.from({ length: 5 }, function() {
			return new Part(Math.round(parent.canvas.width / 2 / 10), Math.round(parent.canvas.height / 2 / 10));
		});
		
		for (const part in this.parts) {
			if (part == 0)
				continue;
			
			const position = this.parts[part].position;
			
			switch(this.orientation) {
				case 1:
					position.y += this.parts[part - 1].size * part;
				break;
					
				case 2:
					position.x -= this.parts[part - 1].size * part;
				break;
					
				case 3:
					position.y -= this.parts[part - 1].size * part;
				break;
					
				case 4:
					position.x += this.parts[part - 1].size * part;
				break;
			}
			
			this.parts[part].position.copy(position);
		}
		
		this.head = this.parts[0];
		
		this.consumable.init(parent);
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

		//this.head.position.lerpTowards(this.head.position.add(this.velocity), Math.cos(Math.PI * 0.5 * 1), delta);
		this.head.position.addToSelf(this.velocity);
		if (this.head.position.x < 0 || this.head.position.x >= this.parent.canvas.width / 10
		|| this.head.position.y < 0 || this.head.position.y >= this.parent.canvas.height / 10) {
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
			this.parts[part].position.copy(this.parts[part - 1].old);
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
		this.consumable.draw(ctx);

		for (const part in this.parts)		
			this.parts[part].draw(ctx);
	}
}