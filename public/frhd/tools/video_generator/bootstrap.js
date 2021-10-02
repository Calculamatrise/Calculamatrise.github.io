import Manipulation from "./Utils/Manipulation.js";

input.onchange = function() {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    progress.style.width = "0%";
    progress.innerText = "";
    code.value = null;
    
    if (this.files.length < 1) return;
    video.src = URL.createObjectURL(this.files[0]);
    Manipulation.init(video);
}

invert.onchange = function() {
    input.value = null;
}
