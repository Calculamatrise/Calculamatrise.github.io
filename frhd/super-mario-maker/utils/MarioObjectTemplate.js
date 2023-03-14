export default class MarioObjectTemplate extends HTMLDivElement {
	objectButton = this.querySelector('button');
	objectTypeMenu = this.querySelector('select');
	objectXInput = this.querySelector('input[placeholder=x]');
	objectYInput = this.querySelector('input[placeholder=y]');
	get x() {
		return ~~this.xInput.valueAsNumber;
	}

	set x(value) {
		this.inputX.valueAsNumber = value;
	}

	get y() {
		return ~~this.yInput.valueAsNumber;
	}

	set y(value) {
		this.yInput.valueAsNumber = value;
	}

	get type() {
		return this.select.value;
	}

	set type(value) {
		this.select.value = value;
	}
	
	cloneNode() {
		const clone = super.cloneNode(...arguments);
		clone.removeAttribute('id');
		for (const child of clone.children) {
			child.removeAttribute('id');
		}

		return clone;
	}
}

customElements.define('mario-object-template', MarioObjectTemplate, { extends: 'div' });