export default class Manipulation {
    canvas = new OffscreenCanvas(512, 512);
    ctx = this.canvas.getContext("2d");
    image = new Image();
    worker = new Worker("./worker.js");

    /**
     * @param {number} value
     */
    set progress(value) {
        value = ~~value;
        document.title = `Progress... ${value}%`;
        progress.setAttribute("value", value);
    }

    constructor() {
        this.image.crossOrigin = "Anonymous";
        this.image.addEventListener('load', this.render.bind(this));
        this.worker.addEventListener("message", ({ data }) => {
            switch(data.cmd) {
                case 'progress':
                    this.progress = data.progress;
                    break;

                case 'render':
                    svg.innerHTML = data.result;
                    break;
            }
        });
    }

    render() {
        this.progress = 0;
        svg.style.setProperty('width', this.canvas.width = this.image.width);
        svg.style.setProperty('height', this.canvas.height = this.image.height);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        this.worker.postMessage({
            cmd: 'render',
            filter: false,
            invert: invert.checked,
            pixels: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        });
    }
}