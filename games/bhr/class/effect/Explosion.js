import Shard from "./Shard.js";

import BodyPart from "../bike/part/BodyPart.js";

export default class Explosion {
    constructor(a, b, c) {
        this.track = c;
        this.motor = 30 + 20 * Math.random();
        this.shards = [
            new Shard(this, a),
            new Shard(this, a),
            new Shard(this, a),
            new Shard(this, a),
            new Shard(this, a)
        ];
        this.pos = a.clone();
        this.gravity = b;
        this.head = new BodyPart(a, this);
        this.head.vel.x = 20
    }
    draw() {
        const ctx = this.track.parent.canvas.getContext("2d");
        var a, b;
        if (0 < this.motor) {
            this.motor -= 10;
            b = this.pos.toPixel();
            var e = b.x + this.motor / 2 * Math.cos(Math.random() * 2 * Math.PI)
            , d = b.y + this.motor / 2 * Math.sin(Math.random() * 2 * Math.PI);
            ctx.save();
            ctx.fillStyle = "#ff0";
            ctx.beginPath(),
            ctx.moveTo(b.x + this.motor / 2 * Math.cos(Math.random() * 2 * Math.PI), d);
            for (a = 1; 16 > a; a++) {
                d = (this.motor + 30 * Math.random()) / 2,
                e = b.x + d * Math.cos(Math.random() * 2 * Math.PI + 2 * Math.PI * a / 16),
                d = b.y + d * Math.sin(Math.random() * 2 * Math.PI + 2 * Math.PI * a / 16),
                ctx.lineTo(e, d);
            }
            ctx.fill();
            ctx.restore();
        }
        a = 0;
        for (b = this.shards.length; a < b; a++)
            this.shards[a].draw()
    }
    update() {
        for (var a = this.shards.length - 1; 0 <= a; a--)
            this.shards[a].update()
    }
}