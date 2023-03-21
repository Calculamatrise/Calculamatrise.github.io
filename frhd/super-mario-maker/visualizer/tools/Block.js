import ObjectDictionary from "../../constants/marioObjectDictionary.js";
import ObjectTool from "./ObjectTool.js";

const object = ObjectDictionary['block'];
const parts = object.code.split('#').map(part => part.split(/,+/g).filter(empty => empty).map(line => line.split(/\s+/g).map(coord => parseInt(coord, 32))));
// for (const line of parts[0]) {
// 	for (let i = 0; i < line.length; i += 2) {
// 		line[i] -= object.width / 2;
// 		line[i + 1] += object.height / 2;
// 	}
// }

// for (const line of parts[1]) {
// 	for (let i = 0; i < line.length; i += 2) {
// 		line[i] -= object.width / 2;
// 		line[i + 1] += object.height / 2;
// 	}
// }

export default class extends ObjectTool {
	offsetX = object.width / 2;
	offsetY = object.height / 2;
	static physics = parts[0];
	static scenery = parts[1];
}