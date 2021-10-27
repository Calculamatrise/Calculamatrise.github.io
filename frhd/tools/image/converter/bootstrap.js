import Manipulation from "./Utils/Manipulation.js";

image.onchange = function() {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    progress.style.width = "0%";
    progress.innerText = "";
    code.value = null;
    
    if (this.files.length < 1) return;
    Manipulation.fileReader.readAsDataURL(this.files[0]);
}

invert.onchange = function() {
    image.value = null;
}