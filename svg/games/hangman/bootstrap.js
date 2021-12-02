import Game from "./utils/Game.js";

window.game = new Game(document.querySelector("#view"));
window.game.init();

window.addEventListener("resize", function() {
	view.setAttribute("viewBox", `0 0 ${view.width} ${view.height}`);
});

view.addEventListener("contextmenu", function(event) {
	event.preventDefault();
});

if (JSON.parse(localStorage.getItem("dark")) ?? window.matchMedia('(prefers-color-scheme: dark)').matches) {
	document.documentElement.style.setProperty("--background", "#1B1B1B");
	document.documentElement.style.setProperty("--text", "#FBFBFB");
} else {
	document.documentElement.style.setProperty("--background", "#EBEBEB");
	document.documentElement.style.setProperty("--text", "#1B1B1B");
}

document.documentElement.style.setProperty('--color', localStorage.getItem("--color") || "skyblue");