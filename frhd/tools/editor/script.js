class Track {
    constructor(t) {
        t = t.split(/\u0023/g).map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));
        this._physics = t[0] ? t[0].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [],
        this._scenery = t[1] ? t[1].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [],
        this._powerups = {
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
                blob: [],
                glider: []
            }
        }
        this._events = new Map();
        this.readyCount = 0;

        this.worker = new Worker("worker.js");
        this.worker.onmessage = ({ data }) => {
            this._physics = data.args.physics,
            this._scenery = data.args.scenery,
            this._powerups = data.args.powerups,
            output.value = this.code;
            switch(data.cmd) {
                case "move":
                    this.emit("moved", this.code);
                break;
                
                case "rotate":
                    this.emit("rotated", this.code);
                break;

                case "scale":
                    this.emit("scaled", this.code);
            }
        }

        for (const e in t[2]) {
            switch(e) {
                case "T":
                    this._powerups.targets.push(e.slice(1).map(t => parseInt(t, 32)));
                break;
                
                case "B":
                    this._powerups.boosters.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "G":
                    this._powerups.gravity.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "S":
                    this._powerups.slowmos.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "O":
                    this._powerups.bombs.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "C":
                    this._powerups.checkpoints.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "A":
                    this._powerups.antigravity.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "W":
                    this._powerups.teleporters.push(e.slice(1).map(t => parseInt(t, 32)));
                break;

                case "V":
                    switch(e[3]) {
                        case "1":
                            this._powerups.vehicles.heli.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "2":
                            this._powerups.vehicles.truck.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "3":
                            this._powerups.vehicles.balloon.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "4":
                            this._powerups.vehicles.blob.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;

                        case "5":
                            this._powerups.vehicles.glider.push(e.slice(1).map(t => parseInt(t, 32)));
                        break;
                    }
                break;
            }
        }
    }
    on(event, func = function() {}) {
        this._events.set(event, func);
    }
    emit(event, ...args) {
        event = this._events.get(event);
        if (!event || typeof event !== "function")
            throw new Error("INVALID_FUNCTION");
        return event(...args);
    }
    move(x = 0, y = 0) {
        this.worker.postMessage({
            cmd: "move",
            args: {
                physics: this._physics,
                scenery: this._scenery,
                powerups: this._powerups,
                x, y
            }
        });
        return this;
    }
    rotate(x = 0) {
        let rotationFactor = x;
        x *= -Math.PI / 180;
        this.worker.postMessage({
            cmd: "rotate",
            args: {
                physics: this._physics,
                scenery: this._scenery,
                powerups: this._powerups,
                rotationFactor,
                x
            }
        });
        return this;
    }
    scale(x = 1, y = 1) {
        this.worker.postMessage({
            cmd: "scale",
            args: {
                physics: this._physics,
                scenery: this._scenery,
                powerups: this._powerups,
                x, y
            }
        });
        return this;
    }
    get physics() {
        return this._physics.map(t => t.map(t => t.toString(32)).join(" ")).join(",");
    }
    get scenery() {
        return this._scenery.map(t => t.map(t => t.toString(32)).join(" ")).join(",");
    }
    get powerups() {
        let powerups = "";
        for (const t in this._powerups) {
            switch(t) {
                case "targets":
                    for (const e of this._powerups[t]) {
                        powerups += `T ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;
                
                case "boosters":
                    for (const e of this._powerups[t]) {
                        powerups += `B ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "gravity":
                    for (const e of this._powerups[t]) {
                        powerups += `G ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "slowmos":
                    for (const e of this._powerups[t]) {
                        powerups += `S ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;
                
                case "bombs":
                    for (const e of this._powerups[t]) {
                        powerups += `O ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "checkpoints":
                    for (const e of this._powerups[t]) {
                        powerups += `C ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "antigravity":
                    for (const e of this._powerups[t]) {
                        powerups += `A ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "teleporters":
                    for (const e of this._powerups[t]) {
                        powerups += `W ${e.map(t => t.toString(32)).join(" ")},`;
                    }
                break;

                case "vehicles":
                    for (const e in this._powerups[t]) {
                        for (const i of this._powerups[t][e]) {
                            powerups += `V ${i.map(t => t.toString(32)).join(" ")},`;
                        }
                    }
                break;
            }
        }
        return powerups;
    }
    get code() {
        return this.physics + "#" + this.scenery + "#" + this.powerups;
    }
}

transform.onclick = function() {
    const track = new Track(input.value)
        .move(parseInt(moveX.value) | 0, parseInt(moveY.value) | 0);
    track.on("moved", function() {
        track.scale(parseInt(scaleX.value) | 1, parseInt(scaleY.value) | 1);
    });
    track.on("scaled", function() {
        track.rotate(parseInt(rotate.value) | 0);
    });
    chars.innerText = output.value.length.toString().slice(0, -3) || 0,
    output.select();
}

copy.onclick = function() {
    output.select();
    document.execCommand('copy');
}

input.onclick = output.onclick = function() {
    this.select();
}

window.onkeydown = function(e) {
    let key = e.keyCode || e.which;
    if (key == 13) transform.onclick();
    if (key == 67) copy.onclick();
}