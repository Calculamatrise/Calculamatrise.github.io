import Mouse from "../../utils/handlers/Mouse.js";
import Snake from "./Snake.js";

export default class {
	canvas = document.createElement('canvas');
	delta = null;
	fps = 60;
	lastFrame = null;
	lastTime = -1;
	mouse = null;
	players = [];
	progress = 0;
	textColor = '#' + (window.Application?.getColorScheme() === 'dark' ? 'FFFFFF' : '000000');
	ups = 20;
	get highScore() {
		const local = JSON.parse(localStorage.getItem("best_score")) ?? 0;
		const session = JSON.parse(sessionStorage.getItem("best_score")) ?? 0;
		return {
			allTime: local,
			today: session
		}
	}

	constructor(canvas) {
		this.canvas = canvas ?? this.canvas;
		this.ctx = this.canvas.getContext("2d");
		this.mouse = new Mouse(this.canvas);
		this.createPlayer();
		this.canvas.addEventListener('click', this.init.bind(this));
		window.addEventListener('resize', function() {
			const style = getComputedStyle(canvas);
			canvas.setAttribute('height', parseFloat(style.getPropertyValue('height')) * window.devicePixelRatio);
			canvas.setAttribute('width', parseFloat(style.getPropertyValue('width')) * window.devicePixelRatio);
		});
		window.dispatchEvent(new Event('resize'));
	}

	init() {
		for (const player of this.players) {
			player.init();
		}

		this.lastFrame = requestAnimationFrame(this.update.bind(this));
	}

	createPlayer(options) {
		this.players.push(new Snake(this, { id: this.players.length + 1, ...options }));
	}

	update(time) {
		this.lastFrame = requestAnimationFrame(this.update.bind(this));
		this.delta = time - this.lastTime;
		if (this.delta <= 1000 / this.ups) {
			return;
		}

		if (this.delta > 1000) {
			this.delta = 1000 / this.ups
		}

		this.progress += this.delta / (1000 / this.ups);
		while(this.progress >= 1) {
			for (const player of this.players) {
				player.fixedUpdate();
			}

			this.progress--
		}

		for (const player of this.players) {
			player.update(this.delta);
		}

		this.draw();
		this.lastTime = time;
	}

	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (const player of this.players) {
			if (!player.dead) {
				player.target.draw(this.ctx);
			}
		}

		let living = 0;
		for (const player of this.players) {
			player.dead || living++;
			let offset = 40 * (player.id - 1) + (player.id !== 1 && 30);
			this.ctx.save();
			this.ctx.fillStyle = (player.dead ? '#ff0000' : this.textColor) + '80';
			this.ctx.textBaseline = 'top';
			this.ctx.fillText(`Player ${player.id}`, 10, 10 + offset);
			this.ctx.fillStyle = this.textColor + '80';
			this.ctx.fillText(`Score - ${player.consumed}`, 10, 25 + offset);
			if (player.id === 1) {
				this.ctx.fillText(`High Score - ${this.highScore.allTime}`, 10, 40 + offset);
				this.ctx.fillText(`High Score (today) - ${this.highScore.today}`, 10, 55 + offset);
			}

			this.ctx.restore();
			player.draw(this.ctx);
		}

		if (living === 0) {
			this.ctx.save();
			this.ctx.fillStyle = '#80808080';
			this.ctx.font = "1rem Arial";
			this.ctx.textAlign = 'center';
			this.ctx.textBaseline = 'middle';
			this.ctx.fillText("Game over. Play again? Hit enter to restart.", this.canvas.width / 2, this.canvas.height / 2);
			this.ctx.restore();
		}
	}

	close() {
		cancelAnimationFrame(this.lastFrame);
		for (const player of this.players) {
			player.close();
		}

		this.lastFrame = null;
		this.mouse.close();
	}
}