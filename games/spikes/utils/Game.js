// text font/spike colour = #808080

import Candy from "./Candy.js";
import Player from "./Player.js";

export default class Game {
    candy = null;
    canvas = document.createElement('canvas');
    lastTime = -1;
    players = [];
    running = false;
    spikes = [];
	constructor(view) {
		this.canvas = view ?? this.canvas;
        this.canvas.addEventListener('click', this.init.bind(this));
		this.ctx = this.canvas.getContext('2d');
        this.createPlayer();
		this.animationFrameId = requestAnimationFrame(this.update.bind(this));
	}

    init() {
        if (this.running) {
            this.players[0].jump();
            return;
        }

        this.running = true;
        this.createCandy();
    }

    createPlayer() {
        this.players.push(new Player(this, this.canvas.width / 2, this.canvas.height / 2));
    }

    createCandy() {
        this.candy = new Candy();
    }

	update(time) {
		this.animationFrameId = requestAnimationFrame(this.update.bind(this));
        try {
            if (this.running) {
                for (const player of this.players) {
                    player.update((time - this.lastTime) / (1000 / 50));
                }
            }

            this.draw();
        } catch(error) {
            cancelAnimationFrame(this.animationFrameId);
            throw error;
        }

        this.lastTime = time;
	}

	draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.fillStyle = "#808080";
        this.ctx.fillRect(0, 0, this.canvas.width, 40);
        this.ctx.fillRect(0, this.canvas.height - 40, this.canvas.width, 40);
        this.ctx.restore();
        for (const player of this.players) {
            player.draw(this.ctx);
        }
	}

	close() {
		cancelAnimationFrame(this.animationFrameId);
	}
}