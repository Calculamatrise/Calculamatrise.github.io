class Track {
    constructor(t) {
        t = t.split("#").map(t => t?.split(/\u002C+/g));
        this.black = t[0].map(t => t.split(/\s+/g).map(t => Track.decode(t))) || [];
        this.grey = t[1].map(t => t.split(/\s+/g).map(t => Track.decode(t))) || [];
        this.powerups = t[2].map(t => t.split(/\s+/g).map((t, e, i) => (i[0] == "V" ? e > 0 && e < 3 : e > 0) ? Track.decode(t) : t)) || [];
    }
    static decode(t) {
        return parseInt(t, 32);
    }
    static encode(t) {
        return t.toString(32);
    }
    move(x = 0, y = 0) {
        for (const t of this.black) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += x;
                t[e + 1] += y;
            }
        }
        for (const t of this.grey) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] += x;
                t[e + 1] += y;
            }
        }
        for (const t of this.powerups) {
            for (let e = 1; e < t.length; e += 2) {
                if (t[0] == "V" && e > 2) continue;
                t[e] += x;
                t[e + 1] += y;
            }
        }
        return this;
    }
    rotate(x = 0) {
        x *= Math.PI / 180;
        for (const t of this.black) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] = Math.round(t[e] * Math.cos(x) + t[e + 1] * Math.sin(x));
                t[e + 1] = Math.round(t[e + 1] * Math.cos(x) + t[e] * Math.sin(x));
            }
        }
        for (const t of this.grey) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] = Math.round(t[e] * Math.cos(x) + t[e + 1] * Math.sin(x));
                t[e + 1] = Math.round(t[e + 1] * Math.cos(x) + t[e] * Math.sin(x));
            }
        }
        for (const t of this.powerups) {
            for (let e = 0; e < t.length; e += 2) {
                if (t[0] == "V" && e > 2) continue;
                t[e] = Math.round(t[e] * Math.cos(x) + t[e + 1] * Math.sin(x));
                t[e + 1] = Math.round(t[e + 1] * Math.cos(x) + t[e] * Math.sin(x));
            }
        }
        return this;
    }
    scale(x = 1, y = 1) {
        for (const t of this.black) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] *= x;
                t[e + 1] *= y;
            }
        }
        for (const t of this.grey) {
            for (let e = 0; e < t.length; e += 2) {
                t[e] *= x;
                t[e + 1] *= y;
            }
        }
        for (const t of this.powerups) {
            for (let e = 1; e < t.length; e += 2) {
                if (t[0] == "V" && e > 2) continue;
                t[e] *= x;
                t[e + 1] *= y;
            }
        }
        return this;
    }
    get export() {
        return this.black.map(t => t.map(t => Track.encode(t)).join(" ")).join(",") + "#" + this.grey.map(t => t.map(t => Track.encode(t)).join(" ")).join(",") + "#" + this.powerups.map(t => t.map((t, e, i) => (i[0] == "V" ? e > 0 && e < 3 : e > 0) ? Track.encode(t) : t)).map(t => t.join(" ")).join(",");
    }
}

transform.onclick = function() {
    const track = new Track(input.value)
        .move(parseInt(move_x.value) || 0, parseInt(move_y.value) || 0)
        .scale(parseInt(scale_x.value) || 1, parseInt(scale_y.value) || 1)
        .rotate(parseInt(rotate.value) || 0);
    output.value = track.export;
    chars.innerText = output.value.length.toString().slice(0, -3) || 0;
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