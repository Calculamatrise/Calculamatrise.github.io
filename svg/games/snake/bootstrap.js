import Game from "./utils/Game.js";

window.game = new Game(document.querySelector("#view"));
window.game.init();

window.addEventListener("resize", function() {
	view.setAttribute("viewBox", `0 0 ${view.width.baseVal.value} ${view.height.baseVal.value}`);
});

view.addEventListener("contextmenu", function(event) {
	event.preventDefault();
});



document.addEventListener("keydown", function(event) {
	event.preventDefault();
	event.stopPropagation();
	
	switch(event.key) {
		case "Escape":
			document.querySelector("#overlay").style.display = "block";
			break;
		
		case "=":
			if (window.canvas.toolSize > 100) {
				break;
			}

			window.canvas.toolSize += 1;
			break;
			
		case "-":
			if (window.canvas.toolSize <= 2) {
				break;
			}

			window.canvas.toolSize -= 1;
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