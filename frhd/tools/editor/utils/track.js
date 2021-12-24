class Track {
    constructor(code) {
        code = (code || "-18 1i 18 1i##").split(/\u0023/g).map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));

        this._physics = code[0] ? code[0].map(t => t.map(t => Math.round(parseInt(t, 32))).filter(t => !isNaN(t))) : [],
        this._scenery = code[1] ? code[1].map(t => t.map(t => Math.round(parseInt(t, 32))).filter(t => !isNaN(t))) : [];

        for (const powerup of code[2]) {
            switch(powerup[0]) {
                case "T":
                    this._powerups.targets.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                    break;
                
                case "B":
                    this._powerups.boosters.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                    break;

                case "G":
                    this._powerups.gravity.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                    break;

                case "S":
                    this._powerups.slowmos.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                    break;

                case "O":
                    this._powerups.bombs.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                    break;

                case "C":
                    this._powerups.checkpoints.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                    break;

                case "A":
                    this._powerups.antigravity.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                    break;

                case "W":
                    this._powerups.teleporters.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                    break;

                case "V":
                    switch(powerup[3]) {
                        case "1":
                            this._powerups.vehicles.heli.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                            break;

                        case "2":
                            this._powerups.vehicles.truck.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                            break;

                        case "3":
                            this._powerups.vehicles.balloon.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                            break;

                        case "4":
                            this._powerups.vehicles.blob.push(powerup.slice(1).map(t => Math.round(parseInt(t, 32))));
                            break;
                    }
                break;
            }
        }
    }
    _powerups = {
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
    get physics() {
        return this._physics.map(t => t.map(t => Math.round(t).toString(32)).join(" ")).join(",");
    }
    get scenery() {
        return this._scenery.map(t => t.map(t => Math.round(t).toString(32)).join(" ")).join(",");
    }
    get powerups() {
        let powerups = [];
        for (const type in this._powerups) {
            switch(type) {
                case "targets":
                    powerups.push(this._powerups[type].map(powerup => "T " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;
                
                case "boosters":
                    powerups.push(this._powerups[type].map(powerup => "B " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;

                case "gravity":
                    powerups.push(this._powerups[type].map(powerup => "G " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;

                case "slowmos":
                    powerups.push(this._powerups[type].map(powerup => "S " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;
                
                case "bombs":
                    powerups.push(this._powerups[type].map(powerup => "O " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;

                case "checkpoints":
                    powerups.push(this._powerups[type].map(powerup => "C " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;

                case "antigravity":
                    powerups.push(this._powerups[type].map(powerup => "A " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;

                case "teleporters":
                    powerups.push(this._powerups[type].map(powerup => "W " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    break;

                case "vehicles":
                    for (const vehicle in this._powerups[type]) {
                        powerups.push(this._powerups[type][vehicle].map(powerup => "V " + powerup.map(t => Math.round(t).toString(32)).join(" ")).join(","));
                    }
                    break;
            }
        }

        return powerups.filter(powerups => powerups).join(",");
    }
    get code() {
        return this.physics + "#" + this.scenery + "#" + this.powerups;
    }
    move(x = 0, y = 0) {
        for (const line of this._physics) {
            for (let t = 0; t < line.length; t += 2) {
                line[t] += x;
                line[t + 1] += y;
            }
        }

        for (const line of this._scenery) {
            for (let t = 0; t < line.length; t += 2) {
                line[t] += x;
                line[t + 1] += y;
            }
        }

        for (const type in this._powerups) {
            for (const powerup in this._powerups[type]) {
                switch(type) {
                    case "teleporters":
                        this._powerups[type][powerup][2] += x;
                        this._powerups[type][powerup][3] += y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this._powerups[type][powerup][0] += x;
                        this._powerups[type][powerup][1] += y;
                        break;
                    
                    case "vehicles":
                        for (const vehicle of this._powerups[type][powerup]) {
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
        for (const line of this._physics) {
            for (let t = 0, e = line[t]; t < line.length; t += 2) {
                e = line[t];

                line[t] = Math.cos(x) * e + Math.sin(x) * line[t + 1],
                line[t + 1] = -Math.sin(x) * e + Math.cos(x) * line[t + 1];
            }
        }

        for (const line of this._scenery) {
            for (let t = 0, e = line[t]; t < line.length; t += 2) {
                e = line[t];
                
                line[t] = Math.cos(x) * e + Math.sin(x) * line[t + 1],
                line[t + 1] = -Math.sin(x) * e + Math.cos(x) * line[t + 1];
            }
        }

        for (const type in this._powerups) {
            for (const powerup in this._powerups[type]) {
                switch(type) {
                    case "teleporters":
                        let e = this._powerups[type][powerup][2];

                        this._powerups[type][powerup][2] = Math.cos(x) * e + Math.sin(x) * this._powerups[type][powerup][3],
                        this._powerups[type][powerup][3] = -Math.sin(x) * e + Math.cos(x) * this._powerups[type][powerup][3];
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        let i = this._powerups[type][powerup][0];

                        this._powerups[type][powerup][0] = Math.cos(x) * i + Math.sin(x) * this._powerups[type][powerup][1],
                        this._powerups[type][powerup][1] = -Math.sin(x) * i + Math.cos(x) * this._powerups[type][powerup][1];
                        if (["boosters", "gravity"].includes(type)) {
                            this._powerups[type][powerup][2] += x / -Math.PI * 180;
                        }

                        break;
                    
                    case "vehicles":
                        for (const vehicle of this._powerups[type][powerup]) {
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
        for (const line of this._physics) {
            for (let t = 0; t < line.length; t += 2) {
                line[t] *= x;
                line[t + 1] *= y;
            }
        }

        for (const line of this._scenery) {
            for (let t = 0; t < line.length; t += 2) {
                line[t] *= x;
                line[t + 1] *= y;
            }
        }

        for (const type in this._powerups) {
            for (const powerup in this._powerups[type]) {
                switch(type) {
                    case "teleporters":
                        this._powerups[type][powerup][2] *= x;
                        this._powerups[type][powerup][3] *= y;
                    case "targets":
                    case "boosters":
                    case "gravity":
                    case "slomos":
                    case "bombs":
                    case "checkpoints":
                    case "antigravity":
                        this._powerups[type][powerup][0] *= x;
                        this._powerups[type][powerup][1] *= y;
                        break;
                    
                    case "vehicles":
                        for (const vehicle of this._powerups[type][powerup]) {
                            vehicle[0] *= x;
                            vehicle[1] *= y;
                        }

                        break;
                } 
            }
        }

        return this;
    }
}