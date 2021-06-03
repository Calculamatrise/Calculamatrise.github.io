const ctx = canvas.getContext("2d");

let solid = new Array();
let scenery = new Array();

const reader = new FileReader();
reader.onload = function() {
    image.src = this.result;
}

const image = new Image();
image.onload = function() {
    canvas.width = this.width;
    canvas.height = this.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

    code.value = null;
    
    solid = new Array();
    scenery = new Array();

	const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);

	for (let t = 0; t in pixelData.data; t += 4) {
        const average = (pixelData.data[t] + pixelData.data[t + 1] + pixelData.data[t + 2]) / 3;
		const bw = pixelData.data[t] * .2 + pixelData.data[t + 1] * .7 + pixelData.data[t + 2] * .1;
		
		pixelData.data[t] = pixelData.data[t + 1] = pixelData.data[t + 2] = bw;
    }

    ctx.putImageData(pixelData, 0, 0);

    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const index = (x + y * canvas.width) * 4;
            if (index % 2) return;
            
            const line = new Line({
                x: x,
                y: y,
                dx: x + 2,
                dy: y + 2
            });
            if (pixelData.data[index] <= 85) {
                ctx.strokeStyle = "#000";
                solid.push(line);
            } else if (pixelData.data[index] <= 170) {
                ctx.strokeStyle = "#AAA";
                scenery.push(line);
            } else if (pixelData.data[index] < 210 && x % 2 == 0 && y % 2 == 0) {
                ctx.strokeStyle = "#AAA";
                scenery.push(line);
            }
        }
    }

    code.value = solid.map(t => t.encode.toString()).join(",") + "#" + scenery.map(t => t.encode.toString()).map((t, e, i) => t.dx == i[e + 1]?.x && t.dy == i[e + 1]?.y && (t.dx = i[e + 1]?.dx, t.dy = i[e + 1]?.dy, delete i[e + 1], t)).filter(t => t != null).join(",") + "#";
}
image.crossOrigin = "Anonymous";

img.onchange = function() {
    reader.readAsDataURL(this.files[0]);
}

class Line {
    constructor({ x, y, dx, dy }) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;

        // this.draw();
    }
    get encode() {
        this.x = parseInt(this.x).toString(32);
        this.y = parseInt(this.y).toString(32);
        this.dx = parseInt(this.dx).toString(32);
        this.dy = parseInt(this.dy).toString(32);

        return this;
    }
    draw() {
        console.log(this.x, this.y, this.dx, this.dy)
        // ctx.moveTo(this.x, this.y);
        // ctx.lineTo(this.dx, this.dy);
        // ctx.stroke();

        return this;
    }
    toString() {
        return this.x + " " + this.y + " " + this.dx + " " + this.dy;
    }
}