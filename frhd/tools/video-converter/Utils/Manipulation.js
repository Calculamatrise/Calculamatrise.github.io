export default class {
    constructor(view) {
        this.canvas = view;
        this.ctx = this.canvas.getContext("2d");
        this.video.addEventListener("play", () => {
            this.progress = 0;
            this.videoFrameCallback = this.video.requestVideoFrameCallback(this.loop.bind(this));
        });

        this.video.addEventListener("ended", () => {
            this.worker.postMessage({
                cmd: "fetch"
            });
        });

        this.video.addEventListener("loadeddata", () => {
            this.canvas.width = this.video.videoWidth * this.#scale;
            this.canvas.height = this.video.videoHeight * this.#scale;
            this.worker.postMessage({
                cmd: "init",
                width: this.video.videoWidth * this.#scale
            });
        });

        this.worker.addEventListener("message", ({ data }) => {
            switch(data.cmd) {
                case "init":
                    this.video.play();
                    break;

                case "fetch":
                    document.title = "Ready!";
                    progress.innerText = "Done";
                    progress.style.width = "100%";
                    if (~~data.size > 16e4) {
                        if (!confirm("The track is a little large; would you like to download the edited track instead?")) return;
                        let date = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString().split(/t/i);
                        let link = document.createElement("a");
                        let file = new Blob([data.result], {
                            type: "text/plain"
                        });
                        link.href = window.URL.createObjectURL(file);
                        link.download = "frhd_track_" + date[0] + "_" + date[1].replace(/\..+/, "").replace(/:/g, "-");
                        link.click();
                        return;
                    }

                    code.value = data.result;
                    break;
            }
        });
    }
    canvas = new OffscreenCanvas(512, 512);
    ctx = this.canvas.getContext("2d");
    scale = -4;
    video = document.createElement("video");
    worker = new Worker("./worker.js");
    get #scale() {
        return Math.abs(this.scale / this.scale ** 2);
    }

    /**
     * @param {Number} value
     */
    set progress(value) {
        value = `${~~value}%`;
        document.title = `Progress... ${value}`;
        progress.innerText = value;
        progress.style.setProperty("width", value);
    }

    loop() {
        this.render();
        this.render();

        this.progress = Math.round(this.video.currentTime / this.video.duration * 100);
        this.video.requestVideoFrameCallback(this.loop.bind(this));
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        this.worker.postMessage({
            cmd: "render",
            filter: true,
            invert: invert.checked,
            pixels: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        });
    }
}