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
                case "move":
                    code.value = data.args.physics + "#" + data.args.scenery + "#" + data.args.powerups;
                    break;

                case "progress":
                    document.title = "Progress... " + data.args.value;
                    progress.innerText = data.args.innerText || data.args.value;
                    progress.style.width = data.args.value;
                    break;

                case "result":
                    if (+data.args.size > 16e4 && confirm("The track is a little large; would you like to download the edited track instead?")) {
                        let date = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString().split(/t/i);
                        let link = document.createElement("a");
                        let file = new Blob([data.args.code], {
                            type: "text/plain"
                        });
                        link.href = window.URL.createObjectURL(file);
                        link.download = "frhd_track_" + date[0] + "_" + date[1].replace(/\..+/, "").replace(/:/g, "-");
                        link.click();

                        return;
                    }

                    code.value = data.args.code;
                    break;
            }
        }
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

        document.title = "Progress... 0%";
        progress.style.width = "0%";

        this.ctx.putImageData(Manipulation.filter(this.pixels), 0, 0);
        invert.checked && this.ctx.putImageData(Manipulation.invert(this.pixels), 0, 0);

        this.worker.postMessage({
            cmd: "render",
            args: {
                pixels: this.pixels,
                width: this.canvas.width,
                height: this.canvas.height
            }
        });

        return this;
    }
}