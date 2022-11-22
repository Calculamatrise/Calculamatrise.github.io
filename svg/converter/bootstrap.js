import Manipulation from "./utils/Manipulation.js";

const app = new Manipulation();

image.addEventListener('click', function() {
    this.value = null;
});

image.addEventListener('change', function() {
    app.progress = 0;
    if (this.files.length > 0) {
        app.image.src = URL.createObjectURL(this.files[0]);
    }
});