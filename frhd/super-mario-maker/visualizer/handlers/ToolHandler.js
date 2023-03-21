import Block from "../tools/Block.js";
import Bullet from "../tools/Bullet.js";
import Camera from "../tools/Camera.js";
import Custom from "../tools/Custom.js";
import Eraser from "../tools/Eraser.js";
import MysteryBlock from "../tools/MysteryBlock.js";
import Select from "../tools/Select.js";

export default class {
	_selected = 'camera';
	cache = new Map();
	constructor(parent) {
		this.canvas = parent;
		this.cache.set('block', new Block(this));
		this.cache.set('bullet', new Bullet(this));
		this.cache.set('camera', new Camera(this));
		this.cache.set('custom', new Custom(this));
		this.cache.set('eraser', new Eraser(this));
		this.cache.set('mblock', new MysteryBlock(this));
		this.cache.set('select', new Select(this));
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