export default class Manipulation {
    constructor() {
        this.canvas = new OffscreenCanvas(512, 512);
        this.ctx = this.canvas.getContext("2d");
        this.pixels = this.ctx.createImageData(this.canvas.width, this.canvas.height);

        this.image = new Image();
        this.image.crossOrigin = "Anonymous";
        this.image.onload = this.render.bind(this);

        this.worker = new Worker("./worker.js");
        this.worker.onmessage = ({ data }) => {
            switch(data.cmd) {
                case "result":
                    result.value = data.args.hex;
                    color.style.setProperty("background-color", data.args.hex);
                    break;
            }
        }
    }

    static invert(pixels) {
        for (let t = 0; t in pixels.data; t += 4) {
            pixels.data[t] = 255 - pixels.data[t];
            pixels.data[t + 1] = 255 - pixels.data[t + 1];
            pixels.data[t + 2] = 255 - pixels.data[t + 2];
        }
        return pixels;
    }

    init(image) {
        if (typeof this.image.src !== void 0) {
            URL.revokeObjectURL(this.image.src);
        }

        this.image.src = image;
    }

    render() {
        this.worker.postMessage({
            cmd: "init"
        });

        this.canvas.width =  this.image.width;
        this.canvas.height = this.image.height;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        this.pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        invert.checked && this.ctx.putImageData(Manipulation.invert(this.pixels), 0, 0);

        this.worker.postMessage({
            cmd: "render",
            pixels: this.pixels.data
        });

        return this;
    }
}