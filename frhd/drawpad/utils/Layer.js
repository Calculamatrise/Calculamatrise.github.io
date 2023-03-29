export default class {
	alpha = 1;
	hidden = false;
	// create grid
	physics = [];
	scenery = [];
	constructor(parent) {
		this.parent = parent;
		this.element = layers.querySelector("#layer-container").appendChild(this.parent.constructor.createElement('div', {
			children: [
				this.parent.constructor.createElement('label', {
					children: [
						this.selector = this.parent.constructor.createElement('input', {
							className: 'ripple selector',
							id: 'selector',
							min: 1,
							step: '1',
							type: 'number',
							value: this.parent.cache.length + 1,
							onkeydown: event => event.stopPropagation(),
							onchange: event => isFinite(event.target.valueAsNumber) && this.move(Math.min(Math.max(event.target.valueAsNumber, 1), this.parent.cache.length))
						})
					],
					innerText: "Layer ",
					onclick: () => this.parent.select(this.id)
				}),
				this.parent.constructor.createElement('div', {
					className: 'options',
					children: [
						this.parent.constructor.createElement('div', {
							children: [
								this.parent.constructor.createElement('input', {
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
						this.parent.constructor.createElement('label', {
							children: [
								this.parent.constructor.createElement('input', {
									type: 'checkbox',
									onchange: this.toggleVisiblity.bind(this)
								})
							],
							className: 'button option ripple',
							innerText: 'Hide',
							onclick() {
								this.firstElementChild.checked = !this.firstElementChild.checked;
								this.firstElementChild.dispatchEvent(new Event('change'));
							}
						}),
						this.parent.constructor.createElement('button', {
							innerText: 'Clear',
							onclick: () => confirm(`Are you sure you\'d like to clear Layer ${this.id}?`) && this.clear()
						}),
						this.parent.constructor.createElement('button', {
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
						this.parent.constructor.createElement('button', {
							innerText: 'Delete',
							onclick: () => {
								if (this.parent.cache.length <= 1) {
									alert("You must have at least one layer at all times!");
									return;
								}

								confirm(`Are you sure you\'d like to delete Layer ${this.id}?`) && this.remove();
							},
							style: {
								color: 'crimson'
							}
						})
					]
				})
			],
			className: 'layer selected',
			onclick: ({ target }) => target === this.element && this.parent.select(this.id)
		}));

		this.element.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'center'
		});
	}

	get id() {
		return 1 + this.parent.cache.indexOf(this);
	}

	get opacity() {
		return this.alpha;
	}

	set opacity(alpha) {
		this.alpha = alpha;
		this.parent.canvas.draw();
	}

	clear() {
		this.physics.splice(0);
		this.scenery.splice(0);
	}

	draw(ctx) {
		ctx.save();
		ctx.globalAlpha = this.alpha;
		if (!this.hidden) {
			ctx.strokeStyle = this.parent.canvas.physicsStyle;
			for (const line of this.physics) {
				ctx.beginPath();
				ctx.moveTo(line[0], line[1]);
				for (let i = 2; i < line.length; i += 2) {
					ctx.lineTo(line[i], line[i + 1]);
				}

				ctx.stroke();
			}

			ctx.strokeStyle = this.parent.canvas.sceneryStyle;
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
		const removed = this.parent.remove(this);
		this.parent.insert(removed, newIndex);
		this.element.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'center'
		});
		this.selector.focus();
	}

	toggleVisiblity() {
		this.hidden = !this.hidden;
		this.parent.canvas.draw();
	}

	remove() {
		this.element.remove();
		this.parent.remove(this);
	}
}