import EventEmitter from "../../utils/EventEmitter.js";

export default class extends EventEmitter {
	downKeys = new Set();
	constructor(element = window) {
		super();
		const hold = this.hold.bind(this);
		const press = this.press.bind(this);
		const release = this.release.bind(this);
		element.addEventListener('keydown', hold);
		element.addEventListener('keypress', press);
		element.addEventListener('keyup', release);
		this.close = function() {
            element.removeEventListener('keydown', hold);
            element.removeEventListener('keypress', press);
            element.removeEventListener('keyup', release);
        }
	}

	hold(event) {
		event.preventDefault();
		this.downKeys.add(event.key);
		this.emit("hold", event.key);
	}

	press(event) {
		event.preventDefault();
		this.emit("press", event.key);
	}

	release(event) {
		event.preventDefault();
		this.downKeys.delete(event.key);
		this.emit("release", event.key);
	}
}