export default class GameObject {
	url = "https://i.imgur.com/d0E4OMs.png"
    constructor(x, y, r, game) {
        this.x = x;
        this.y = y;
		this.hitboxRadius = r;
		this.game = game;
		this.game.loadImage(this);
    }
    render(ctx) {
		ctx.beginPath();
        ctx.drawImage(this.img, this.x-this.hitboxRadius, this.y-this.hitboxRadius, this.hitboxRadius * 2, this.hitboxRadius * 2);
    }
    move(x = 0, y = 0) {
        this.x += x;
        this.y += y;
    }
    // utility methods
}
