export default class Manipulation {
    constructor({ video }) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.physics = "";
        this.scenery = "";
        this.powerups = "";

        this.oppositeScale = 8;

        this.video = video;
        this.videoFrameCallback = null;
        this.video.addEventListener("play", () => {
            this.canvas.width = this.video.videoWidth / this.oppositeScale;
            this.canvas.height = this.video.videoHeight / this.oppositeScale;
            document.title = "Progress... 0%";
            progress.style.width = "0%";
            this.videoFrameCallback = this.video.requestVideoFrameCallback(this.loop.bind(this));
        });
        this.video.addEventListener("ended", () => {
            this.video.cancelVideoFrameCallback(this.videoFrameCallback);
            code.value = `${this.physics}#${this.scenery}#${this.powerups}`;
            document.title = "Ready!";
            progress.innerText = "Done";
            progress.style.width = "100%";
        });
        // this.video.addEventListener("loadeddata", () => this.video.play());

        this.worker = new Worker("./worker.js");
        this.worker.onmessage = ({ data }) => {
            switch(data.cmd) {
                case "progress":
                    document.title = "Progress... " + data.args.value;
                    progress.innerText = data.args.innerText || data.args.value;
                    progress.style.width = data.args.value;
                break;

                case "render":
                    this.physics += data.args.physics;
                    this.scenery += data.args.scenery;
                    this.powerups += data.args.powerups;
                    this.offset.x += this.canvas.width * 10;
                break;

                case "result":
                    document.title = "Ready!";
                    progress.innerText = "Done";
                    progress.style.width = "100%";
                    code.value = `${data.args.physics}#${data.args.scenery}#${data.args.powerups}`;
                break;
            }
        }

        this.offset = {
            x: -(this.canvas.width / 2),
            y: 100
        };
        this.pixels = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    }
    static init(video) {
        new Manipulation({
            video
        });
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
    loop() {
        if (this.video.paused || this.video.ended) return;
        document.title = "Progress... " + Math.round(this.video.currentTime / this.video.duration * 100) + "%";
        progress.innerText = Math.round(this.video.currentTime / this.video.duration * 100) + "%";
        progress.style.width = Math.round(this.video.currentTime / this.video.duration * 100) + "%";
        
        this.render();

        this.videoFrameCallback = this.video.requestVideoFrameCallback(this.loop.bind(this));
    }
    render() {        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        this.pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.putImageData(Manipulation.filter(this.pixels), 0, 0);
        invert.checked && this.ctx.putImageData(Manipulation.invert(this.pixels), 0, 0);

        this.worker.postMessage({
            cmd: "render",
            args: {
                canvas: {
                    width: this.canvas.width,
                    height: this.canvas.height
                },
                physics: "",
                scenery: "",
                powerups: "",
                offset: this.offset,
                pixels: this.pixels
            }
        });

        return this;
    }
}