import Manipulation from "./Utils/Manipulation.js";

        this.solid = new Array();
image.onchange = function() {
    if (this.files.length < 1) return;
    Manipulation.fileReader.readAsDataURL(this.files[0]);
}