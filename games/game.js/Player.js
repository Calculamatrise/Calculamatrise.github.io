import Object from "./Object.js";

export default class Player extends Object {
	// url = "https://i.imgur.com/XCHuLZo.png";
	enum = {
		xMov: 0b1,
		yMov: 0b10,
		xNeg: 0b100,
		yNeg: 0b1000
	}
    move(dir) {
		if (dir & this.enum.xMov) {
			this.x += (1+(-2*!!(dir&this.enum.xNeg)))
		}
		if (dir & this.enum.yMov) {
			this.y += (1+(-2*!!(dir&this.enum.yNeg)))
		}
	}
	collide(x, y) {
		this.x -= x;
		this.y -= y;
	}
    // utility methods
}
