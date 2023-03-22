export default class {
	alpha = 1;
	hidden = false;
	physics = [];
	scenery = [];
	constructor(parent) {
		this.parent = parent;
		this.id = this.parent.cache.length + 1;
		this.element = layers.querySelector("#layer-container").appendChild(this.parent.createElement('div', {
			children: [
				this.parent.createElement('label', {
					children: [
						this.selector = this.parent.createElement('input', {
							type: 'number',
							id: 'selector',
							className: 'ripple selector',
							step: '1',
							style: {
								padding: 0
							},
							value: this.id,
							onkeydown: event => event.stopPropagation(),
							onchange: event => {
								console.log(event.target.value)
								if (parseInt(event.target.value) < 1) {
									event.target.value = 1;
									return;
								} else if (parseInt(event.target.value) > this.parent.cache.length) {
									event.target.value = this.parent.cache.length;
									return;
								} else if (isNaN(event.target.value) || parseInt(event.target.value) === this.id) {
									return;
								}

								this.move(parseInt(event.target.value));
								this.selector.focus();
							}
						})
					],
					innerText: "Layer ",
					onclick: event => {
						window.canvas.layerDepth = this.id;
						this.parent.cache.forEach(function (layer, index) {
							layer.element.classList.remove("selected");
							if (layer.id === window.canvas.layerDepth) {
								layer.element.classList.add("selected");
							}
						});

						this.selector.focus();
					}
				}),
				this.parent.createElement('div', {
					className: 'options',
					children: [
						this.parent.createElement('div', {
							children: [
								this.parent.createElement('input', {
									max: 100,
									min: 0,
									type: 'range',
									value: 100,
									style: {
										width: '100px',
										pointerEvents: 'all'
									},
									oninput: event => {
										this.opacity = event.target.value / 100;
									}
								})
							],
							className: 'option',
							innerText: 'Opacity',
							style: {
								flexDirection: 'column'
							}
						}),
						this.parent.createElement('label', {
							children: [
								this.parent.createElement('input', {
									type: 'checkbox',
									onchange: this.toggleVisiblity.bind(this)
								})
							],
							className: 'option ripple',
							innerText: 'Hide'
						}),
						this.parent.createElement('button', {
							innerText: 'Clear',
							onclick: () => confirm(`Are you sure you\'d like to clear Layer ${this.id}?`) && this.clear()
						}),
						this.parent.createElement('button', {
							innerText: 'Merge',
							onclick: () => {
								if (this.parent.cache.length <= 1) {
									alert("There must be more than one layer in order to merge layers!");
									return;
								}

								let layerId = prompt(`Which layer would you like to merge Layer ${this.id} with?`);
								if (layerId !== null) {
									let layer = this.parent.get(parseInt(layerId));
									while (layer === void 0) {
										layerId = prompt(`That is not a valid option. Try again or cancel; which layer would you like to merge Layer ${this.id} with?`);
										if (layerId === null) {
											return;
										}

										layer = this.parent.get(parseInt(layerId));
									}

									if (layer) {
										const layer = this.parent.get(layerId);
										if (layer) {
											layer.lines.push(...this.lines);
											this.lines = [];
											this.remove();
										}
									}
								}
							}
						}),
						this.parent.createElement('button', {
							innerText: 'Delete',
							onclick: () => {
								if (this.parent.cache.length <= 1) {
									alert("You must have at least one layer at all times!");
									return;
								}

								confirm(`Are you sure you\'d like to delete Layer ${this.id}?`) && this.remove();
							},
							style: {
								color: 'hsl(0deg 70% 40%)'
							}
						})
					]
				})
			],
			className: 'layer selected',
			onclick: event => {
				if (event.target.className !== this.element.className) return;
				window.canvas.layerDepth = this.id;
				this.parent.cache.forEach(function (layer, index) {
					layer.element.classList.remove('selected');
					if (layer.id === window.canvas.layerDepth) {
						layer.element.classList.add('selected');
					}
				});

				this.selector.focus();
			}
		}));

		/*
		// Check if the mouse position on the layer container is greater than the next or previous layer. Then use element#after to move it.

		this.element.addEventListener("mousedown", function(event) {
			this.style.setProperty("position", "absolute");
			this.style.setProperty("left", event.offsetX + "px");
			this.style.setProperty("top", event.offsetY + "px");
		});
		this.element.addEventListener("mousemove", function(event) {
			if (!event.button && !event.buttons) {
				return;
			}

			this.style.setProperty("left", parseInt(this.style.getPropertyValue("left")) + event.movementX + "px");
			this.style.setProperty("top", parseInt(this.style.getPropertyValue("top")) + event.movementY + "px");
			console.log(this.style.getPropertyValue("left"), this.style.getPropertyValue("top"))
			//console.log(event)
		});
		this.element.addEventListener("mouseup", function(event) {
			this.style.setProperty("position", "unset");
		});
		this.element.addEventListener("mouseleave", function(event) {
			this.style.setProperty("position", "unset");
		});

		//*/

		this.element.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'center'
		});

		this.parent.cache.push(this);
	}

	get opacity() {
		return this.alpha;
	}

	set opacity(alpha) {
		this.alpha = alpha;
		canvas.draw();
	}

	clear() {
		this.physics.splice(0);
		this.scenery.splice(0);
	}

	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.alpha;
		if (!this.hidden) {
			ctx.strokeStyle = canvas.physicsStyle;
			for (const line of this.physics) {
				ctx.beginPath();
				ctx.moveTo(line[0], line[1]);
				for (let i = 2; i < line.length; i += 2) {
					ctx.lineTo(line[i], line[i + 1]);
				}

				ctx.stroke();
			}

			ctx.strokeStyle = canvas.sceneryStyle;
			for (const line of this.scenery) {
				ctx.beginPath();
				ctx.moveTo(line[0], line[1]);
				for (let i = 2; i < line.length; i += 2) {
					ctx.lineTo(line[i], line[i + 1]);
				}

				ctx.stroke();
			}
		}

		ctx.restore();
	}

	move(newIndex) {
		if (typeof newIndex != 'number' || this.id === newIndex) {
			throw new Error("Invalid index.");
		}

		this.parent.remove(this.id);
		// this.parent.cache.forEach(layer => {
		// 	if (this.id < newIndex) {
		// 		if (layer.id === newIndex - 1) {
		// 			layer.element.after(this.element);
		// 		}
		// 	} else {
		// 		if (layer.id === newIndex) {
		// 			layer.element.before(this.element);
		// 		}
		// 	}
		// });
		this.parent.cache.forEach(layer => layer.id === newIndex && layer.element.after(this.element));
		this.parent.insert(this, newIndex - 1);
		this.element.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'center'
		});
	}

	toggleVisiblity() {
		this.hidden = !this.hidden;
		canvas.draw();
	}

	remove() {
		this.element.remove();
		this.parent.remove(this.id);
		if (this.parent.cache.length < window.canvas.layerDepth) {
			window.canvas.layerDepth = window.canvas.layerDepth === this.id ? this.parent.cache.length : 1;
		}

		return this;
	}
}