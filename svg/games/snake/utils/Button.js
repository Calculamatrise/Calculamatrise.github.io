export default class {
    constructor(parent, { name, position, click }) {
        this.parent = parent;

        this.name = name;
        this.position = position;
        this.#click = click;
    }
    #click = null;
    #element = null;
    hoverActive = false;
    get width() {
        return this.name.length * 8;
    }
    get height() {
        return 10;
    }
    draw(ctx) {
		ctx.fillStyle = this.parent.dark ? "#FFFFFF80" : "#00000080";
		this.#element = ctx.fillText(this.name, this.position.x, this.position.y);
    }
    hover(mouse) {
        if (mouse.x > this.position.x - 5 && mouse.x < this.position.x + this.width && mouse.y > this.position.y - this.height && mouse.y < this.position.y + 5) {
            this.#element.setAttribute("fill", this.parent.dark ? "#FFFFFF" : "#000000");

            return this.hoverActive = true;
        }

        this.#element.setAttribute("fill", this.parent.dark ? "#FFFFFF80" : "#00000080");
        
        return this.hoverActive = false;
    }
    click() {
        if (this.hoverActive) {
            if (typeof this.#click === "function")
                this.#click();
        }
    }
}