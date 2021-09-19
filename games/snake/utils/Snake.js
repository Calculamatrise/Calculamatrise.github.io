import Gamepad from "./Gamepad.js";
import Part from "./Part.js";
import Consumable from "./Consumable.js";

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
	init(parent) {
		this.dead = false;
		this.consumed = 0;
		this.orientation = Math.ceil(Math.random() * 4);
		
		this.parts = Array.from({ length: 5 }, function() {
			let x = Math.round(parent.canvas.width / 2);
			while(x % 10 !== 0)
				x++;

			let y = Math.round(parent.canvas.height / 2);		
			while(y % 10 !== 0)
				y++;
			
			return new Part(x, y);
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
			
			this.parts[part].position = position;
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
	lerp(source, target, alpha) {
		return (1 - alpha) * source + alpha * target;
	}
	lerpTowards(source, target, smoothing, delta) {
		return this.lerp(source, target, 1 - Math.pow(smoothing, delta));
	}
	move(delta) {
		const x = this.orientation === 2 ? 10 : this.orientation === 4 ? -10 : 0;
		const y = this.orientation === 1 ? -10 : this.orientation === 3 ? 10 : 0;
		
		this.head.old = {
			x: this.head.position.x,
			y: this.head.position.y
		}
		
		if (this.head.position.x === this.consumable.position.x && this.head.position.y === this.consumable.position.y) {
			this.consume(this.consumable);
		}

		// this.head.position.x = this.lerpTowards(this.head.position.x, this.head.position.x + x, Math.cos(0.5 * Math.PI * 0.5), delta) | 0;
		this.head.position.x += x;
		if (this.head.position.x < 0 || this.head.position.x >= this.parent.canvas.width) {
			this.kill();

			return;
		}
		
		// this.head.position.y = this.lerpTowards(this.head.position.y, this.head.position.y + y, Math.cos(0.5 * Math.PI * 0.5), delta) | 0;
		this.head.position.y += y;
		if (this.head.position.y < 0 || this.head.position.y >= this.parent.canvas.height) {
			this.kill();
			
			return;
		}
		
		for (const part in this.parts) {
			if (part == 0)
				continue;
			
			// if (this.head.position.x === this.parts[part].position.x && this.head.position.y === this.parts[part].position.y) {
			// 	this.kill();
				
			// 	return;
			// }
			
			this.parts[part].old = {
				x: this.parts[part].position.x,
				y: this.parts[part].position.y
			}
			this.parts[part].position = this.parts[part - 1].old;
		}
	}
	update(delta) {

	}
	control(key) {
		switch(key) {
			case "ArrowUp":
				if (this.orientation === 3)
					return;
				
				this.orientation = 1;
			break;
				
			case "ArrowRight":
				if (this.orientation === 4)
					return;
				
				this.orientation = 2;
			break;
			
			case "ArrowDown":
				if (this.orientation === 1)
					return;
				
				this.orientation = 3;
			break;
				
			case "ArrowLeft":
				if (this.orientation === 2)
					return;
				
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