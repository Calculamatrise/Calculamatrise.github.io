export default class {
	constructor() {
		this.downKeys = [];
		
		window.addEventListener("keydown", this.keydown.bind(this));
		window.addEventListener("keyup", this.keyup.bind(this));
	}
	#events = new Map();
	#emit(event, ...args) {
		if (this.#events.has(event))
			return !!this.#events.get(event)(...args);
		
		return null;
	}
	on(event, func = function() {}) {
		return !!this.#events.set(event, func);
	}
	keydown(event) {
		event.preventDefault();
		this.#emit("keydown", event.key);
		
		return !!this.downKeys.push(event.key);
	}
	keyup(event) {
		event.preventDefault();
		this.#emit("keyup", event.key);
		
		return !!this.downKeys.splice(event.key, 1);
	}
}