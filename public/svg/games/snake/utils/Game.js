import SVGRenderingContext2D from "./SVGRenderingContext2D.js";

import Button from "./Button.js";
import Snake from "./Snake.js";

export default class {
	constructor() {
		this.canvas = document.querySelector("#view");
		this.canvas.addEventListener("click", this.click.bind(this));
		this.canvas.addEventListener("mousemove", this.hover.bind(this));
		this.canvas.getContext = function(dimension) {
			return new SVGRenderingContext2D(this);
		}

		this.ctx = this.canvas.getContext("2d");
		
		window.addEventListener("resize", this.adjust.bind(this.canvas));
		this.adjust.bind(this.canvas)();
		
		this.players = [
			new Snake(this, {
				id: 1
			})
		];

		this.buttons = [
			new Button(this, {
				name: "Settings",
				position: {
					x: this.canvas.width.baseVal.value - 65,
					y: 20
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
		]

		this.draw();
	}
	fps = 20;
	delta = null;
	lastTime = -1;
	lastFrame = null;
	lastMessage = null;
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
	get dark() {
		return JSON.parse(localStorage.getItem("dark")) ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
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

		if (this.lastMessage) {
			this.lastMessage.remove();
			this.lastMessage = null;
		}

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
		this.delta = (time - this.lastTime) / 1000;

		for (const player of this.players) {
			if (player.dead) {
				this.lastFrame = null;

				const text = `Player ${player.id} died. Click to restart.`;
				this.ctx.font = "20px Arial";
				this.ctx.fillStyle = "red";
				this.lastMessage = this.ctx.fillText(text, this.canvas.width.baseVal.value / 2 - text.length * 4, this.canvas.height.baseVal.value / 2);

				this.close();
				
				return;
			}

			if (this.delta * 1000 <= 1000 / this.fps)
				continue;

			this.lastTime = time;

			player.update(this.delta);
		}

		this.lastFrame = requestAnimationFrame(this.update.bind(this));
	}
	draw() {
		for (const button of this.buttons)
			button.draw(this.ctx);
		
		for (const player of this.players) {
			this.ctx.fillStyle = this.dark ? "#FFFFFFA5" : "#000000A5";
			this.ctx.fillText(`Score - ${player.consumed}`, 10, 20 * player.id);
			this.ctx.fillText(`High Score - ${this.best}`, 10, 40 * player.id);
			this.ctx.fillText(`High Score (today) - ${this.bestToday}`, 10, 60 * player.id);

			player.draw(this.ctx);
		}
	}
	restart() {
		return;
	}
	close() {
		cancelAnimationFrame(this.lastFrame);
		for (const player of this.players) {
			player.close();
		}

		this.lastFrame = null;
	}
}