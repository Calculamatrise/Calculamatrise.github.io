import Line from "../tools/Line.js";
import Brush from "../tools/Brush.js";
import Curve from "../tools/Curve.js";
import Circle from "../tools/Circle.js";
import Ellipse from "../tools/Ellipse.js";
import Rectangle from "../tools/Rectangle.js";
import Text from "../tools/Text.js";
import Eraser from "../tools/Eraser.js";
import Camera from "../tools/Camera.js";
import Select from "../tools/Select.js";

export default class {
    constructor(parent) {
        this.canvas = parent;
        this.cache.set("brush", new Brush(this));
        this.cache.set("camera", new Camera(this));
        this.cache.set("curve", new Curve(this));
        this.cache.set("circle", new Circle(this));
        this.cache.set("ellipse", new Ellipse(this));
        this.cache.set("eraser", new Eraser(this));
        this.cache.set("line", new Line(this));
        this.cache.set("rectangle", new Rectangle(this));
        this.cache.set("select", new Select(this));
        this.cache.set("text", new Text(this));
    }
    cache = new Map();
    _selected = "line";
    get selected() {
        return this.cache.get(this._selected);
    }

    set selected(toolName) {
        if (!this.cache.has(toolName)) {
            throw new Error(`Hmm. What's a "${toolName}" tool?`);
        }

        if (this._selected === toolName.toLowerCase()) {
            return;
        }

        this.selected.close();

        this._selected = toolName.toLowerCase();

        this.selected.init();

        clearTimeout(this.canvas.text.timeout);
		
		this.canvas.view.parentElement.style.cursor = this._selected === "camera" ? "move" : "default";

		this.canvas.text.innerHTML = this._selected.charAt(0).toUpperCase() + this._selected.slice(1);
		this.canvas.text.setAttribute("x", this.canvas.view.width / 2 + this.canvas.view.x - this.canvas.text.innerHTML.length * 2.5);
		this.canvas.text.setAttribute("y", 25 + this.canvas.view.y);
		this.canvas.text.setAttribute("fill", this.canvas.dark ? "#fbfbfb" : "1b1b1b");
		this.canvas.view.appendChild(this.canvas.text);

        const primary = this.canvas.container.querySelector("#primary");
        const secondary = this.canvas.container.querySelector("#secondary");
        if ([
            "line",
            "brush",
            "curve",
            "circle",
            "dynamic_circle",
            "rectangle"
        ].includes(toolName.toLowerCase())) {
            primary.parentElement.style.setProperty("display", "flex");
            secondary.parentElement.style.setProperty("display", "flex");
        } else {
            primary.parentElement.style.setProperty("display", "none");
            secondary.parentElement.style.setProperty("display", "none");
        }
        
		this.canvas.text.timeout = setTimeout(() => {
			this.canvas.text.remove();
		}, 2000);
    }

    select(toolName) {
        return this.selected = toolName.toLowerCase();
    }

    isSelected(toolName) {
        return toolName.toLowerCase() === this.selected.toLowerCase();
    }
}