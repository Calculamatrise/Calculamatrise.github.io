import Helpers from "../utils/Helpers.js";

const ObjectDictionary = await fetch('https://yxkpro.github.io/super-mario-maker/constants/objects.json').then(r => r.status === 404 ? fetch('./constants/objects.json') : r).then(r => r.json());
if ('objects' in window) {
	for (const id in ObjectDictionary) {
		obj.lastElementChild.before(Object.assign(document.createElement('option'), {
			innerText: id.replace('_', ' '),
			style: 'text-transform: capitalize;',
			value: id
		}));
	}
}

export default class {
	element = Object.assign(document.createElement('div'), { style: 'display: flex;' });
	constructor() {
		this.element.objectTypeMenu = this.element.appendChild(obj.cloneNode(true));
		this.element.objectTypeMenu.firstElementChild.removeAttribute('value');
		this.element.objectTypeMenu.removeAttribute('id');
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
		this.element.objectRotation = this.element.appendChild(rotation.cloneNode(true));
		this.element.objectRotation.firstElementChild.removeAttribute('value');
		this.element.objectRotation.removeAttribute('id');
		this.element.objectButton = this.element.appendChild(Helpers.createElement('button', {
			className: 'ripple',
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

	toString() {
		const destructured = ObjectDictionary[this.type].split('#').map(part => part.split(',').map(part => part.split(' ').map(part => parseInt(part, 32)).filter(isFinite)));
		const joined = [];
		destructured[0] && joined.push(...destructured[0]);
		destructured[1] && joined.push(...destructured[1]);
		const flatX = joined.flatMap(lines => lines.filter((_, index) => index % 2 == 0));
		const width = Math.abs(Math.min(...flatX)) + Math.abs(Math.max(...flatX));
		const flatY = joined.flatMap(lines => lines.filter((_, index) => index % 2));
		const height = Math.abs(Math.min(...flatY)) + Math.abs(Math.max(...flatY));
		const rotationFactor = this.rotation * -Math.PI / 180;
		for (const line of Array(...destructured[0], ...destructured[1])) {
			for (let t = 0, e; t < line.length; t += 2) {
				e = line[t];
				line[t] = Math.floor(Math.cos(rotationFactor) * e + Math.sin(rotationFactor) * line[t + 1] + this.x * 25 + (Math.max(90, this.rotation) != 90 && width) + 1e3);
				line[t + 1] = Math.floor(-Math.sin(rotationFactor) * e + Math.cos(rotationFactor) * line[t + 1] + this.y * 25 - (180 % this.rotation == 0 && height));
			}
		}

		return destructured.map(part => part.map(part => part.map(part => part.toString(32)).join(' ')).join(',')).join('#');
	}
}