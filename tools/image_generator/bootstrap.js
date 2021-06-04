const ctx = canvas.getContext("2d");

let solid = new Array();
let scenery = new Array();

const reader = new FileReader();
reader.onload = function() {
    code.value = null;
    
    solid = new Array();
    scenery = new Array();

    image.src = this.result;
}

const image = new Image();
image.onload = function() {
    canvas.width = size.checked ? this.width : 300;
    canvas.height = size.checked ? this.height : 300;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

	const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	for (let t = 0, x = 0, y = 0; t in pixelData.data; t += 4, x++) {
        const average = (pixelData.data[t] + pixelData.data[t + 1] + pixelData.data[t + 2]) / 3;
		const bw = pixelData.data[t] * .2 + pixelData.data[t + 1] * .7 + pixelData.data[t + 2] * .1;

        if (x >= canvas.width) x = 0, y++;

        // document.title = "Progress... " + Math.round(t / 3) + "%";
    
		pixelData.data[t] = pixelData.data[t + 1] = pixelData.data[t + 2] = bw <= 85 ? 0 : bw <= 170 || bw < 210 && x % 2 == 0 && y % 2 == 0 ? 170 : 255;

        if (pixelData.data[t] > 210) continue;

        const line = new Line({
            x: x,
            y: y,
            dx: x + 2,
            dy: y + 2
        });
        line.filter(pixelData.data[t]);
    }

    ctx.putImageData(pixelData, 0, 0);

    code.value = solid.filter(t => t != null).map(t => t.encode.toString()).join(",") + "#" + scenery.filter(t => t != null).map(t => t.encode.toString()).join(",") + "#";
}
image.crossOrigin = "Anonymous";

img.onchange = function() {
    if (this.files.length < 1) return;

    reader.readAsDataURL(this.files[0]);
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
    filter(type) {
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