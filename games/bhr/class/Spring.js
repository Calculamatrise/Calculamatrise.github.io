import Vector from "./Vector.js";

export default class Spring {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.track = c;
        this.leff = this.lrest = 40;
        this.dampConstant= 0.5;
        this.springConstant = 0.7;
    }
    get length() {
        return this.b.position.sub(this.a.position).length;
    }
    lean(a) {
        this.leff += (this.lrest - a - this.leff) / 5
    }
    rotate(a) {
        var b = this.b.position.sub(this.a.position),
            b = new Vector(-b.y / this.leff,b.x / this.leff);
        this.a.position.addToSelf(b.scale(a));
        this.b.position.addToSelf(b.scale(-a))
    }
    update() {
        var a = this.b.position.sub(this.a.position),
            b = a.length;
        if (1 > b)
            return this;
        a = a.scale(1 / b);
        b = a.scale((b - this.leff) * this.springConstant);
        b.addToSelf(a.scale(this.b.velocity.sub(this.a.velocity).dot(a) * this.dampConstant));
        this.b.velocity.addToSelf(b.scale(-1));
        this.a.velocity.addToSelf(b);
        return this
    }
    swap() {
        var a = new Vector;
        a.copy(this.a.position);
        this.a.position.copy(this.b.position);
        this.b.position.copy(a);
        a.copy(this.a.old);
        this.a.old.copy(this.b.old);
        this.b.old.copy(a);
        a.copy(this.a.velocity);
        this.a.velocity.copy(this.b.velocity);
        this.b.velocity.copy(a);
        a = this.a.rotation;
        this.a.rotation = this.b.rotation;
        this.b.rotation = a
    }
    clone() {
        var a = new Spring(this.a,this.b,this.track);
        a.lrest = this.lrest;
        a.leff = this.leff;
        a.dampConstant= this.dampConstant;
        a.springConstant = this.springConstant;
        return a
    }
}