export default class {
    constructor() {
        this.mode = 0;
        this.tool = "";
        this._physics = [];
        this._scenery = [];
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
    }
    import(t) {
        if (typeof t === "string")
            t = t.split(/\u0023/g).map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));;
        this._physics = t[0] ? t[0].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [];
        this._scenery = t[1] ? t[1].map(t => t.map(t => parseInt(t, 32)).filter(t => !isNaN(t))) : [];
        for (const e of t[2]) {
            switch(e[0]) {
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
        return this;
    }
    encode(t) {
        return t.toString(32);
    }
    decode(t) {
        return parseInt(t, 32);
    }
    change() {
        this.mode = this.mode ? 0 : 1;
    }
    line() {
        var p = [];
        var a = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        for (let i = 0; i < a.length; i++)
            p.push(a[i]);
        this.type.push(p);
        // this.transform("translate", -canvas.width / 2, -canvas.height / 2);
        // code.value = this.code;
        return this;
    }
    rect(x, y, w, h) {
        return this.line(x, y, x + w, y, x + w, y + h, x, y + h, x, y);
    }
    fillRect(x, y, w, h) {
        for (let i = y; i < y + h; i++)
            this.line(x, i, x + w, i);
        return this;
    }
    circle(x, y, r, s) {
        var p = [];
        if (s === void 0) s = 5;
        for (let i = 0; i <= 360; i += s)
            p.push(x + r * Math.cos(i * Math.PI / 180), y + r * Math.sin(i * Math.PI / 180));
        return this.line(p);
    }
    fillCircle(xx, yy, r) {
        for (let y = -r; y < r; y++) {
            var x = 0;
            while (Math.hypot(x, y) <= r) x++;
            this.line(xx - x, yy + y, xx + x, yy + y);
        }
        return this;
    }
    powerup() {
        var a = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        var p = [a[0]];
        for (let i = 1; i < a.length; i++)
            p.push(a[i].toString(32));
        this.powerups.push(p.join(" "));
        code.value = this.code;
        return this;
    }
    transform(t, x, y) {
        if (t == "rotate") x *= Math.PI / 180;
        if (this.code.length == 2) return this;
        var s = this.code.split("#");
        for (let i = 0; i < s.length; i++)
            if (s[i] !== "")
                s[i] = s[i].split(",");
        for (let n = 0; n < 2; n++) {
            for (let i = 0; i < s[n].length; i++) {
                s[n][i] = s[n][i].split(" ");
                for (let a = 0; a < s[n][i].length - 1; a += 2) {
                    switch (t) {
                        case "translate":
                            s[n][i][a] = this.encode(this.decode(s[n][i][a]) + x);
                            s[n][i][a + 1] = this.encode(this.decode(s[n][i][a + 1]) + y);
                            break;
                        case "scale":
                            s[n][i][a] = this.encode(this.decode(s[n][i][a]) * x);
                            s[n][i][a + 1] = this.encode(this.decode(s[n][i][a + 1]) * y);
                            break;
                        case "rotate":
                            let xx = this.decode(s[n][i][a]);
                            let yy = this.decode(s[n][i][a + 1]);
                            xx = xx * Math.cos(x) + yy * Math.sin(x);
                            yy = yy * Math.cos(x) - xx * Math.sin(x);
                            s[n][i][a] = this.encode(xx);
                            s[n][i][a + 1] = this.encode(yy);
                    }
                }
                s[n][i] = s[n][i].join(" ");
            }
        }
        for (let i = 0; i < s[2].length; i++) {
            s[2][i] = s[2][i].split(" ");
            switch (t) {
                case "translate":
                    s[2][i][1] = this.encode(this.decode(s[2][i][1]) + x);
                    s[2][i][2] = this.encode(this.decode(s[2][i][2]) + y);
                    break;
                case "scale":
                    s[2][i][1] = this.encode(this.decode(s[2][i][1]) * x);
                    s[2][i][2] = this.encode(this.decode(s[2][i][2]) * y);
                    break;
                case "rotate":
                    let xx = this.decode(s[2][i][1]);
                    let yy = this.decode(s[2][i][2]);
                    xx = xx * Math.cos(x) + yy * Math.sin(x);
                    yy = yy * Math.cos(x) - xx * Math.sin(x);
                    s[2][i][1] = this.encode(xx);
                    s[2][i][2] = this.encode(yy);
            }
            s[2][i] = s[2][i].join(" ");
        }
        this.black = s[0];
        this.gray = s[1];
        this.powerups = s[2];
        return this;
    }
    close() {
        this.physics = [],
        this.scenery = [],
        this.powerups = {
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
    }
    set physics(t) {
        return this._physics = t;
    }
    set scenery(t) {
        return this._scenery = t;
    }
    set powerups(t) {
        return this._powerups = t;
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
    get type() {
        return this.mode ? this._scenery : this._physics;
    }
    get dark() {
        if (JSON.parse(localStorage.getItem("dark")))
            return true;
        return false;
    }
}