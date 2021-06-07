export default class Manipulation {
    constructor({ image }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.solid = new Array();
        this.scenery = new Array();

        this.image = new Image();
        this.image.src = image;
        this.image.crossOrigin = "Anonymous";
        this.image.onload = () => this.render_style_2();

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

        for (let t = 0, x = 0, y = 0; t in this.pixels.data; t += 4, x++) {
			const bw = this.pixels.data[t] * .2 + this.pixels.data[t + 1] * .7 + this.pixels.data[t + 2] * .1;

			if (x >= canvas.width) {
				document.title = "Progress... " + Math.round(y / (this.canvas.height / 100)) + "%";
				x = 0;
				y++;
			}
		
			this.pixels.data[t] = this.pixels.data[t + 1] = this.pixels.data[t + 2] = bw <= 85 ? 0 : bw <= 170 ? 170 : 255;

			if (this.pixels.data[t] == 255) continue;

			let type = this.pixels.data[t] ? this.scenery : this.solid;

            let line = [
                x.toString(32),
                y.toString(32),
                (x + 2).toString(32),
                (y + 2).toString(32)
            ];

			const e = type.find(t => t && line[0] == t[2] && line[1] == t[3]);
			if (e) {
				e[2] = line[2];
				e[3] = line[3]
			} else {
				type.push(line);
			}
		}

        this.ctx.putImageData(this.pixels, 0, 0);

        document.title = "Ready... 100%";

        code.value = this.solid.map(t => t.join(" ")).join(",") + "#" + this.scenery.map(t => t.join(" ")).join(",") + "#";
        
        return this;
    }
    render_style_2() {
        this.canvas.width = size.checked ? this.image.width : 300;
        this.canvas.height = size.checked ? this.image.height : 300;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        this.pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        document.title = "Progress... 0%";

        for (let y = 0, iy, dy, ay; y < this.canvas.height; y++) {
            for (let x = 0, ix, dx; x < this.canvas.width; x++) {
                const t = (x + y * this.canvas.width) * 4;
                const i = this.pixels.data[t] * .2 + this.pixels.data[t + 1] * .7 + this.pixels.data[t + 2] * .1;
                
                this.pixels.data[t] = this.pixels.data[t + 1] = this.pixels.data[t + 2] = i <= 85 ? 0 : i <= 170 ? 170 : 255;

                if (this.pixels.data[t] == 255) continue;
                let type = this.pixels.data[t] ? this.scenery : this.solid;

                ix = (x * 2).toString(32);
                iy = dy = (y * 2).toString(32);
                dx = ((x * 2) + 2).toString(32);
                ay = ((y * 2) - 1).toString(32);

                const r = type.find(t => t && t[2] == ix && t[3] == iy);
                if (r) {
                    r[2] = dx;
                } else {
                    type.push([ix, iy, dx, dy]);
			    }

                const o = type.find(t => t && t[2] == ix && t[3] == ay);
                if (o) {
                    o[2] = dx;
                } else {
                    type.push([ix, ay, dx, ay]);
			    }
            }
            document.title = "Progress... " + Math.round(y / (this.canvas.height / 100)) + "%";
        }

        this.ctx.putImageData(this.pixels, 0, 0);

        document.title = "Ready... 100%";

        code.value = this.solid.map(t => t.join(" ")).join(",") + "#" + this.scenery.map(t => t.join(" ")).join(",") + "#";
        
        return this;
    }
}