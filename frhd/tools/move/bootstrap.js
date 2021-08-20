import Track from "./utils/Track.js";

let worker = new Worker("./worker.js");
worker.onmessage = ({ data }) => {
    switch(data.cmd) {
        case "move":
            input.value = data.args.physics + "#" + data.args.scenery + "#" + data.args.powerups;
        break;

        case "progress":
            document.title = "Progress... " + data.args.value;
            progress.innerText = data.args.innerText || data.args.value;
            progress.style.width = data.args.value;
        break;
    }
}

input.onclick = input.select;

move.onclick = function() {
    new Track(worker).move(parseInt(travelDistanceX.value) | 0, parseInt(travelDistanceY.value) | 0);
}

document.onkeypress = t => {
    switch(t.key) {
        case "Enter":
            new Track(worker).move(parseInt(travelDistanceX.value) | 0, parseInt(travelDistanceY.value) | 0);
        break;

        case "c":
            input.select(),
            document.execCommand('copy');
        break;
    }
}

document.body.addEventListener("click", function() {
    if (window.move !== void 0 && typeof move.onclick !== "function") {
        move.onclick = function() {
            new Track(worker).move(parseInt(travelDistanceX.value) | 0, parseInt(travelDistanceY.value) | 0);
        }
    }
});

window.addEventListener("onpopstate", function pop(event) {
    if (worker !== void 0) {
        worker.terminate();
        worker = null;
    }

    document.body.removeEventListener("click", check);
    window.removeEventListener("onpopstate", pop);
});