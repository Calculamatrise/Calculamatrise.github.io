export default class {
    constructor(worker) {
        let code = (input.value || "-18 1i 18 1i##").split("#").map(t => t.split(/\u002C+/g).map(t => t.split(/\s+/g)));
        this._physics = code[0];
        this._scenery = code[1];
        this._powerups = code[2];

        this.worker = worker;
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
        
        return this;
    }
    get code() {
        return this.physics + "#" + this.scenery + "#" + this.powerups;
    }
}