import Vector from "../Vector.js";

import { ctx } from "../../bootstrap.js";

export default class Shard {
    constructor(parent, a) {
        this.parent = parent;

        this.pos = new Vector(a.x + 5 * (Math.random() - Math.random()),a.y + 5 * (Math.random() - Math.random()));
        this.old = new Vector(this.pos.x,this.pos.y);
        this.vel = new Vector(11 * (Math.random() - Math.random()),11 * (Math.random() - Math.random()));
        this.size = 2 + 9 * Math.random();
        this.rotation = 6.2 * Math.random();
        this.rotationFactor = Math.random() - Math.random();
        this.friction = 0.05;
        this.collide = !0;
        this.shape = [1, 0.7, 0.8, 0.9, 0.5, 1, 0.7, 1]
    }
    draw() {
        var a = this.pos.toPixel(),
            b = this.shape[0] * this.size * this.parent.track.zoom,
            d = a.x + b * Math.cos(this.rotation),
            c = a.y + b * Math.sin(this.rotation);
        ctx.save();
        ctx.beginPath(),
        ctx.moveTo(d, c),
        ctx.fillStyle = this.parent.track.parent.theme.dark ? "#FBFBFB" : "#000000";
        for (let e = 2; 8 > e; e++)
            c = this.shape[e - 1] * this.size * this.parent.track.zoom / 2,
            d = a.x + c * Math.cos(this.rotation + 6.283 * e / 8),
            c = a.y + c * Math.sin(this.rotation + 6.283 * e / 8),
            ctx.lineTo(d, c);
        ctx.fill();
        ctx.restore();
    }
    drive(a) {
        this.pedalSpeed = a.dot(this.vel) / this.size;
        this.pos.addToSelf(a.scale(-a.dot(this.vel) * this.friction));
        this.rotation += this.rotationFactor;
        var b = a.length;
        if (b > 0) {
            a = new Vector(-a.y / b,a.x / b),
            this.old.addToSelf(a.scale(0.8 * a.dot(this.vel)));
        }
    }
    update() {
        this.rotation += this.rotationFactor;
        this.vel.addToSelf(this.parent.gravity);
        this.vel = this.vel.scale(0.99);
        this.pos.addToSelf(this.vel);
        this.touching = !1;
        if (this.collide) {
            this.parent.track.collide(this);
        }
        this.vel = this.pos.sub(this.old);
        this.old.copy(this.pos)
    }
}