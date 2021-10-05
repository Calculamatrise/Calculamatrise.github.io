import Tool from "./Tool.js";

export default class extends Tool {
    static id = "circle";

    size = 4;
    element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    init() {
        let sumX = this.mouse.position.x - this.mouse.pointA.x;
        if (sumX < 0) {
            sumX *= -1;
        }

        let sumY = this.mouse.position.y - this.mouse.pointA.y;
        if (sumY < 0) {
            sumY *= -1;
        }

        let radius = sumX + sumY;
        if (radius < 0) {
            radius *= -1;
        }

        this.element.setAttribute("r", radius / Math.PI * 2);
        this.element.setAttribute("stroke-width", this.size);
        this.element.setAttribute("cx", this.mouse.pointA.x);
        this.element.setAttribute("cy", this.mouse.pointA.y);
        this.element.setAttribute("stroke", this.canvas.primary);
        this.element.setAttribute("fill", this.canvas.fill ? this.canvas.primary : "#FFFFFF00");
    }
    mouseDown() {
        this.element.setAttribute("stroke-width", this.size);
        this.element.setAttribute("cx", this.mouse.pointA.x);
        this.element.setAttribute("cy", this.mouse.pointA.y);
        this.element.setAttribute("r", 1);
        this.element.setAttribute("stroke", this.canvas.primary);
        this.element.setAttribute("fill", this.canvas.fill ? this.canvas.primary : "#FFFFFF00");
        this.canvas.view.querySelector(`g[data-id='${this.canvas.layer.id}']`).appendChild(this.element);
    }
    mouseMove() {
        let sumX = this.mouse.position.x - this.mouse.pointA.x;
        if (sumX < 0) {
            sumX *= -1;
        }

        let sumY = this.mouse.position.y - this.mouse.pointA.y;
        if (sumY < 0) {
            sumY *= -1;
        }

        let radius = sumX + sumY;
        if (radius < 0) {
            radius *= -1;
        }

        this.element.setAttribute("r", radius / Math.PI * 2);
    }
    mouseUp() {
        this.element.remove();
        
        const circle = this.element.cloneNode();
        circle.erase = function(event) {
            let vector = {
                x: (parseInt(this.getAttribute("r")) - window.canvas.viewBox.x) - (parseInt(this.getAttribute("cx")) - window.canvas.viewBox.x),
                y: (parseInt(this.getAttribute("r")) - window.canvas.viewBox.y) - (parseInt(this.getAttribute("cy")) - window.canvas.viewBox.y)
            }
            let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            let b = (event.offsetX - (parseInt(this.getAttribute("cx")) - window.canvas.viewBox.x)) * (vector.x / len) + (event.offsetY - (parseInt(this.getAttribute("cy")) - window.canvas.viewBox.y)) * (vector.y / len);
            const v = {
                x: 0,
                y: 0
            }

            if (b <= 0) {
                v.x = parseInt(this.getAttribute("cx")) - window.canvas.viewBox.x;
                v.y = parseInt(this.getAttribute("cy")) - window.canvas.viewBox.y;
            } else if (b >= len) {
                v.x = parseInt(this.getAttribute("r")) - window.canvas.viewBox.x;
                v.y = parseInt(this.getAttribute("r")) - window.canvas.viewBox.y;
            } else {
                v.x = (parseInt(this.getAttribute("cx")) - window.canvas.viewBox.x) + vector.x / len * b;
                v.y = (parseInt(this.getAttribute("cy")) - window.canvas.viewBox.y) + vector.y / len * b;
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
        }

        if (!this.canvas.layer.hidden) {
            this.canvas.view.querySelector(`g[data-id='${this.canvas.layer.id}']`).appendChild(circle);
        }

        this.canvas.layer.lines.push(circle);
        this.canvas.events.push({
            action: "add",
            value: circle
        });
    }
}