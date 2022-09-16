export default class Manipulation {
    constructor({ image }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.image = new Image();
        this.image.src = image;
        this.image.crossOrigin = "Anonymous";
        this.image.onload = this.render.bind(this);

        this.worker = new Worker("./worker.js");
        this.worker.onmessage = ({ data }) => {
            switch(data.cmd) {
                case "progress":
                    document.title = "Progress... " + data.args.value;
                    progress.innerText = data.args.innerText || data.args.value;
                    progress.style.width = data.args.value;
                break;

                case "render":
                    svg.innerHTML = data.args.lines;
                break;
            }
        }

        this.pixels = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    }
    static get fileReader() {
        this.reader = new FileReader();
        this.reader.onload = function() {
            new Manipulation({
                image: this.result
            });
        }
        return this.reader;
    }
    static filter(pixels) {
        for (let t = 0, e = 0; t in pixels.data; t += 4) {
            e = pixels.data[t] * .2 + pixels.data[t + 1] * .7 + pixels.data[t + 2] * .1;
            pixels.data[t] = pixels.data[t + 1] = pixels.data[t + 2] = e <= 85 ? 0 : e <= 170 ? 170 : 255;
        }
        return pixels;
    }
    static invert(pixels) {
        for (let t = 0; t in pixels.data; t += 4) {
            pixels.data[t] = 255 - pixels.data[t];
            pixels.data[t + 1] = 255 - pixels.data[t + 1];
            pixels.data[t + 2] = 255 - pixels.data[t + 2];
        }
        return pixels;
    }
    render() {
        this.canvas.width = svg.style.width = this.image.width;
        this.canvas.height = svg.style.height = this.image.height;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        this.pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        document.title = "Progress... 0%";
        progress.style.width = "0%";

        this.worker.postMessage({
            cmd: "render",
            args: {
                canvas: {
                    width: this.canvas.width,
                    height: this.canvas.height
                },
                lines: new String(),
                pixels: invert.checked ? Manipulation.invert(this.pixels) : this.pixels
            }
        });

        return this;
    }
}