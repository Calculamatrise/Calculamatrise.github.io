import Manipulation from "./Utils/Manipulation.js";

const app = new Manipulation();

image.onchange = function() {
    code.value = null;
    progress.innerText = "";
    progress.style.width = "0%";
    if (this.files.length < 1) {
        app.canvas.getContext("2d").clearRect(0, 0, app.canvas.width, app.canvas.height);
        return;
    }

    app.init(URL.createObjectURL(this.files[0]));
}