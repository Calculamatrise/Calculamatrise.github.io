class Track {
    constructor(t) {
        t = t.split("#");
        this.physics = t[0].length > 0 ? t[0].split(",").map(t => t.split(/\s/)) : [];
        this.scenery = t[1].length > 0 ? t[1].split(",").map(t => t.split(/\s/)) : [];
        this.powerups = t[2] || [];
        this.splitPowerups();
        this.decodeTrack();
    }
    encode(t) {
        return parseInt(t).toString(32);
    }
    decode(t) {
        return parseInt(t, 32);
    }
    splitPowerups() {
        if (this.powerups.length < 1) return;
        let powerups = this.powerups.split(",").map(t => t.split(/\s/));
        this.powerups = {
            targets: [],
            boosters: [],
            slowmos: [],
            bombs: [],
            gravity: [],
            antigravity: [],
            teleporters: [],
            vehicles: {
                heli: [],
                truck: [],
                balloon: [],
                blob: []
            }
        }
        for (const t of powerups) {
            switch(t[0]) {
                case "T":
                    this.powerups.targets.push(t);
                    break;
                case "B":
                    this.powerups.boosters.push(t);
                    break;
                case "S":
                    this.powerups.slowmos.push(t);
                    break;
                case "O":
                    this.powerups.bombs.push(t);
                    break;
                case "G":
                    this.powerups.gravity.push(t);
                    break;
                case "A":
                    this.powerups.antigravity.push(t);
                    break;
                case "W":
                    this.powerups.teleporters.push(t);
                    break;
                case "V":
                    switch(t[3]) {
                        case "1":
                            this.powerups.vehicles.heli.push(t);
                            break;
                        case "2":
                            this.powerups.vehicles.truck.push(t);
                            break;
                        case "3":
                            this.powerups.vehicles.balloon.push(t);
                            break;
                        case "4":
                            this.powerups.vehicles.blob.push(t);
                            break;
                    }
            }
        }
    }
    decodeTrack() {
        for (const t of this.physics) {
            for (const e in t) {
                t[e] = this.decode(t[e]);
            }
        }
        for (const t of this.scenery) {
            for (const e of t) {
                t[e] = this.decode(t[e]);
            }
        }
        for (const t in this.powerups) {
            if (t != "vehicles") {
                for (const e of this.powerups[t]) {
                    for (let i = 1; i < e.length; i++) {
                        e[i] = this.decode(e[i]);
                    }
                }
            } else {
                for (const e in this.powerups[t]) {
                    for (const i of this.powerups[t][e]) {
                        for (let s = 1; s < i.length - 2; s++) {
                            i[s] = this.decode(i[s]);
                        }
                    }
                }
            }
        }
    }
    encodeTrack() {
        for (const t of this.physics) {
            for (const e in t) {
                t[e] = this.encode(t[e]);
            }
        }
        this.physics = this.physics.map(t => t.join(" ")).join(",");
        for (const t of this.scenery) {
            for (const e in t) {
                t[e] = this.encode(t[e]);
            }
        }
        this.scenery = this.scenery.map(t => t.join(" ")).join(",");
        for (const t in this.powerups) {
            if (t != "vehicles") {
                for (const e of this.powerups[t]) {
                    for (let i = 1; i < e.length; i++) {
                        e[i] = this.encode(e[i]);
                    }
                }
            } else {
                for (const e in this.powerups[t]) {
                    for (const i of this.powerups[t][e]) {
                        for (let s = 1; s < i.length - 2; s++) {
                            i[s] = this.encode(i[s]);
                        }
                    }
                }
            }
        }
        if (!this.powerups?.vehicles) return;
        this.powerups = Object.assign(this.powerups.vehicles, this.powerups);
        delete this.powerups.vehicles;
        this.powerups = Object.values(this.powerups).map(t => t.map(t => t.join(" ")).join(",")).join(",").replace(/,+/g, ",");
    }
    condense() {
        let t = this.physics;
        for (let e in t) {
            t[e] = t[e].join(" ");
        }
        let e = t.filter((e, i) => t.indexOf(e) == i);
        for (let i in e) {
            e[i] = e[i].split(" ");
        }
        this.physics = e;
        let i = this.scenery;
        for (let s in i) {
            i[s] = i[s].join(" ");
        }
        let s = i.filter((s, n) => t.indexOf(s) == n);
        for (let n in s) {
            s[n] = s[n].split(" ");
        }
        this.scenery = s;
    }
    move(t, e) {
        for (const i of this.physics) {
            for (let s = 0, n = 1; s < i.length; s += 2, n += 2) {
                i[s] += t;
                i[n] += e;
            }
        }
        for (const i of this.scenery) {
            for (let s = 0, n = 1; s < i.length; s += 2, n += 2) {
                i[s] += t;
                i[n] += e;
            }
        }
        for (const i in this.powerups) {
            if (i != "vehicles") {
                for (const s of this.powerups[i]) {
                    for (let n = 1, o = 2; n < s.length; n += 2, o += 2) {
                        s[n] += t;
                        s[o] += e;
                    }
                }
            } else {
                for (const s in this.powerups[i]) {
                    for (const n of this.powerups[i][s]) {
                        for (let o = 1, p = 2; o < n.length - 2; o += 2, p += 2) {
                            n[o] += t;
                            n[p] += e;
                        }
                    }
                }
            }
        }
    }
    get code() {
        this.encodeTrack();
        return this.physics + "#" + this.scenery + "#" + this.powerups;
    }
}

function execute() {
    let t = new Track(input.value);
    t.move(parseInt(travelDistanceX.value), parseInt(travelDistanceY.value));

    return input.value = t.code;
}

move.onclick = execute;
input.onclick = input.select;

copy.onclick = function() {
    input.select();
    document.execCommand("copy");
}

document.onkeypress = t => {
    switch(t.key) {
        case "Enter":
            execute();
            break;
        case "c":
            copy.onclick();
            break;
    }
}