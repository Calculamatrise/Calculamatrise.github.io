import Manipulation from "./utils/Manipulation.js";

const app = new Manipulation(document.querySelector('#view'));

input.addEventListener('input', function(event) {
    app.progress = 0;
    code.value = null;
    if (event.target.files.length < 1) {
        app.canvas.getContext('2d').clearRect(0, 0, app.canvas.width, app.canvas.height);
        return;
    }

    app.video.src = URL.createObjectURL(event.target.files[0]);
});