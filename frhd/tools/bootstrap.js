import Canvas from "./utils/Canvas.js";

window.canvas = new Canvas(document.querySelector("#view"));

container.addEventListener("contextmenu", function(event) {
	event.preventDefault();
});

if (JSON.parse(localStorage.getItem("dark")) ?? window.matchMedia('(prefers-color-scheme: dark)').matches) {
	document.documentElement.style.setProperty("--background", "#1B1B1B");
	document.documentElement.style.setProperty("--hard-background", "#111111");
	document.documentElement.style.setProperty("--soft-background", "#333333");
	document.documentElement.style.setProperty("--text", "#FBFBFB");
} else {
	document.documentElement.style.setProperty("--background", "#EBEBEB");
	document.documentElement.style.setProperty("--hard-background", "#EEEEEE");
	document.documentElement.style.setProperty("--soft-background", "#CCCCCC");
	document.documentElement.style.setProperty("--text", "#1B1B1B");
}