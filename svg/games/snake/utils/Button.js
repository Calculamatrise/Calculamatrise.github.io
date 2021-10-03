export default class {
    constructor({ name, position, click }) {
        this.name = name;
        this.position = position;
        this.#click = click;
    }
    #click = null;
    hoverActive = false;
    get width() {
        return this.name.length * 5;
    }
    get height() {
        return 10;
    }
    draw(ctx) {
		ctx.fillStyle = `${JSON.parse(localStorage.getItem("dark")) ? "#FFFFFF" : "#000000"}${this.hoverActive ? "" : "A5"}`;
		ctx.fillText(this.name, this.position.x, this.position.y);
    }
    hover(mouse) {
        if (mouse.x > this.position.x - 5 && mouse.x < this.position.x + this.width && mouse.y > this.position.y - this.height && mouse.y < this.position.y + 5)
            return this.hoverActive = true;
        
        return this.hoverActive = false;
    }
    click() {
        if (this.hoverActive) {
            if (typeof this.#click === "function")
                this.#click();
        }
    }
}