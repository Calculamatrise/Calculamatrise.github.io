import objectDictionary from "../constants/marioObjectDictionary.js";
import Helpers from "../utils/Helpers.js";

export default class {
	get rotation() {
		return Number(this.element.objectRotation.value);
	}

	set rotation(value) {
		this.element.objectRotation.value = String(value);
	}

	get type() {
		return this.element.objectTypeMenu.value;
	}

	set type(value) {
		this.element.objectTypeMenu.value = value;
	}

	get x() {
		return ~~this.element.objectXInput.valueAsNumber;
	}

	set x(value) {
		this.element.objectXInput.valueAsNumber = value;
	}

	get y() {
		return ~~this.element.objectYInput.valueAsNumber;
	}

	set y(value) {
		this.element.objectYInput.valueAsNumber = value;
	}

	element = Helpers.createElement('div', {
		style: {
			display: 'flex'
		}
	});
	constructor() {
		this.element.objectTypeMenu = this.element.appendChild(Helpers.createElement('select', {
			children: [
				Helpers.createElement('option', {
					disabled: true,
					innerText: 'Select an object'
				}),
				Helpers.createElement('option', {
					innerText: 'Block',
					value: 'block'
				}),
				Helpers.createElement('option', {
					innerText: 'Bullet',
					value: 'bullet'
				}),
				Helpers.createElement('option', {
					innerText: 'Mystery Block',
					value: 'mblock'
				})
			],
			style: {
				borderRadius: 0
			}
		}));
		this.element.objectXInput = this.element.appendChild(Helpers.createElement('input', {
			placeholder: 'x',
			style: {
				borderRadius: 0
			},
			type: 'number'
		}));
		this.element.objectYInput = this.element.appendChild(Helpers.createElement('input', {
			placeholder: 'y',
			style: {
				borderRadius: 0
			},
			type: 'number'
		}));
		this.element.objectRotation = this.element.appendChild(Helpers.createElement('select', {
			children: [
				Helpers.createElement('option', {
					disabled: true,
					innerText: 'Rotation'
				}),
				Helpers.createElement('option', {
					innerText: '0',
					value: '0'
				}),
				Helpers.createElement('option', {
					innerText: '90',
					value: '90'
				}),
				Helpers.createElement('option', {
					innerText: '180',
					value: '180'
				}),
				Helpers.createElement('option', {
					innerText: '270',
					value: '270'
				})
			],
			style: {
				borderRadius: 0
			}
		}));
		this.element.objectButton = this.element.appendChild(Helpers.createElement('button', {
			innerText: 'Remove',
			style: {
				borderLeft: '1px solid var(--border-color)',
				borderRadius: 0,
				height: 'auto',
				width: '-webkit-fill-available'
			}
		}));
		Reflect.preventExtensions(this);
		Object.assign(this, arguments[0]);
	}

	toString() {
		const sample = objectDictionary[this.type];
		const destructured = sample.code.split('#').map(part => part.split(',').map(part => part.split(' ').map(part => parseInt(part, 32)).filter(isFinite)));
		const rotationFactor = this.rotation * -Math.PI / 180;
		for (const line of Array(...destructured[0], ...destructured[1])) {
			for (let t = 0, e; t < line.length; t += 2) {
				e = line[t];
				line[t] = Math.floor(Math.cos(rotationFactor) * e + Math.sin(rotationFactor) * line[t + 1] + this.x * 25 + (Math.max(90, this.rotation) != 90 && sample.width) + 1e3);
				line[t + 1] = Math.floor(-Math.sin(rotationFactor) * e + Math.cos(rotationFactor) * line[t + 1] + this.y * 25 - (180 % this.rotation == 0 && sample.height));
			}
		}

		return destructured.map(part => part.map(part => part.map(part => part.toString(32)).join(' ')).join(',')).join('#');
	}
}