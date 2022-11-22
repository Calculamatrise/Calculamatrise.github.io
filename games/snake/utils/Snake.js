import Gamepad from "../../utils/Gamepad.js";
import Part from "./Part.js";
import Consumable from "./Consumable.js";
import Vector from "../../utils/Vector.js";
import controlsets from "../constants/controlsets.js";

export default class {
	color = window.Application?.getColorScheme() === 'dark' ? 'white' : 'black';
	consumed = 0;
	dead = false;
	gamepad = new Gamepad();
	parts = [];
	id = null;
	target = null;
	get length() {
		return this.parts.length;
	}

	get velocity() {
		return new Vector(this.orientation === 2 ? 1 : this.orientation === 4 ? -1 : 0, this.orientation === 1 ? -1 : this.orientation === 3 ? 1 : 0);
	}

	constructor(parent, { color, id }) {
		this.parent = parent;
		this.id = id ?? this.id;
		this.target = new Consumable();
		this.gamepad.on('release', key => {
			if (key === 'Enter') {
				if (this.id === 1) {
					if (this.gamepad.downKeys.has('Shift')) {
						this.parent.createPlayer({
							color: 'skyblue'
						});
						return this.parent.init();
					}
				}

				this.init();
			} else if (key === 'Backspace' && this.gamepad.downKeys.has('Shift')) {
				this.parent.players.length > 1 && this.parent.players.pop();
				return this.parent.init();
			}
		});
	}

	init() {
		this.dead = false;
		this.consumed = 0;
		this.orientation = Math.ceil(Math.random() * 4);
		this.parts = Array.from({ length: 5 }, () => new Part(Math.round(this.parent.canvas.width / 2), Math.round(this.parent.canvas.height / 2)));
		for (const part in this.parts) {
			if (part == 0) continue;
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
		this.target.init(this.parent);
	}

	control(key) {
		const controls = controlsets[(1 + this.id) % 2];
		for (const condition in controls) {
			if (key === condition && Math.abs(this.orientation - controls[condition]) !== 2) {
				this.orientation = controls[condition];
			}
		}
	}

	consume(consumable) {
		const lastPart = this.parts.at(-1).position;
		this.parts.push(new Part(lastPart.x, lastPart.y));
		consumable.init(this.parent);
		return ++this.consumed;
	}

	kill() {
		this.dead = true;
		if (this.id > 1) return;
		if (this.consumed > this.parent.highScore.allTime) {
			localStorage.setItem("best_score", JSON.stringify(this.consumed));
		}

		if (this.consumed > this.parent.highScore.today) {
			sessionStorage.setItem("best_score", JSON.stringify(this.consumed));
		}
	}

	// between updates over various frames
	// objects lerp constantly ever so slightly
	fixedUpdate() {
		if (this.dead) return;
		let orientation = this.orientation;
		for (const key of this.gamepad.downKeys) {
			this.orientation = orientation;
			this.control(key);
		}

		// this.head.position.target = this.head.position.target ?? this.head.position.add(this.velocity.scale(10));
		// this.head.position.copy(this.head.position.target);
		// this.head.old.copy(this.head.position);
		// this.head.position.target.copy(this.head.position.add(this.velocity.scale(10)));
		if (this.head.position.x < 0 || this.head.position.x >= this.parent.canvas.width
		|| this.head.position.y < 0 || this.head.position.y >= this.parent.canvas.height) {
			this.kill();
			return;
		}
	}

	update(delta) {
		if (this.dead) return;
		this.head.old.copy(this.head.position);
		if (this.head.position.equals(this.target.position)) {
			this.consume(this.target);
		}

		for (const part in this.parts) {
			if (part == 0) continue;
			if (this.head.position.equals(this.parts[part].position)) {
				this.kill();
				return;
			}

			// this.parts[part].old.copy(this.parts[part].position);
			// this.parts[part].position.copy(this.parts[part - 1].old);
		}

		this.head.position.addToSelf(this.velocity.scale(10));
		// this.head.position = this.head.position.lerp(this.head.position.target ?? this.head.position.add(this.velocity.scale(10)), delta / (1000 / this.parent.ups));
		for (const part in this.parts) {
			if (part == 0) continue;
			this.parts[part].old.copy(this.parts[part].position);
			this.parts[part].position.copy(this.parts[part - 1].old);
		}
	}

	draw(ctx) {
		if (this.dead) {
			ctx.save();
			ctx.fillStyle = 'red';
			ctx.font = "12px Arial";
			ctx.textAlign = 'right';
			ctx.textBaseline = 'top';
			ctx.fillText(`Player ${this.id} died`, this.parent.canvas.width - 4, 4);
			ctx.restore();
			return;
		}

		// this.target.draw(ctx);
		for (const part of this.parts) {
			part.draw(ctx);
		}
	}

	close() {
		this.gamepad.close();
	}
}