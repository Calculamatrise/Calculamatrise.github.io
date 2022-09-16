export default class {
    constructor(x = 0, y = 0) {
        if (typeof x === "object" && Array.isArray(x)) {
            if (Array.isArray(x)) {
                this.x = parseFloat(x[0]);
                this.y = parseFloat(x[1]);

                return;
            }
            
            if (!x.hasOwnProperty("x") || x.hasOwnProperty("y")) {
                throw new Error("Invalid coords");
            }
            
            this.x = parseFloat(x.x);
            this.y = parseFloat(x.y);

            return;
        }

        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }

    old = {
        x: 0,
        y: 0
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