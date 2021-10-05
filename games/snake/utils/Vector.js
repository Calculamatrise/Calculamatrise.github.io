export default class {
    constructor(x = 0, y = 0) {
        if (typeof x === "object") {
            if (x.hasOwnProperty("x")) {
                this.x = parseFloat(x.x);
            }

            if (x.hasOwnProperty("y")) {
                this.y = parseFloat(x.y);
            }
        } else {
            this.x = parseFloat(x);
            this.y = parseFloat(y);
        }
    }
    get length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    copy(a) {
        this.x = a.x;
        this.y = a.y;

        return this;
    }
    addToSelf(a) {
        this.x += a.x;
        this.y += a.y;

        return this;
    }
    subtractFromSelf(a) {
        this.x -= a.x;
        this.y -= a.y;

        return this;
    }
    scaleSelf(a) {
        this.x *= a;
        this.y *= a;

        return this;
    }
    lerp(target, alpha) {
        this.x = (1 - alpha) * this.x + alpha * target.x;
        this.y = (1 - alpha) * this.y + alpha * target.y;

        return this;
    }
    lerpTowards(target, smoothing, delta) {
        return this.lerp(target, 1 - Math.pow(smoothing, delta));
    }
    add(a) {
        return new this.constructor(this.x + a.x,this.y + a.y);
    }
    sub(a) {
        return new this.constructor(this.x - a.x,this.y - a.y);
    }
    scale(a) {
        return new this.constructor(this.x * a,this.y * a);
    }
    oppositeScale(a) {
        return new this.constructor(this.x / a,this.y / a);
    }
    dot(a) {
        return this.x * a.x + this.y * a.y;
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    distanceTo(a) {
        return Math.sqrt((this.x - a.x) ** 2 + (this.y - a.y) ** 2);
    }
    distanceToSquared(a) {
        return (this.x - a.x) ** 2 + (this.y - a.y) ** 2;
    }
    equals(vector) {
        return vector.x === this.x && vector.y === this.y;
    }
    diff(vector, velocity) {
        switch(velocity.x) {
            case 1:
                return this.x >= vector.x;

            case -1:
                return this.x <= vector.x;
        }

        switch(velocity.y) {
            case 1:
                return this.y >= vector.y;

            case -1:
                return this.y <= vector.y;
        }
    }
    clone() {
        return new this.constructor(this.x,this.y);
    }
    toString() {
        return Math.round(this.x).toString(32) + " " + Math.round(this.y).toString(32);
    }
}