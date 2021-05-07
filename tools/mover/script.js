class Track {
    constructor(t) {
        t = t.split("#");
        this.physics = t[0].split(",");
        this.scenery = t[1].split(",");
        this.powerups = t[2];
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
        var powerups = this.powerups.split(",");
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
        for(var i in powerups) {
            switch(powerups[i].charAt(0)) {
                case "T":
                    this.powerups.targets.push(powerups[i]);
                    break;
                case "B":
                    this.powerups.boosters.push(powerups[i]);
                    break;
                case "S":
                    this.powerups.slowmos.push(powerups[i]);
                    break;
                case "O":
                    this.powerups.bombs.push(powerups[i]);
                    break;
                case "G":
                    this.powerups.gravity.push(powerups[i]);
                    break;
                case "A":
                    this.powerups.antigravity.push(powerups[i]);
                    break;
                case "W":
                    this.powerups.teleporters.push(powerups[i]);
                    break;
                case "V":
                    switch(powerups[i].split(" ")[3]) {
                        case "1":
                            this.powerups.vehicles.heli.push(powerups[i]);
                            break;
                        case "2":
                            this.powerups.vehicles.truck.push(powerups[i]);
                            break;
                        case "3":
                            this.powerups.vehicles.balloon.push(powerups[i]);
                            break;
                        case "4":
                            this.powerups.vehicles.blob.push(powerups[i]);
                            break;
                    }
            }
        }
    }
    decodeTrack() {
        if(this.physics[0] != "") {
            var t = this.physics;
            this.physics = [];
            for(var e in t) {
                var i = t[e].split(" ");
                t[e] = [];
                for(var s in i) {
                    t[e].push(this.decode(i[s]))
                }
                this.physics.push(t[e]);
            }
        }
        if(this.scenery[0] != "") {
            var e = this.scenery;
            this.scenery = [];
            for(var i in e) {
                var s = e[i].split(" ");
                e[i] = [];
                for(var n in s) {
                    e[i].push(this.decode(s[n]))
                }
                this.scenery.push(e[i]);
            }
        }
        if(this.powerups[0] != "") {
            var i = this.powerups;
            for(var s in i) {
                if(s != "vehicles") {
                    var n = i[s];
                    i[s] = [];
                    for(var r in n) {
                        var o = n[r].split(" ");
                        n[r] = [o[0]];
                        o = o.slice(1)
                        for(var a in o) {
                            n[r].push(this.decode(o[a]))
                        }
                        i[s].push(n[r]);
                    }
                } else {
                    for(var n in i[s]) {
                        var r = i[s][n];
                        i[s][n] = [];
                        for(var o in r) {
                            var a = r[o].split(" ");
                            r[o] = [a[0]];
                            a = a.slice(1);
                            for(var h in a) {
                                r[o].push(this.decode(a[h]));
                            }
                            i[s][n].push(r[o]);
                        }
                    }
                }
            }
        }
    }
    encodeTrack() {
        var t = this.physics;
        this.physics = [];
        for(var e in t) {
            var i = t[e];
            t[e] = [];
            for(var s in i) {
                t[e].push(this.encode(i[s]))
            }
            this.physics.push(t[e].join(" "));
        }
        var e = this.scenery;
        this.scenery = [];
        for(var i in e) {
            var s = e[i];
            e[i] = [];
            for(var n in s) {
                e[i].push(this.encode(s[n]))
            }
            this.scenery.push(e[i].join(" "));
        }
        var i = this.powerups;
        this.powerups = [];
        for(var s in i) {
            if(s != "vehicles") {
                var n = i[s];
                i[s] = [];
                for(var r in n) {
                    var o = n[r];
                    n[r] = [o[0]];
                    o = o.slice(1)
                    for(var a in o) {
                        n[r].push(this.encode(o[a]))
                    }
                    this.powerups.push(n[r].join(" "));
                }
            } else {
                var e = i[s];
                i[s] = [];
                for(var n in e) {
                    var r = e[n];
                    e[n] = [];
                    for(var o in r) {
                        var a = r[o];
                        r[o] = [a[0]];
                        a = a.slice(1);
                        for(var h in a) {
                            r[o].push(this.encode(a[h]));
                        }
                        i[s].push(r[o].join(" "));
                    }
                }
                this.powerups.push(i[s])
            }
        }
        this.powerups = this.powerups.join(",");
    }
    condense() {
        var t = this.physics;
        for(var e in t) {
            t[e] = t[e].join(" ");
        }
        var e = t.filter((e, i) => t.indexOf(e) == i);
        for(var i in e) {
            e[i] = e[i].split(" ");
        }
        this.physics = e;
        var i = this.scenery;
        for(var s in i) {
            i[s] = i[s].join(" ");
        }
        var s = i.filter((s, n) => t.indexOf(s) == n);
        for(var n in s) {
            s[n] = s[n].split(" ");
        }
        this.scenery = s;
    }
    move(t, e) {
        if(this.physics[0] != "") {
            for(var i in this.physics) {
                this.physics[i] = this.physics[i].map((s, n) => n & 1 ? (e ? parseInt(s) + parseInt(e) : s) : (t ? parseInt(s) + parseInt(t) : s));
            }
        }
        if(this.scenery[0] != "") {
            for(var i in this.scenery) {
                this.scenery[i] = this.scenery[i].map((s, n) => n & 1 ? (e ? parseInt(s) + parseInt(e) : s) : (t ? parseInt(s) + parseInt(t) : s));
            }
        }
        for(var i in this.powerups) {
            if(i != "vehicles") {
                var s = this.powerups[i]
                for(var n in s) {
                    t && (s[n][1] = parseInt(s[n][1]) + parseInt(t));
                    e && (s[n][2] = parseInt(s[n][2]) + parseInt(e));
                    if(i == "teleporters") {
                        t && (s[n][3] = parseInt(s[n][3]) + parseInt(t));
                        e && (s[n][4] = parseInt(s[n][4]) + parseInt(e));
                    }
                }
            } else {
                for(var s in this.powerups[i]) {
                    var n = this.powerups[i][s];
                    for(var r in n) {
                        t && (n[r][1] = parseInt(n[r][1]) + parseInt(t));
                        e && (n[r][2] = parseInt(n[r][2]) + parseInt(e));
                    }
                }
            }
        }
    }
    flip() {
        if(this.physics[0] != "") {
            for(var t in this.physics) {
                this.physics[t] = this.physics[t].map(e => e *= -1);
            }
        }
        if(this.scenery[0] != "") {
            for(var t in this.scenery) {
                this.scenery[t] = this.scenery[t].map(e => e *= -1);
            }
        }
        for(var i in this.powerups) {
            if(i != "vehicles") {
                var s = this.powerups[i]
                for(var n in s) {
                    s[n][1] *= -1;
                    s[n][2] *= -1;
                    if(i == "teleporters") {
                        s[n][3] *= -1;
                        s[n][4] *= -1;
                    }
                }
            } else {
                for(var s in this.powerups[i]) {
                    var n = this.powerups[i][s];
                    for(var r in n) {
                        n[r][1] *= -1;
                        n[r][2] *= -1;
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

var command;

move.onclick = () => {
    command = "move";
    execute();
};
flip.onclick = () => {
    command = "flip";
    execute()
};

execute = () => {
    var t = new Track(input.value);
    switch(command) {
        case "move":
            t.move(travelDistanceX.value, travelDistanceY.value);
            break;
        case "flip":
            t.flip();
            break;
    }
    input.value = t.code;
}

input.onclick = () => input.select();

document.onkeypress = t => {
    switch(t.key) {
        case "Enter":
            execute();
            break;
        case "c":
            document.execCommand("copy");
            break;
    }
}

copy.onclick = () => {
    input.select();
    document.execCommand("copy");
}