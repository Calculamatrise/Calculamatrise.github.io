import ObjectTool from "./ObjectTool.js";

let code = null;
export default class extends ObjectTool {
	init() {
		code = prompt('Enter your custom object code:') ?? code;
		if (code !== null) {
			const parts = code.split('#').map(part => part.split(/,+/g).filter(empty => empty).map(line => line.split(/\s+/g).map(coord => parseInt(coord, 32))));
			this.constructor.physics = parts[0];
			this.constructor.scenery = parts[1];
			const flatX = this.constructor.physics.flatMap(lines => lines.filter((_, index) => index % 2 == 0));
			const width = (Math.abs(Math.min(...flatX)) + Math.abs(Math.max(...flatX)));
			const flatY = this.constructor.physics.flatMap(lines => lines.filter((_, index) => index % 2));
			const height = (Math.abs(Math.min(...flatY)) + Math.abs(Math.max(...flatY)))
			this.offsetX = width / 2;
			this.offsetY = height / 2;
		}
	}

	static physics = [];
	static scenery = [];
}