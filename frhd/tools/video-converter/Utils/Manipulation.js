export default class Manipulation {
    constructor(view) {
        this.canvas = view;
        this.ctx = this.canvas.getContext("2d");
        this.pixels = this.ctx.createImageData(this.canvas.width, this.canvas.height);

        this.video.addEventListener("play", () => {
            document.title = "Progress... 0%";
            progress.style.width = "0%";
            this.videoFrameCallback = this.video.requestVideoFrameCallback(this.render.bind(this));
        });
        this.video.addEventListener("ended", () => {
            this.video.cancelVideoFrameCallback(this.videoFrameCallback);
            this.worker.postMessage({
                cmd: "fetch"
            });
        });
        this.video.addEventListener("loadeddata", () => {
            this.canvas.width = this.video.videoWidth / this.oppositeScale;
            this.canvas.height = this.video.videoHeight / this.oppositeScale;
            this.worker.postMessage({
                cmd: "init",
                args: {
                    width: this.canvas.width
                }
            });
            this.video.play();
        });

        this.worker = new Worker("./worker.js");
        this.worker.onmessage = ({ data }) => {
            switch(data.cmd) {
                case "result":
                    document.title = "Ready!";
                    progress.innerText = "Done";
                    progress.style.width = "100%";
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

    oppositeScale = 4;
    videoFrameCallback = null;
    video = document.createElement("video");
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

    init(video) {
        this.video.src = video;
    }

    render() {
        document.title = "Progress... " + Math.round(this.video.currentTime / this.video.duration * 100) + "%";
        progress.innerText = Math.round(this.video.currentTime / this.video.duration * 100) + "%";
        progress.style.width = Math.round(this.video.currentTime / this.video.duration * 100) + "%";

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        this.pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

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

        this.videoFrameCallback = this.video.requestVideoFrameCallback(this.render.bind(this));
    }
}