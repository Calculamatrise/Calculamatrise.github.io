class Track {
	physics = [];
	scenery = [];
	powerups = {
		antigravity: [],
		bomb: [],
		booster: [],
		checkpoint: [],
		gravity: [],
		slowmo: [],
		target: [],
		teleporter: [],
		vehicles: {
			balloon: [],
			blob: [],
			heli: [],
			truck: []
		}
	}
	constructor() {
		this.import(arguments[0] || '-18 1i 18 1i##');
	}

	clear() {
		this.physics.splice(0);
		this.scenery.splice(0);
		for (const type in this.powerups) {
			switch (type) {
				case 'vehicles':
					for (const vehicle in this.powerups[type]) {
						this.powerups[type][vehicle].splice(0);
					}
					break;
				default:
					this.powerups[type].splice(0);
			}
		}
	}

	import(code) {
		const [physics, scenery, powerups] = String(code || '').padEnd(2, '#').split('#').map(segment => segment.split(',').filter(segment => segment).map(vector => vector.split(/\s+/g)));
		line: for (const line of physics) {
			for (const coordinate in line) {
				line[coordinate] = parseInt(line[coordinate], 32);
				if (isNaN(line[coordinate])) {
					continue line;
				}
			}

			this.physics.push(line);
		}

		line: for (const line of scenery) {
			for (const coordinate in line) {
				line[coordinate] = parseInt(line[coordinate], 32);
				if (isNaN(line[coordinate])) {
					continue line;
				}
			}

			this.scenery.push(line);
		}

		powerup: for (const powerup of powerups) {
			let type = this.constructor.dict[powerup[0]];
			let isVehicle = typeof type == 'object';
			if (isVehicle) {
				type = type[parseInt(powerup[3], 32)];
			}

			if (type === void 0) continue;
			for (const coordinate in powerup) {
				if (coordinate == 0) continue;
				powerup[coordinate] = parseInt(powerup[coordinate], 32);
				if (isNaN(powerup[coordinate])) {
					continue powerup;
				}
			}

			if (isVehicle) {
				this.powerups.vehicles[type].push(powerup.slice(1));
				continue;
			}

			this.powerups[type].push(powerup.slice(1));
		}

		return this;
	}

	translate(x = 0, y = 0) {
		for (const line of this.physics) {
			for (let t = 0; t < line.length; t += 2) {
				line[t] += x;
				line[t + 1] += y;
			}
		}

		for (const line of this.scenery) {
			for (let t = 0; t < line.length; t += 2) {
				line[t] += x;
				line[t + 1] += y;
			}
		}

		for (const type in this.powerups) {
			for (const powerup in this.powerups[type]) {
				switch (type) {
					case 'vehicles':
						for (const vehicle of this.powerups[type][powerup]) {
							vehicle[0] += x;
							vehicle[1] += y;
						}
						break;
					case 'teleporter':
						this.powerups[type][powerup][2] += x;
						this.powerups[type][powerup][3] += y;
					default:
						this.powerups[type][powerup][0] += x;
						this.powerups[type][powerup][1] += y;
				}
			}
		}

		return this;
	}

	rotate(x = 0) {
		for (const line of this.physics) {
			for (let t = 0, e; t < line.length; t += 2) {
				e = line[t];
				line[t] = Math.cos(x) * e + Math.sin(x) * line[t + 1],
				line[t + 1] = -Math.sin(x) * e + Math.cos(x) * line[t + 1];
			}
		}

		for (const line of this.scenery) {
			for (let t = 0, e; t < line.length; t += 2) {
				e = line[t];
				line[t] = Math.cos(x) * e + Math.sin(x) * line[t + 1],
				line[t + 1] = -Math.sin(x) * e + Math.cos(x) * line[t + 1];
			}
		}

		for (const type in this.powerups) {
			for (const powerup in this.powerups[type]) {
				switch (type) {
					case 'vehicles':
						for (const vehicle of this.powerups[type][powerup]) {
							let i = vehicle[0];
							vehicle[0] = Math.cos(x) * i + Math.sin(x) * vehicle[1],
							vehicle[1] = -Math.sin(x) * i + Math.cos(x) * vehicle[1];
						}
						break;
					case 'teleporter':
						let e = this.powerups[type][powerup][2];
						this.powerups[type][powerup][2] = Math.cos(x) * e + Math.sin(x) * this.powerups[type][powerup][3],
						this.powerups[type][powerup][3] = -Math.sin(x) * e + Math.cos(x) * this.powerups[type][powerup][3];
					default:
						let i = this.powerups[type][powerup][0];
						this.powerups[type][powerup][0] = Math.cos(x) * i + Math.sin(x) * this.powerups[type][powerup][1],
						this.powerups[type][powerup][1] = -Math.sin(x) * i + Math.cos(x) * this.powerups[type][powerup][1];
						if (['booster', 'gravity'].includes(type)) {
							this.powerups[type][powerup][2] += x / -Math.PI * 180;
						}
				}
			}
		}

		return this;
	}

	scale(x = 1, y = 1) {
		x = Math.abs(x ** (x / Math.abs(x)));
		y = Math.abs(y ** (y / Math.abs(y)));
		for (const line of this.physics) {
			for (let t = 0; t < line.length; t += 2) {
				line[t] *= x;
				line[t + 1] *= y;
			}
		}

		for (const line of this.scenery) {
			for (let t = 0; t < line.length; t += 2) {
				line[t] *= x;
				line[t + 1] *= y;
			}
		}

		for (const type in this.powerups) {
			for (const powerup in this.powerups[type]) {
				switch (type) {
					case 'vehicles':
						for (const vehicle of this.powerups[type][powerup]) {
							vehicle[0] *= x;
							vehicle[1] *= y;
						}
						break;
					case 'teleporter':
						this.powerups[type][powerup][2] *= x;
						this.powerups[type][powerup][3] *= y;
					default:
						this.powerups[type][powerup][0] *= x;
						this.powerups[type][powerup][1] *= y;
				}
			}
		}

		return this;
	}

	flip(x = 0, y = 0) {
		this.translate(-x, -y);
		this.scale(1 + (x && -2), 1 + (y && -2));
		return this.translate(x, y);
	}

	toString() {
		let powerups = [];
		for (const type in this.powerups) {
			switch (type) {
				case 'vehicles':
					for (const vehicle in this.powerups[type]) {
						powerups.push(this.powerups[type][vehicle].map(powerup => 'V ' + powerup.map(t => Math.round(t).toString(32)).join(' ')).join(','));
					}
					break;
				default:
					const id = Object.entries(this.constructor.dict).find(([, value]) => value == type).shift();
					powerups.push(this.powerups[type].map(powerup => id + ' ' + powerup.map(t => Math.round(t).toString(32)).join(' ')).join(','));
			}
		}

		return Array(this.physics.map(line => line.map(t => Math.round(t).toString(32)).join(' ')).join(','), this.scenery.map(line => line.map(t => Math.round(t).toString(32)).join(' ')).join(','), powerups.filter(i => i).join(',')).join('#');
	}

	static dict = {
		T: 'target',
		B: 'booster',
		G: 'gravity',
		S: 'slowmo',
		O: 'bomb',
		C: 'checkpoint',
		A: 'antigravity',
		W: 'teleporter',
		V: {
			1: 'heli',
			2: 'truck',
			3: 'balloon',
			4: 'blob'
		}
	}
}