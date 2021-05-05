import GameObject from './Object.js';
import Player from './Player.js';

const { floor, random } = Math;
export const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c)
        .getPropertyValue('height')
        .slice(0, -2);
    const width = +getComputedStyle(c)
        .getPropertyValue('width')
        .slice(0, -2);
    c.setAttribute('height', height * dpi);
	c.setAttribute('width', width * dpi);
};

export class Game {
    constructor(canvas) {
		fixDpi(canvas);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
		this.ctx.fillStyle = "#fff";
		this.ImageCache = new Map();
		this.objects = [new GameObject(random() * canvas.width | 0, random() * canvas.height | 0, 20, this)];
		for(var i = 0; i < floor(random() * 10 | 4); i++) {
			this.objects.push(new GameObject(random() * canvas.width | 0, random() * canvas.height | 0, 20, this))
		}
        this.player = new Player(canvas.width / 2, canvas.height / 2, 10, this);
		this.direction = 1;
		this.distance = {
			x: 0,
			y: 0
		};
		this.index = 0;
		this.order = [0b1, 0b10, 0b101, 0b1010];
		this.animationFrame = null;
	}
	loadImage(obj) {
		let url = obj.url
		//debugger
		if (this.ImageCache.has(url))
			return obj.img = this.ImageCache.get(url);
		try {
			let img = new Image();
			img.src = url;
			this.ImageCache.set(url, img)
			obj.img = img;
		} catch(e) {}
	}
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		// this.player.move(this.direction);
		switch(this.direction) {
			case 1:
				this.distance.x++
				break;
			case 2:
				this.distance.y++
				break;
			case 5:
				this.distance.x--
				break;
			case 10:
				this.distance.y--
				break;
		}
		if(this.distance.x % 200 == 0) {
			for(var i = 0; i < floor(random() * 10 | 4); i++) {
				this.objects.push(new GameObject(random() * this.distance.x + canvas.width | canvas.width, random() * this.distance.y + canvas.height | canvas.height, 20, this))
			}
		}
		for (const obj of this.objects) {
			switch(this.direction) {
				case 1:
					obj.move(-1);
					break;
				case 2:
					obj.move(0, -1);
					break;
				case 5:
					obj.move(1);
					break;
				case 10:
					obj.move(0, 1);
					break;
			}
			/*
				Physics stuff
				- Needs a little bit of work cause the slowdown is weird
				- We can also optimize this quite a bit by keeping an array
					of objects near the player and updating that every 500ms or something
					and we can render all the objects then cache that rendering so we dont
					need to keep drawing them all 1 by 1. This would allow us to not loop
					over every object every frame
			*/
			let xDif = obj.x - this.player.x,
				yDif = obj.y - this.player.y,
				dist = Math.hypot(xDif, yDif) - (obj.hitboxRadius + this.player.hitboxRadius);
			if(dist <= 1) {
				let dir = Math.atan2(xDif, yDif);
				dist /= -2;
				/*
					Quadrants 1 and 3 (relative to the object) need to be inverted
					so this checks if they are the same sign
				*/
				let shouldInvert = xDif * yDif >= 0 ? 1 : -1;
				this.player.collide(dist * Math.cos(dir) * shouldInvert, dist * Math.sin(dir) * shouldInvert);
			}
			obj.render(this.ctx);
		}

		/*
			This looks awful LMAO, but not as bad as  ?:?:null or &&()||(&&())
		*/
		let p = this.player;
		if (p.x - p.hitboxRadius < 0)
			p.x = p.hitboxRadius;
		else if (p + p.hitboxRadius > this.canvas.width)
			p.x = this.canvas.width - p.hitboxRadius;

		if (p.y - p.hitboxRadius < 0)
			p.y = p.hitboxRadius;
		else if (p.y + p.hitboxRadius > this.canvas.width)
			p.y = this.canvas.width - p.hitboxRadius;

		this.player.render(this.ctx);
		requestAnimationFrame(this.render.bind(this))
	}
    run() {
		this.animationFrame = requestAnimationFrame(this.render.bind(this));
	}
	close() {
		cancelAnimationFrame(this.animationFrame);
	}
	get onkeypress() {
		return e => {
			switch(e.key) {
				case " ":
					this.direction = this.order[this.index = ++this.index % 4]
			}
		}
	}
	get onstart() {
		this.ctx.fillStyle = "#000";
		this.ctx.font = "15pt Arial";
		this.ctx.fillText("Press space to start.", this.canvas.width / 2, this.canvas.height / 2);
		return e => {
			switch(e.key) {
				case " ":
					requestAnimationFrame(this.render.bind(this));
					document.onkeypress = this.onkeypress;
			}
		}
	}
}
