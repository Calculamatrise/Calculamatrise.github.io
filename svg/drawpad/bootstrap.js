import Canvas from "./utils/Canvas.js";

window.canvas = new Canvas(document.querySelector("#view"));

window.addEventListener("resize", function() {
	view.setAttribute("viewBox", `0 0 ${view.width.baseVal.value} ${view.height.baseVal.value}`);
});

container.addEventListener("contextmenu", function(event) {
	event.preventDefault();
});

document.addEventListener("keydown", function(event) {
	event.preventDefault();
	event.stopPropagation();
	
	const zoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--zoom'));
	switch(event.key) {
		case "Escape":
			if (layers.style.display !== "none") {
				layers.style.display = "none";
				
				break;
			}

			settings.style.visibility = "show";
			settings.style.display = "block";
			break;
		
		case "=":
			if (window.canvas.tool.size > 100) {
				break;
			}

			window.canvas.tool.size += 1;
			break;
			
		case "-":
			if (window.canvas.tool.size <= 2) {
				break;
			}

			window.canvas.tool.size -= 1;
			break;

		case "0":
			window.canvas.tools.select("camera");
			break;

		case "1":
			window.canvas.tools.select("line");
			break;
		
		case "2":
			window.canvas.tools.select("brush");
			break;

		case "3":
			window.canvas.tools.select("circle");
			break;

		case "4":
			window.canvas.tools.select("rectangle");
			break;

		case "5":
			window.canvas.tools.select("eraser");
			break;

		case "f":
			window.canvas.fill = !window.canvas.fill;
			break;

		case "ArrowUp":
			if (window.canvas.layerDepth >= window.canvas.layers.cache.length) {
				if (!event.shiftKey) {
					break;
				}

				window.canvas.layers.create();
			}

			window.canvas.layerDepth = window.canvas.layerDepth + 1;
			break;

		case "ArrowDown":
			if (window.canvas.layerDepth <= 1) {
				break;
			}

			window.canvas.layerDepth = window.canvas.layerDepth - 1;
			break;

		case "z":
			window.canvas.undo();
			break;

		case "x":
			window.canvas.redo();
			break;

		case "c":
			if (window.canvas.tool.constructor.id === "select" && event.ctrlKey) {
				window.canvas.tool.copy();

				break;
			}
			
			break;

		case "v":
			if (window.canvas.tool.constructor.id === "select" && event.ctrlKey) {
				window.canvas.tool.paste();

				break;
			}

			break;
	}
});

if (JSON.parse(localStorage.getItem("dark")) ?? window.matchMedia('(prefers-color-scheme: dark)').matches) {
	document.documentElement.style.setProperty("--background", "#1B1B1B");
	document.documentElement.style.setProperty("--text", "#FBFBFB");
} else {
	document.documentElement.style.setProperty("--background", "#EBEBEB");
	document.documentElement.style.setProperty("--text", "#1B1B1B");
}

document.documentElement.style.setProperty('--color', localStorage.getItem("--color") || "skyblue");
colour.value = localStorage.getItem("--color") || "skyblue";