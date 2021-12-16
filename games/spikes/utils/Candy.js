export default class Candy {
	constructor(parent) {
        this.parent = parent;
    }

    relocate() {
        this.x = Math.random() * 2 === 0 ? 40 : this.parent.canvas.width - 40;
    }
}