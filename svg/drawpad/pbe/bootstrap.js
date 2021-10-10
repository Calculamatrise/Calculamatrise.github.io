import Canvas from "./utils/Canvas.js";

window.canvas = new Canvas(document.querySelector("#view"));

window.addEventListener("resize", function() {
	view.setAttribute("viewBox", `0 0 ${view.width.baseVal.value} ${view.height.baseVal.value}`);
});

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

document.documentElement.style.setProperty('--color', localStorage.getItem("--color") || "skyblue");
colour.value = localStorage.getItem("--color") || "skyblue";

document.querySelector("#patch-notes").addEventListener("click", function(event) {
	if (this.iframe) {
		this.iframe.remove();

		this.iframe = null;

		return;
	}

	this.iframe = document.createElement("iframe");
	this.iframe.id = "patch-notes-iframe";
	this.iframe.src = "https://calculamatrise.github.io/svg/drawpad/updates/patch-1.2.5/";

	document.querySelector("#container").appendChild(this.iframe);
});