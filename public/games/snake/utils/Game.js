import Button from "./Button.js";
import Snake from "./Snake.js";

export default class {
	constructor() {
		this.canvas = document.querySelector("#view");
		this.canvas.addEventListener("click", this.click.bind(this));
		this.canvas.addEventListener("mousemove", this.hover.bind(this));
		
		window.addEventListener("resize", this.adjust.bind(this.canvas));
		this.adjust.bind(this.canvas)();
		
		this.players = [
			new Snake(this, {
				id: 1
			})
		];

		this.buttons = [
			new Button({
				name: "Settings",
				position: {
					x: this.canvas.width - 45,
					y: 15
				},
				click() {
					const overlay = document.querySelector("div#overlay");
					if (overlay.style.display === "block") {
						overlay.style.display = "none";
						
						return;
					}

					overlay.style.display = "block";
				}
			})
		];
		
		this.fps = 20;
		this.delta = null;
		this.lastTime = -1;
		this.lastFrame = null;
	}
	mouse = {
		x: 0,
		y: 0
	}
	get best() {
		return JSON.parse(localStorage.getItem("best_score")) | 0;
	}
	get bestToday() {
		return JSON.parse(sessionStorage.getItem("best_score")) | 0;
	}
	adjust() {
		const height = getComputedStyle(this).getPropertyValue('height').slice(0, -2);
		const width = getComputedStyle(this).getPropertyValue('width').slice(0, -2);
		this.setAttribute("height", height * window.devicePixelRatio);
		this.setAttribute("width", width * window.devicePixelRatio);
	}
	init() {
		for (const player of this.players)
			player.init(this);
		
		this.lastFrame = requestAnimationFrame(this.update.bind(this));
	}
	click(event) {
		this.mouse = {
			x: event.offsetX,
			y: event.offsetY
		}

		for (const button of this.buttons)
			button.click();

		this.lastFrame ?? this.init();
	}
	hover(event) {
		this.mouse = {
			x: event.offsetX,
			y: event.offsetY
		}

		for (const button of this.buttons)
			button.hover(this.mouse);
	}
	update(time) {
		this.lastFrame = requestAnimationFrame(this.update.bind(this));
		this.delta = (time - this.lastTime) / 1000;
		
		for (const player of this.players) {
			if (player.dead) {
				this.lastFrame = null;
				this.close();
				
				return;
			}

			if (this.delta * 1000 <= 1000 / this.fps)
				continue;

			this.lastTime = time;

			player.update(this.delta);
		}
		
		this.draw();
	}
	draw() {
		const ctx = this.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (const button of this.buttons)
			button.draw(ctx);
		
		for (const player of this.players) {
			if (player.dead) {
				const text = `Player ${player.id} died. Click to restart.`;
				ctx.save();
				ctx.font = "20px Arial";
				ctx.fillStyle = "red";
				ctx.fillText(text, this.canvas.width / 2 - text.length * 4, this.canvas.height / 2);
				ctx.restore();
				
				return;
			}

			ctx.save();
			ctx.fillStyle = JSON.parse(localStorage.getItem("dark")) ? "#FFFFFFA5" : "#000000A5";
			ctx.fillText(`Score - ${player.consumed}`, 10, 15 * player.id);
			ctx.fillText(`High Score - ${this.best}`, 10, 30 * player.id);
			ctx.fillText(`High Score (today) - ${this.bestToday}`, 10, 45 * player.id);
			ctx.restore();

			ctx.save();
			ctx.scale(10, 10);
			player.draw(ctx);
			ctx.restore();
		}
	}
	restart() {
		return;
	}
	close() {
		cancelAnimationFrame(this.lastFrame);
	}
}