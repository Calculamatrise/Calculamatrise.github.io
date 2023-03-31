import Helpers from "../../utils/Helpers.js";
import Camera from "../tools/Camera.js";
import Custom from "../tools/Custom.js";
import Eraser from "../tools/Eraser.js";
import ObjectTool from "../tools/ObjectTool.js";

const ObjectDictionary = await fetch('https://yxkpro.github.io/super-mario-maker/constants/objects.json').then(r => r.status === 404 ? fetch('../constants/objects.json') : r).then(r => r.json());
for (const id in ObjectDictionary) {
	const parts = ObjectDictionary[id].split('#').map(part => part.split(/,+/g).filter(empty => empty).map(line => line.split(/\s+/g).map(coord => parseInt(coord, 32))));
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

	ObjectDictionary[id] = class extends ObjectTool {
		offsetX = width / 2; // - width / 2 % 25;
		offsetY = height / 2; // - height / 2 % 25;
		static physics = parts[0];
		static scenery = parts[1];
	}
}

export default class {
	_selected = 'camera';
	cache = new Map();
	constructor(parent) {
		this.canvas = parent;
		this.cache.set('camera', new Camera(this));
		this.cache.set('custom', new Custom(this));
		this.cache.set('eraser', new Eraser(this));
		for (const id in ObjectDictionary) {
			this.cache.set(id, new ObjectDictionary[id](this));
			if ('objects' in window) {
				objects.prepend(Helpers.createElement('label', {
					children: [
						Helpers.createElement('input', {
							name: 'tool',
							style: {
								display: 'none'
							},
							type: 'radio',
							onchange: event => {
								this.select(event.target.parentElement.textContent.replace(' ', '_'));
							}
						})
					],
					className: 'button option ripple',
					innerText: id.replace('_', ' '),
					style: {
						textTransform: 'capitalize'
					}
				}));
			}
		}
	}

	get selected() {
		return this.cache.get(this._selected);
	}

	set selected(toolName) {
		if (!this.cache.has(toolName)) {
			throw new Error(`Hmm. What's a "${toolName}" tool?`);
		} else if (this.isSelected(toolName)) {
			return;
		}

		this.selected.close();
		this._selected = toolName.toLowerCase();
		this.selected.init();
		this.canvas.view.style.setProperty('cursor', this._selected === 'camera' ? 'move' : 'default');
		this.canvas.draw();
	}

	select(toolName) {
		return this.selected = toolName.toLowerCase();
	}

	isSelected(toolName) {
		return toolName.toLowerCase() === this._selected.toLowerCase();
	}
}