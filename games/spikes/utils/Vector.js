export default class {
    old = {
        x: 0,
        y: 0
    }

    constructor(x = 0, y = 0) {
        if (typeof x == 'object') {
            if (x instanceof Array) {
                this.x = parseFloat(x[0] ?? 0);
                this.y = parseFloat(x[1] ?? 0);
            } else {
                this.x = parseFloat(x.x ?? 0);
                this.y = parseFloat(x.y ?? 0);
            }
        } else {
            this.x = parseFloat(x ?? 0);
            this.y = parseFloat(y ?? 0);
        }

        this.old.x = this.x;
        this.old.y = this.y;
    }

    add(vector) {
        this.old.x = this.x;
        this.old.y = this.y;
        this.x += parseFloat(vector.x);
        this.y += parseFloat(vector.y);
        return this;
    }

    sub(vector) {
        this.old.x = this.x;
        this.old.y = this.y;
        this.x -= parseFloat(vector.x);
        this.y -= parseFloat(vector.y);
        return this;
    }

    scale(factor) {
        this.old.x = this.x;
        this.old.y = this.y;
        this.x *= parseFloat(factor);
        this.y *= parseFloat(factor);
        return this;
    }

    lerp(target, alpha) {
        this.old.x = this.x;
        this.old.y = this.y;
        if (target.hasOwnProperty("x")) {
            this.x = (1 - alpha) * this.x + alpha * target.x;
        }

        if (target.hasOwnProperty("y")) {
            this.y = (1 - alpha) * this.y + alpha * target.y;
        }

        return this;
    }

    lerpTowards(target, smoothing, delta) {
        this.lerp(target, 1 - Math.pow(smoothing, delta));
        return this;
    }

    dot(vector) {
        this.old.x = this.x;
        this.old.y = this.y;
        return this.x * vector.x + this.y * vector.y;
    }

    clone() {
        let clone = new this.constructor(this.x, this.y);
        clone.old.x = this.old.x;
        clone.old.y = this.old.y;
        return clone;
    }
}