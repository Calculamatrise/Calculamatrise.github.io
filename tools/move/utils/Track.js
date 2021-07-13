export default class {
    constructor(t) {
        t = t.split("#").map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));
        this._physics = t[0];
        this._scenery = t[1];
        this._powerups = t[2];

        this.worker = new Worker("./worker.js");
        this.worker.onmessage = ({ data }) => {
            switch(data.cmd) {
                case "move":
                    input.value = data.args.physics + "#" + data.args.scenery + "#" + data.args.powerups;
                break;

                case "progress":
                    document.title = "Progress... " + data.args.value;
                    progress.innerText = data.args.innerText || data.args.value;
                    progress.style.width = data.args.value;
                break;
            }
        }
    }
    move(t = 0, e = 0) {
        this.worker.postMessage({
            cmd: "move",
            args: {
                physics: this._physics,
                scenery: this._scenery,
                powerups: this._powerups,
                x: t | 0,
                y: e | 0
            }
        });
    }
    get code() {
        return this.physics + "#" + this.scenery + "#" + this.powerups;
    }
}