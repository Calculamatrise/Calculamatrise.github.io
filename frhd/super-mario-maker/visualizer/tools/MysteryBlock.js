import ObjectTool from "./ObjectTool.js";

const ObjectDictionary = await fetch('../constants/objects.json').then(r => r.json());
const object = ObjectDictionary['mblock'];
const parts = object.split('#').map(part => part.split(/,+/g).filter(empty => empty).map(line => line.split(/\s+/g).map(coord => parseInt(coord, 32))));
const joined = [];
parts[0] && joined.push(...parts[0]);
parts[1] && joined.push(...parts[1]);
const flatX = joined.flatMap(lines => lines.filter((_, index) => index % 2 == 0));
const width = Math.abs(Math.min(...flatX)) + Math.abs(Math.max(...flatX));
const flatY = joined.flatMap(lines => lines.filter((_, index) => index % 2));
const height = Math.abs(Math.min(...flatY)) + Math.abs(Math.max(...flatY));
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
	offsetX = width / 2;
	offsetY = height / 2;
	static physics = parts[0];
	static scenery = parts[1];
}