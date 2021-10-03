export default class {
    constructor(svg) {
        this.svg = svg;
    }
    svg = document.createElement("svg");
    #font = "16px Arial, helvetica, sans-serif";
    #strokeStyle = "#000000";
    #fillStyle = "#000000";
    set font(font) {
        this.#font = font;
    }
    set strokeStyle(color) {
        this.#strokeStyle = color;
    }
    set fillStyle(color) {
        this.#fillStyle = color;
    }
    fillText(text, x, y) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "text");
        element.setAttribute("x", x);
        element.setAttribute("y", y);
        element.setAttribute("font", this.#font);
        element.setAttribute("fill", this.#fillStyle);
        element.innerHTML = text;

        this.svg.prepend(element);

        return this;
    }
    fillRect(x, y, width, height) {
        const element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        element.setAttribute("x", x);
        element.setAttribute("y", y);
        element.setAttribute("width", width);
        element.setAttribute("height", height);
        element.setAttribute("fill", this.#fillStyle);
        element.setAttribute("stroke", this.#strokeStyle);

        this.svg.prepend(element);

        return this;
    }
}