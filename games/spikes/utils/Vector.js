export default class {
    constructor(x, y) {
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

    lerp(target, alpha) {
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
}