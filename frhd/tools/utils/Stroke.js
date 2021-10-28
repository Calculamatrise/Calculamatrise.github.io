export default class {
    constructor(points, { strokeWidth, strokeStyle, fillStyle } = {}) {
        if (arguments[0] !== void 0) {
            this.points.push(...points);
            
            this.strokeWidth = strokeWidth;
            this.strokeStyle = strokeStyle;
            this.fillStyle = fillStyle;
        }
    }
    strokeWidth = 4;
    strokeStyle = "#000000";
    fillStyle = "#000000";
    points = []
    addPoints(x, y) {
        if (Array.isArray(arguments[0])) {
            for (const argument of arguments) {
                if (Array.isArray(argument)) {
                    this.addPoints(...argument);
                } else {
                    throw new Error("INVALID OBJECT");
                }
            }

            return;
        }

        for (const argument of arguments) {
            if (Array.isArray(argument)) {
                this.addPoints(...argument);

                continue;
            }
            
            if (isNaN(parseInt(argument))) {
                throw new Error("INVALID VALUE");
            }
        }

        this.points.push(x, y);
    }
    draw(ctx) {
        ctx.save();

        ctx.strokeWidth = this.strokeWidth;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        
        ctx.beginPath();
        for (let i = 0; i in this.points; i += 2) {
            if (i <= 1) {
                ctx.moveTo(this.points[i], this.points[i + 1]);

                continue;
            }

            ctx.lineTo(this.points[i], this.points[i + 1]);
        }

        ctx.stroke();
        ctx.restore();
    }
    erase(event) {
        const points = this.getAttribute("points").split(",").map(function(point) {
            const xAndY = point.split(/\s+/g);

            return {
                x: parseInt(xAndY[0]),
                y: parseInt(xAndY[1])
            }
        });

        return !!points.find((point, index, points) => {
            if (!points[index - 1]) {
                return false;
            }

            let vector = {
                x: (parseInt(points[index - 1].x) - window.canvas.view.x) - (parseInt(point.x) - window.canvas.view.x),
                y: (parseInt(points[index - 1].y) - window.canvas.view.y) - (parseInt(point.y) - window.canvas.view.y)
            }
            let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            let b = (event.offsetX - (parseInt(point.x) - window.canvas.view.x)) * (vector.x / len) + (event.offsetY - (parseInt(point.y) - window.canvas.view.y)) * (vector.y / len);
            const v = {
                x: 0,
                y: 0
            }

            if (b <= 0) {
                v.x = parseInt(point.x) - window.canvas.view.x;
                v.y = parseInt(point.y) - window.canvas.view.y;
            } else if (b >= len) {
                v.x = parseInt(points[index - 1].x) - window.canvas.view.x;
                v.y = parseInt(points[index - 1].y) - window.canvas.view.y;
            } else {
                v.x = (parseInt(point.x) - window.canvas.view.x) + vector.x / len * b;
                v.y = (parseInt(point.y) - window.canvas.view.y) + vector.y / len * b;
            }

            const res = {
                x: event.offsetX - v.x,
                y: event.offsetY - v.y
            }

            len = Math.sqrt(res.x ** 2 + res.y ** 2);
            if (len <= window.canvas.tool.size) {
                this.remove();

                return true;
            }

            return false;
        });
    }
    clone() {
        const clone = new this.constructor(this.points, {
            strokeWidth: this.strokeWidth,
            strokeStyle: this.strokeStyle,
            fillStyle: this.fillStyle
        });

        return clone;
    }
}