import Layer from "./Layer.js";

export default class {
	cache = [];
	create() {
		this.cache.forEach(function (layer) {
			layer.element.classList.remove("selected");
		});

		return new Layer(this);
	}

	get(layerId) {
		return this.cache.find(function (layer) {
			if (layer.id === parseInt(layerId)) {
				return true;
			}

			return false;
		});
	}

	has(layerId) {
		return !!this.get(layerId);
	}

	insert(layer, index) {
		window.canvas.layerDepth = index + 1;
		this.cache.splice(index, 0, layer);
		this.cache.forEach((layer, index) => {
			layer.element.querySelector("#selector").value = layer.base.dataset.id = layer.id = index + 1;
			if (layer.id > 1) {
				view.querySelector(`g[data-id='${index}']`).after(layer.base);
			}

			layer.element.classList.remove("selected");
			if (layer.id === window.canvas.layerDepth) {
				layer.element.classList.add("selected");
			}
		});

		return this;
	}

	remove(layerId) {
		const layer = this.cache.splice(this.cache.indexOf(this.get(layerId)), 1);
		this.cache.forEach(function (layer, index) {
			layer.element.querySelector("#selector").value = layer.base.dataset.id = layer.id = index + 1;
			layer.element.classList.remove("selected");
			if (layer.id === window.canvas.layerDepth) {
				layer.element.classList.add("selected");
			}
		});

		return layer;
	}

	createElement(type, options = {}) {
		const callback = arguments[arguments.length - 1];
		const element = document.createElement(type);
		if ('innerText' in options) {
			element.innerText = options.innerText;
			delete options.innerText;
		}

		for (const attribute in options) {
			if (typeof options[attribute] == 'object') {
				if (options[attribute] instanceof Array) {
					if (/^children$/i.test(attribute)) {
						element.append(...options[attribute]);
					} else if (/^on/i.test(attribute)) {
						for (const listener of options[attribute]) {
							element.addEventListener(attribute.slice(2), listener);
						}
					}
				} else if (/^style$/i.test(attribute)) {
					Object.assign(element[attribute.toLowerCase()], options[attribute]);
				}

				delete options[attribute];
			}
		}

		Object.assign(element, options);
		return typeof callback == 'function' && callback(element), element;
	}

	close() {
		this.cache.forEach(function (layer) {
			layer.remove();
		});
		this.cache = []
	}
}