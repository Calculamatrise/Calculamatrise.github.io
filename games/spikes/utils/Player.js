import Vector from "./Vector.js";

export default class Player {
	constructor(parent, x, y) {
		this.parent = parent;
        this.position = new Vector([
            parseFloat(x) - parseFloat(x) % 10,
            parseFloat(y) - parseFloat(y) % 10
        ]);
	}
	
    size = 15;
    speed = 2;
    direction = 1;
    velocity = new Vector(5);
    gravity = new Vector(0, .3);
    position = null;
    jumpHeight = null;

    jump() {
        this.jumpHeight = this.position.y - this.size * 2;
        // this.velocity.sub(new Vector(0, 15));
        this.velocity.y = -10;
    }

	update(delta) {
		if (this.position.y <= this.jumpHeight) {
            this.jumpHeight = null;
        }

        if (this.position.x >= this.parent.canvas.width - this.size) {
            this.direction = -1;
            this.velocity.x *= -1;
        } else if (this.position.x <= this.size) {
            this.direction = 1;
            this.velocity.x *= -1;
        }

        this.velocity.add(this.gravity).scale(.99);
        this.position.add(this.velocity);
        
        this.velocity = this.position.clone().sub(this.position.old);

        this.position.add(new Vector(this.speed).scale(this.direction));

        // this.position.lerpTowards({
        //     x: this.position.x + 4 * this.direction,
        //     y: this.jumpHeight || this.position.y + 3
        // }, .4, delta);
	}
	
	draw(ctx) {
        ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
	}
}