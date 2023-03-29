import Manipulation from "./utils/Manipulation.js";

const app = new Manipulation();

image.addEventListener('input', function(event) {
    app.progress = 0;
    code.value = null;
    if (event.target.files.length > 0) {
        app.image.src = URL.createObjectURL(event.target.files[0]);
    }
});