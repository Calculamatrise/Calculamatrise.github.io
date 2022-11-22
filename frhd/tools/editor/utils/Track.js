class Track {
    constructor(code) {
        this.import(code || "-18 1i 18 1i##");
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

    physics = [];
    scenery = [];
    powerups = {
        targets: [],
        boosters: [],
        gravity: [],
        slowmos: [],
        bombs: [],
        checkpoints: [],
        antigravity: [],
        teleporters: [],
        vehicles: {
            heli: [],
            truck: [],
            balloon: [],
            blob: []
        }
    }

    get code() {
        let powerups = [];
        for (const type in this.powerups) {
            switch(type) {
                case 'targets':
                case 'boosters':
                case 'gravity':
                case 'slowmos':
                case 'bombs':
                case 'checkpoints':
                case 'antigravity':
                case 'teleporters':
                    let id = Object.keys(this.constructor.dict).find((key) => this.constructor.dict[key] === type.slice(0, -1));
                    powerups.push(this.powerups[type].map(powerup => id + ' ' + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;

                case 'vehicles':
                    for (const vehicle in this.powerups[type]) {
                        powerups.push(this.powerups[type][vehicle].map(powerup => "V " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    }
                    break;
            }
        }

        return this.physics.map(vector => vector.map(t => Math.round(t).toString(32)).join(' ')).join(',') + '#' + this.scenery.map(vector => vector.map(t => Math.round(t).toString(32)).join(' ')).join(',') + '#' + powerups.filter(i => i).join(',');
    }

    import(code) {
        code = String(code).split('#').map(segment => segment.split(',').map(vector => vector.split(/\s+/g)));
        line: for (const line of code[0] ?? []) {
            for (const coordinate in line) {
                line[coordinate] = parseInt(line[coordinate], 32);
                if (isNaN(line[coordinate])) {
                    continue line;
                }
            }

            this.physics.push(line);
        }

        line: for (const line of code[1] ?? []) {
            for (const coordinate in line) {
                line[coordinate] = parseInt(line[coordinate], 32);
                if (isNaN(line[coordinate])) {
                    continue line;
                }
            }

            this.scenery.push(line);
        }

        powerup: for (const powerup of code[2] ?? []) {
            let isVehicle = false;
            let type = this.constructor.dict[powerup[0]];
            if (typeof type == 'object') {
                isVehicle = true;
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

            this.powerups[type + 's'].push(powerup.slice(1));
        }

        return this;
    }

    move(x = 0, y = 0) {
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
                switch(type) {
                    case "teleporters":
                        this.powerups[type][powerup][2] += x;
                        this.powerups[type][powerup][3] += y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this.powerups[type][powerup][0] += x;
                        this.powerups[type][powerup][1] += y;
                        break;

                    case "vehicles":
                        for (const vehicle of this.powerups[type][powerup]) {
                            vehicle[0] += x;
                            vehicle[1] += y;
                        }

                        break;
                }
            }
        }

        return this;
    }

    rotate(x = 0) {
        for (const line of this.physics) {
            for (let t = 0, e = line[t]; t < line.length; t += 2) {
                e = line[t];

                line[t] = Math.cos(x) * e + Math.sin(x) * line[t + 1],
                line[t + 1] = -Math.sin(x) * e + Math.cos(x) * line[t + 1];
            }
        }

        for (const line of this.scenery) {
            for (let t = 0, e = line[t]; t < line.length; t += 2) {
                e = line[t];

                line[t] = Math.cos(x) * e + Math.sin(x) * line[t + 1],
                line[t + 1] = -Math.sin(x) * e + Math.cos(x) * line[t + 1];
            }
        }

        for (const type in this.powerups) {
            for (const powerup in this.powerups[type]) {
                switch(type) {
                    case "teleporters":
                        let e = this.powerups[type][powerup][2];

                        this.powerups[type][powerup][2] = Math.cos(x) * e + Math.sin(x) * this.powerups[type][powerup][3],
                        this.powerups[type][powerup][3] = -Math.sin(x) * e + Math.cos(x) * this.powerups[type][powerup][3];
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        let i = this.powerups[type][powerup][0];

                        this.powerups[type][powerup][0] = Math.cos(x) * i + Math.sin(x) * this.powerups[type][powerup][1],
                        this.powerups[type][powerup][1] = -Math.sin(x) * i + Math.cos(x) * this.powerups[type][powerup][1];
                        if (["boosters", "gravity"].includes(type)) {
                            this.powerups[type][powerup][2] += x / -Math.PI * 180;
                        }

                        break;

                    case "vehicles":
                        for (const vehicle of this.powerups[type][powerup]) {
                            let i = vehicle[0];
                            vehicle[0] = Math.cos(x) * i + Math.sin(x) * vehicle[1],
                            vehicle[1] = -Math.sin(x) * i + Math.cos(x) * vehicle[1];
                        }

                        break;
                }
            }
        }

        return this;
    }

    scale(x = 1, y = 1) {
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
                switch(type) {
                    case "teleporters":
                        this.powerups[type][powerup][2] *= x;
                        this.powerups[type][powerup][3] *= y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this.powerups[type][powerup][0] *= x;
                        this.powerups[type][powerup][1] *= y;
                        break;
                    
                    case "vehicles":
                        for (const vehicle of this.powerups[type][powerup]) {
                            vehicle[0] *= x;
                            vehicle[1] *= y;
                        }

                        break;
                }
            }
        }

        return this;
    }

    flip(x = 0, y = 0) {
        this.move(-x, -y);
        this.scale(1 + (x && -2), 1 + (y && -2));
        return this.move(x, y);
    }
}