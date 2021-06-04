class Manipulation {
    constructor({ image }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.solid = new Array();
        this.scenery = new Array();

        this.image = new Image();
        this.image.src = image;
        this.image.crossOrigin = "Anonymous";
        this.image.onload = () => this.render();

        this.pixels = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    }
    static get fileReader() {
        this.reader = new FileReader();
        this.reader.onload = function() {
            code.value = null;

            new Manipulation({
                image: this.result
            });
        }

        return this.reader;
    }
    render() {
        this.canvas.width = size.checked ? this.image.width : 300;
        this.canvas.height = size.checked ? this.image.height : 300;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        this.pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        document.title = "Progress... 0%";

        for (let t = 0; t in this.pixels.data; t += 4) {
            const x = t / 4 % this.canvas.width;
            const y = Math.ceil(t / 4 / this.canvas.width);
            // const average = (this.pixels.data[t] + this.pixels.data[t + 1] + this.pixels.data[t + 2]) / 3;
            const bw = this.pixels.data[t] * .2 + this.pixels.data[t + 1] * .7 + this.pixels.data[t + 2] * .1;
            
            this.pixels.data[t] = this.pixels.data[t + 1] = this.pixels.data[t + 2] = bw <= 85 ? 0 : bw <= 170 || bw < 210 && x % 2 == 0 && y % 2 == 0 ? 170 : 255;

            if (x == 0) document.title = "Progress... " + Math.round(y / (this.canvas.height / 100)) + "%";
            if (this.pixels.data[t] > 210) continue;

            new Line({
                x: x,
                y: y,
                dx: x + 2,
                dy: y + 2
            }).filter({
                solid: this.solid,
                scenery: this.scenery,
                type: this.pixels.data[t]
            });
        }

        this.ctx.putImageData(this.pixels, 0, 0);

        document.title = "Ready... 100%";

        code.value = this.solid.filter(t => t != null).map(t => t.encode.toString()).join(",") + "#" + this.scenery.filter(t => t != null).map(t => t.encode.toString()).join(",") + "#";
        
        return this;
    }
}

class Line {
    constructor({ x, y, dx, dy }) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
    get encode() {
        this.x = parseInt(this.x).toString(32);
        this.y = parseInt(this.y).toString(32);
        this.dx = parseInt(this.dx).toString(32);
        this.dy = parseInt(this.dy).toString(32);

        return this;
    }
    filter({ solid, scenery, type }) {
        const t = type ? scenery : solid;
        const e = t.findIndex(e => e && this.x == e.dx && this.y == e.dy);
        if (e >= 0) {
            this.x = t[e].x;
            this.y = t[e].y;
            delete t[e];
        }

        t.push(this);

        return this;
    }
    toString() {
        return this.x + " " + this.y + " " + this.dx + " " + this.dy;
    }
}

image.onchange = function() {
    if (this.files.length < 1) return;

    Manipulation.fileReader.readAsDataURL(this.files[0]);
}

code.onclick = function() {
    this.select();
}