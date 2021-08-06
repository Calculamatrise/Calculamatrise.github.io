export default class {
    constructor(t, e, i, s) {
        this.ix = t;
        this.iy = e;
        this.dx = i;
        this.dy = s;
    }
    draw(t) {
        t.moveTo(this.ix, this.iy),
        t.lineTo(this.dx, this.dy);
        return t;
    }
}