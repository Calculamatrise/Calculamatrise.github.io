export default class Manipulation {
    constructor() {
        this.image.crossOrigin = "Anonymous";
        this.image.onload = this.render.bind(this);
        this.worker.addEventListener("message", ({ data }) => {
            switch(data.cmd) {
                case "move":
                    code.value = data.result;
                    break;

                case "progress":
                    this.progress = data.progress;
                    break;

                case "render":
                    this.image.value = null;
                    if (~~data.size > 16e4) {
                        if (!confirm("The track is a little large; would you like to download the edited track instead?")) return;
                        let date = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString().split(/t/i);
                        let link = document.createElement("a");
                        let file = new Blob([data.result], {
                            type: "text/plain"
                        });
                        link.href = URL.createObjectURL(file);
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
    image = new Image();
    worker = new Worker("./worker.js");
    /**
     * @param {Number} value
     */
    set progress(value) {
        value = `${~~value}%`;
        document.title = `Progress... ${value}`;
        progress.innerText = value;
        progress.style.setProperty("width", value);
    }

    render() {
        this.progress = 0;
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        this.worker.postMessage({
            cmd: "render",
            filter: true,
            invert: invert.checked,
            pixels: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        });
    }
}