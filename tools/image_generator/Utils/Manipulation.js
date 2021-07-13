export default class Manipulation {
    constructor({ image }) {
        this.canvas = canvas;
        this.canvas.onmousedown = e => this.mouseEvent({ event: e, type: "down" });
        this.canvas.onmousemove = e => this.mouseEvent({ event: e, type: "move" });
        this.canvas.onmouseup = e => this.mouseEvent({ event: e, type: "up" });
        this.ctx = this.canvas.getContext("2d");

        this.image = new Image();
        this.image.src = image;
        this.image.crossOrigin = "Anonymous";
        this.image.onload = () => this.render();

        this.mouse = {
            down: false,
            pos: {
                x: 0,
                y: 0
            },
            old: {
                x: 0,
                y: 0
            }
        }

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

                case "render":
                    code.value = `${data.args.physics}#${data.args.scenery}#`;
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
    mouseEvent({ event, type }) {
        switch(type) {
            case "down":
                this.mouse.down = true;
                this.mouse.pos = {
                    x: event.offsetX,
                    y: event.offsetY
                }
                this.mouse.old = {
                    x: event.offsetX,
                    y: event.offsetY
                }
            break;

            case "move":
                this.mouse.pos = {
                    x: event.offsetX,
                    y: event.offsetY
                }
                if (this.mouse.down) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.drawImage(this.image, this.mouse.pos.x - this.mouse.old.x, this.mouse.pos.y - this.mouse.old.y, this.canvas.width, this.canvas.height);
                    this.pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    this.ctx.putImageData(Manipulation.filter(this.pixels), 0, 0);
                }
            break;

            case "up":
                this.mouse.down = false;
                this.mouse.pos = {
                    x: event.offsetX,
                    y: event.offsetY
                }
                // this.worker.postMessage({
                //     cmd: "move",
                //     args: {
                //         x: this.mouse.pos.x,
                //         y: this.mouse.pos.y,
                //         physics: code.value.split(/#/g)[0],
                //         scenery: code.value.split(/#/g)[1]
                //     }
                // });
            break;
        }
    }
    render() {
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
                canvas: {
                    width: this.canvas.width,
                    height: this.canvas.height
                },
                physics: new String(),
                scenery: new String(),
                pixels: this.pixels
            }
        });

        return this;
    }
}