import Line from "../tools/Line.js";
import Brush from "../tools/Brush.js";
import Curve from "../tools/Curve.js";
import Circle from "../tools/Circle.js";
import Ellipse from "../tools/Ellipse.js";
import Rectangle from "../tools/Rectangle.js";
import Eraser from "../tools/Eraser.js";
import Camera from "../tools/Camera.js";
import Select from "../tools/Select.js";

export default class {
	_selected = 'line';
	cache = new Map();
	constructor(parent) {
		this.canvas = parent;
		this.cache.set('brush', new Brush(this));
		this.cache.set('camera', new Camera(this));
		this.cache.set('curve', new Curve(this));
		this.cache.set('circle', new Circle(this));
		this.cache.set('ellipse', new Ellipse(this));
		this.cache.set('eraser', new Eraser(this));
		this.cache.set('line', new Line(this));
		this.cache.set('rectangle', new Rectangle(this));
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
		this.canvas.container.style.setProperty('cursor', this._selected === 'camera' ? 'move' : 'default');

		const colours = this.canvas.container.querySelector("section.bottom.left");
		colours !== null && colours.style[(/^(brush|curve|(dynamic_)?circle|rectangle)$/i.test(this._selected) ? 'remove' : 'set') + 'Property']('display', 'none');
	}

	select(toolName) {
		return this.selected = toolName.toLowerCase();
	}

	isSelected(toolName) {
		return toolName.toLowerCase() === this._selected.toLowerCase();
	}
}