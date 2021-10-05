import Tool from "./Tool.js";

export default class extends Tool {
    static id = "line";
    size = 4;
    element = document.createElementNS("http://www.w3.org/2000/svg", "line");
    mouseDown(event) {
        this.element.setAttribute("stroke-width", this.size);
        this.element.setAttribute("x1", this.mouse.pointA.x);
        this.element.setAttribute("y1", this.mouse.pointA.y);
        this.element.setAttribute("x2", this.mouse.position.x);
        this.element.setAttribute("y2", this.mouse.position.y);
        this.element.setAttribute("stroke", this.canvas.primary);
        this.canvas.view.querySelector(`g[data-id='${this.canvas.layer.id}']`).appendChild(this.element);
    }
    mouseMove(event) {
        this.element.setAttribute("stroke-width", this.size);
        this.element.setAttribute("x1", this.mouse.pointA.x);
        this.element.setAttribute("y1", this.mouse.pointA.y);
        this.element.setAttribute("x2", this.mouse.position.x);
        this.element.setAttribute("y2", this.mouse.position.y);
        this.element.setAttribute("stroke", this.canvas.primary);
    }
    mouseUp(event) {
        this.element.remove();
        if (this.mouse.pointA.x === this.mouse.pointB.x && this.mouse.pointA.y === this.mouse.pointB.y) {
            return;
        }
        
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("stroke-width", this.size);
        line.setAttribute("x1", this.mouse.pointA.x);
        line.setAttribute("y1", this.mouse.pointA.y);
        line.setAttribute("x2", this.mouse.pointB.x);
        line.setAttribute("y2", this.mouse.pointB.y);
        line.setAttribute("stroke", this.canvas.primary);
        line.erase = function(event) {
            let vector = {
                x: (parseInt(this.getAttribute("x2")) - window.canvas.viewBox.x) - (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x),
                y: (parseInt(this.getAttribute("y2")) - window.canvas.viewBox.y) - (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y)
            }
            let len = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            let b = (event.offsetX - (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x)) * (vector.x / len) + (event.offsetY - (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y)) * (vector.y / len);
            const v = {
                x: 0,
                y: 0
            }

            if (b <= 0) {
                v.x = parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x;
                v.y = parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y;
            } else if (b >= len) {
                v.x = parseInt(this.getAttribute("x2")) - window.canvas.viewBox.x;
                v.y = parseInt(this.getAttribute("y2")) - window.canvas.viewBox.y;
            } else {
                v.x = (parseInt(this.getAttribute("x1")) - window.canvas.viewBox.x) + vector.x / len * b;
                v.y = (parseInt(this.getAttribute("y1")) - window.canvas.viewBox.y) + vector.y / len * b;
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
            this.canvas.view.querySelector(`g[data-id='${this.canvas.layer.id}']`).appendChild(line);
        }

        this.canvas.layer.lines.push(line);
        this.canvas.events.push({
            action: "add",
            value: line
        });
    }
}