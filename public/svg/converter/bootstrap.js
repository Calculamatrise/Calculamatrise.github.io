import Manipulation from "./Utils/Manipulation.js";

image.onchange = function() {
    canvas.innerHTML = null;
    progress.style.width = "0%";
    progress.innerText = "";
    
    if (this.files.length < 1) return;
    Manipulation.fileReader.readAsDataURL(this.files[0]);
}

invert.onchange = function() {
    image.value = null;
}