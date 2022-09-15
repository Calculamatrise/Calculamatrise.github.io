class PumpkinHead extends GameInventoryManager.HeadClass {
    static Pumpkin_Head = this;
    static image = new Image(90, 90);
    #cache = {};
    constructor() {
        super();
        this.createVersion();
    }

    getVersions() {
        return this.#cache;
    }

    cache(e) {
        const r = this.#cache[this.versionName];
        r.dirty = !1;
        const canvas = r.canvas;
        canvas.width = 105 * (e = Math.max(e, 1)) * 0.25;
        canvas.height = 91 * e * 0.25;
        const ctx = canvas.getContext('2d'),
            z = 0.25 * e;
 
        ctx.save();
        ctx.scale(z, z);
        ctx.save();
        ctx.translate(0, 0);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.beginPath();
        ctx.drawImage(PumpkinHead.image, 0, 0, 90, 90);
        ctx.restore();
    }

    getBaseWidth = () => 105;
    getBaseHeight = () => 91;
    getDrawOffsetX = () => -2;
    getDrawOffsetY = () => -3;
    getScale = () => 0.25;
}

PumpkinHead.image.src = "https://imgur.com/guYyHAV.png";
GameInventoryManager && GameInventoryManager.register('pumpkin_head', PumpkinHead);
exports = PumpkinHead;