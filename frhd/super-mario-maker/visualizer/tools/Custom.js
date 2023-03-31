import ObjectTool from "./ObjectTool.js";

let code = null;
export default class extends ObjectTool {
	init() {
		code = prompt('Enter your custom object code:') ?? code;
		if (code !== null) {
			const parts = code.split('#').map(part => part.split(/,+/g).filter(empty => empty).map(line => line.split(/\s+/g).map(coord => parseInt(coord, 32))));
			const joined = [];
			parts[0] && joined.push(...parts[0]);
			parts[1] && joined.push(...parts[1]);
			const flatX = joined.flatMap(lines => lines.filter((_, index) => index % 2 == 0));
			const width = Math.abs(Math.min(...flatX)) + Math.abs(Math.max(...flatX));
			const flatY = joined.flatMap(lines => lines.filter((_, index) => index % 2));
			const height = Math.abs(Math.min(...flatY)) + Math.abs(Math.max(...flatY));
			for (const line of parts[0]) {
				for (let i = 0; i < line.length; i += 2) {
					line[i] -= width / 2 + width / 2 % 25;
					line[i + 1] += height / 2 - height / 2 % 25;
				}
			}
		
			for (const line of parts[1]) {
				for (let i = 0; i < line.length; i += 2) {
					line[i] -= width / 2 - width / 2 % 25;
					line[i + 1] += height / 2 - height / 2 % 25;
				}
			}

			this.offsetX = width / 2;
			this.offsetY = height / 2;
			parts[0] && (this.constructor.physics = parts[0]);
			parts[1] && (this.constructor.scenery = parts[1]);
		}
	}

	static physics = [];
	static scenery = [];
}