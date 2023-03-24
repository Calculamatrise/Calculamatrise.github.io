import EventEmitter from "../../../utils/EventEmitter.js";
import MouseHandler from "../handlers/MouseHandler.js";
import ToolHandler from "../handlers/ToolHandler.js";
import HistoryManager from "../managers/HistoryManager.js";
import LayerManager from "../managers/LayerManager.js";

export default class extends EventEmitter {
	camera = {x: 0, y: 0};
	events = new HistoryManager();
	fill = false;
	layers = new LayerManager(this);
	mouse = new MouseHandler();
	physicsStyle = '#FFFFFF';
	sceneryStyle = '#999999';
	settings = new Proxy(Object.assign({
		theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	}, JSON.parse(localStorage.getItem('frhd-drawpad-settings'))), {
		get(target, key) {
			if (typeof target[key] == 'object' && target[key] !== null) {
				return new Proxy(target[key], this);
			}

			return target[key];
		},
		set: (...args) => {
			Reflect.set(...args);
			localStorage.setItem('frhd-drawpad-settings', JSON.stringify(this.settings));
			this.emit('settingsChange', this.settings);
			return true;
		},
		deleteProperty: (...args) => {
			Reflect.deleteProperty(...args);
			localStorage.setItem('frhd-drawpad-settings', JSON.stringify(this.settings));
			return true;
		}
	});
	tools = new ToolHandler(this);
	text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
	zoom = 1;
	constructor(view) {
		super();
		this.view = view;
		this.ctx = this.view.getContext('2d');

		this.layers.create();
		this.mouse.init(this.view);
		this.mouse.on('down', this.press.bind(this));
		this.mouse.on('move', this.stroke.bind(this));
		this.mouse.on('up', this.clip.bind(this));

		this.on('settingsChange', this.setColorScheme);
		this.setColorScheme();

		document.addEventListener('keydown', this.keydown.bind(this));
		window.addEventListener('resize', this.constructor.resize.bind(this.view));
		window.dispatchEvent(new Event('resize'));
	}

	setColorScheme({ theme } = this.settings) {
		if (theme == 'dark') {
			document.documentElement.attributeStyleMap.clear();
			this.physicsStyle = '#FFFFFF';
			this.sceneryStyle = '#999999';
		} else {
			document.documentElement.style.setProperty('--accent-color', '#D2D2D2');
			document.documentElement.style.setProperty('--background', '#EBEBEB');
			document.documentElement.style.setProperty('--hard-background', '#EEEEEE');
			document.documentElement.style.setProperty('--text-color', '#1B1B1B');
			this.physicsStyle = '#000000';
			this.sceneryStyle = '#AAAAAA';
		}

		this.draw(this.ctx);
	}

	clear() {
		for (const layer of this.layers.cache) {
			layer.physics.splice(0);
			layer.scenery.splice(0);
		}
	}

	draw() {
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.translate(this.ctx.canvas.width / 2 - this.camera.x, this.ctx.canvas.height / 2 - this.camera.y);
		this.ctx.scale(this.zoom, this.zoom);
		this.ctx.lineCap = 'round';
		this.ctx.lineJoin = 'round';
		this.ctx.lineWidth = 2 * window.devicePixelRatio;
		this.layers.cache.forEach(layer => layer.draw(this.ctx));
		this.tools.selected.draw(this.ctx);
	}

	import(data) {
		this.clear();
		const [physics, scenery] = data.split('#');
		physics.length > 0 && (this.layers.selected.physics = this.constructor.parseLines(physics));
		scenery.length > 0 && (this.layers.selected.scenery = this.constructor.parseLines(scenery));
		this.draw();
	}

	undo() {
		const event = this.events.pop();
		if (!event) return null;
		switch (event.action) {
			case "add":
				event.value.remove();
				break;

			case "remove":
				this.view.prepend(event.value);
				break;

			case "move_selected":
				event.data.selected.map(function (line, index) {
					let type = parseInt(line.getAttribute("x")) ? 0 : parseInt(line.getAttribute("x1")) ? 1 : parseInt(line.getAttribute("cx")) ? 2 : parseInt(line.getAttribute("points")) ? 3 : NaN;
					if (isNaN(type)) {
						return;
					}

					switch (type) {
						case 0:
							line.setAttribute("x", event.data.cache[index].getAttribute("x"));
							line.setAttribute("y", event.data.cache[index].getAttribute("y"));
							break;

						case 1:
							line.setAttribute("x1", event.data.cache[index].getAttribute("x1"));
							line.setAttribute("y1", event.data.cache[index].getAttribute("y1"));
							line.setAttribute("x2", event.data.cache[index].getAttribute("x2"));
							line.setAttribute("y2", event.data.cache[index].getAttribute("y2"));
							break;

						case 2:
							line.setAttribute("cx", event.data.cache[index].getAttribute("cx"));
							line.setAttribute("cy", event.data.cache[index].getAttribute("cy"));
							break;

						case 3:
							line.setAttribute("points", event.data.cache[index].getAttribute("points"));
							break;
					}
				});
				break;
		}

		return event;
	}

	redo() {
		const event = this.events.cache.pop();
		if (!event) return null;
		switch (event.action) {
			case "add":
				this.view.prepend(event.value);
				break;

			case "remove":
				event.value.remove();
				break;

			case "move_selected":
				event.data.selected.map(function (line, index) {
					let type = parseInt(line.getAttribute("x")) ? 0 : parseInt(line.getAttribute("x1")) ? 1 : parseInt(line.getAttribute("cx")) ? 2 : parseInt(line.getAttribute("points")) ? 3 : NaN;
					if (isNaN(type)) {
						return;
					}

					switch (type) {
						case 0:
							line.setAttribute("x", event.data.secondaryCache[index].getAttribute("x"));
							line.setAttribute("y", event.data.secondaryCache[index].getAttribute("y"));
							break;

						case 1:
							line.setAttribute("x1", event.data.secondaryCache[index].getAttribute("x1"));
							line.setAttribute("y1", event.data.secondaryCache[index].getAttribute("y1"));
							line.setAttribute("x2", event.data.secondaryCache[index].getAttribute("x2"));
							line.setAttribute("y2", event.data.secondaryCache[index].getAttribute("y2"));
							break;

						case 2:
							line.setAttribute("cx", event.data.secondaryCache[index].getAttribute("cx"));
							line.setAttribute("cy", event.data.secondaryCache[index].getAttribute("cy"));
							break;

						case 3:
							line.setAttribute("points", event.data.secondaryCache[index].getAttribute("points"));
							break;
					}
				});
				break;
		}

		return event;
	}

	press(event) {
		if (event.button === 1) {
			this.tools.select(this.tools._selected === 'line' ? 'brush' : this.tools._selected === 'brush' ? 'eraser' : this.tools._selected === 'eraser' ? 'camera' : 'line');
			return;
		}

		if (event.ctrlKey) {
			this.tools.select('select');
		}

		event.shiftKey || this.tools.selected.press(event);
		this.draw();
	}

	stroke(event) {
		if (event.shiftKey && this.mouse.down) {
			this.tools.cache.get('camera').stroke(event);
		} else
			this.tools.selected.stroke(event);

		if (['curve', 'eraser'].includes(this.tools._selected)) {
			this.tools.selected.stroke(event);
		}

		this.draw();
	}

	clip(event) {
		event.shiftKey || this.tools.selected.clip(event);
		this.draw();
	}

	keydown(event) {
		event.preventDefault();
		event.stopPropagation();
		switch (event.key) {
			case 'Escape':
				if (layers.style.display !== 'none') {
					layers.style.display = 'none';
					break;
				}

				settings.style.setProperty('display', settings.style.display == 'flex' ? 'none' : 'flex');
				break;

			case '+':
			case '=':
				if (event.ctrlKey || this.tools._selected === 'camera') {
					this.zoom = Math.min(this.zoom * window.devicePixelRatio + .25, window.devicePixelRatio * 4);
					this.draw();
				} else if (this.tools.selected.size < 100) {
					this.tools.selected.size += 1;
				}
				break;

			case '-':
				if (event.ctrlKey || this.tools._selected === 'camera') {
					this.zoom = Math.max(this.zoom / window.devicePixelRatio - .25, window.devicePixelRatio / 5);
					this.draw();
				} else if (this.tools.selected.size > 2) {
					this.tools.selected.size -= 1;
				}
				break;

			case '0':
				this.tools.select('camera');
				break;
			case '1':
				this.tools.select('line');
				break;
			case '2':
				this.tools.select('brush');
				break;
			case '3':
				this.tools.select('circle');
				break;
			case '4':
				this.tools.select('rectangle');
				break;
			case '5':
				this.tools.select('eraser');
				break;
			case 'f':
				this.fill = !this.fill;
				break;

			case 'z':
				event.ctrlKey && this[(event.shiftKey ? 're' : 'un') + 'do']();
				break;

			case 'c':
				if (event.ctrlKey && this.tools._selected === 'select') {
					// this.tools.selected.copy();
					navigator.clipboard.writeText('-18 1i 18 1i###BMX');
				}
				break;

			case 'v':
				if (event.ctrlKey && this.tools._selected === 'select') {
					// this.tools.selected.paste();
					navigator.clipboard.readText().then(console.log);
				}
				break;
		}

		this.draw();
	}

	toString() {
		return Array(this.layers.cache.flatMap(({ physics }) => physics).map(line => line.map(coord => coord.toString(32)).join(' ')).join(','), this.layers.cache.flatMap(({ scenery }) => scenery).map(line => line.map(coord => coord.toString(32)).join(' ')).join(',')).join('#');
	}

	close() {
		this.mouse.close();
		this.events.close();
	}

	static parseLines(part) {
		return part.split(/,+/g).map(line => line.split(/\s+/g).map(coord => parseInt(coord, 32)));
	}

	static resize(event) {
		this.setAttribute('height', getComputedStyle(this).getPropertyValue('height').slice(0, -2) * window.devicePixelRatio);
		this.setAttribute('width', getComputedStyle(this).getPropertyValue('width').slice(0, -2) * window.devicePixelRatio);
	}
}