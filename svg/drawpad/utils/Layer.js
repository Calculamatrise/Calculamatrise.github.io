export default class {
    constructor(parent) {
        this.parent = parent;

        this.id = this.parent.cache.length + 1;
        
        this.element = document.createElement("div");
        this.element.className = "layer";
        this.element.innerHTML = "Layer " + this.id;
        this.element.addEventListener("mouseover", function(event) {
            if (event.target.className !== this.className) {
                this.style.cursor = "default";

                return;
            }

            this.style.cursor = "pointer";
        });
        this.element.addEventListener("click", event => {
            if (event.target.className !== this.element.className) {
                return;
            }

            /*
            const options = this.element.querySelector(".options");
            options.style.display = options.style.display === "block" ? "none" : "block";
            */

            window.canvas.layerDepth = this.id;
        });

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        const option = document.createElement("div");
        option.className = "option ripple";
        option.innerText = "Hide";
        option.addEventListener("click", () => {
            this.toggleVisiblity();
            checkbox.checked = this.hidden;
        });

        option.prepend(checkbox);

        const range = document.createElement("input");
        range.type = "range";
        range.setAttribute("min", 0);
        range.setAttribute("max", 100);
        range.setAttribute("value", 100);
        range.style.setProperty("width", "100px");
        range.style.setProperty("pointer-events", "all");

        const optionTwo = document.createElement("div");
        optionTwo.className = "option ripple";
        optionTwo.innerText = "Opacity";
        optionTwo.style.setProperty("flex-direction", "column");
        optionTwo.addEventListener("mousemove", (event) => {
            if (event.buttons !== 1) {
                return;
            }
            
            this.opacity = range.value / 100;
        });

        optionTwo.appendChild(range);

        const clearButton = document.createElement("button");
        clearButton.innerText = "Clear";
        clearButton.addEventListener("click", () => {
            if (this.parent.cache.length <= 1) {
                alert("You must have at least one layer at all times!");

                return;
            }

            if (confirm(`Are you sure you\'d like to clear Layer ${this.id}?`)) {
                this.clear();
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () => {
            if (this.parent.cache.length <= 1) {
                alert("You must have at least one layer at all times!");

                return;
            }

            if (confirm(`Are you sure you\'d like to delete Layer ${this.id}?`)) {
                this.remove();
            }
        });

        const options = document.createElement("div");
        if (this.id === 1) {
            options.style.display = "block";
        }

        options.className = "options";

        options.append(optionTwo, option, clearButton, deleteButton);
        this.element.append(options);
        layers.append(this.element);

        this.parent.cache.push(this);
    }
    hidden = false;
    lines = []
    get opacity() {
        return this.alpha;
    }
    set opacity(alpha) {
        this.alpha = alpha;

        this.redraw();
    }
    redraw() {
        for (const line of this.lines) {
            line.style.setProperty("opacity", this.alpha);
        }
    }
    toggleVisiblity() {
        this.hidden = !this.hidden;
        if (this.hidden) {
            for (const line of this.lines) {
                line.remove();
            }
        } else {
            for (const line of this.lines) {
                window.canvas.view.prepend(line);
            }
        }
    }
    clear() {
        for (const line of this.lines) {
            line.remove();
        }

        this.lines = []
    }
    remove() {
        this.element.remove();
        this.clear();

        this.parent.remove(this.id);
        this.parent.cache.forEach((layer, index) => {
            layer.id = index + 1;
            layer.element.firstChild.data = "Layer " + layer.id;
        });

        if (this.parent.cache.length < window.canvas.layerDepth) {
            window.canvas.layerDepth = window.canvas.layerDepth === this.id ? this.parent.cache.length : 1;
        }
    }
}