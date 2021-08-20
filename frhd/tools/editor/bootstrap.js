import Track from "./utils/track.js";

let worker = new Worker("./worker.js");

transform.onclick = function() {
    const track = new Track(worker)
        .move(parseInt(moveX.value) | 0, parseInt(moveY.value) | 0);
    track.on("moved", function() {
        track.scale(parseInt(scaleX.value) | 1, parseInt(scaleY.value) | 1);
    });
    track.on("scaled", function() {
        track.rotate(parseInt(rotate.value) | 0);
    });
    chars.innerText = output.value.length.toString().slice(0, -3) || 0,
    output.select();
}

window.onkeydown = function(e) {
    let key = e.keyCode || e.which;
    if (key == 13) {
        const track = new Track(worker)
            .move(parseInt(moveX.value) | 0, parseInt(moveY.value) | 0);
        track.on("moved", function() {
            track.scale(parseInt(scaleX.value) | 1, parseInt(scaleY.value) | 1);
        });
        track.on("scaled", function() {
            track.rotate(parseInt(rotate.value) | 0);
        });
        chars.innerText = output.value.length.toString().slice(0, -3) || 0,
        output.select();
    }
    if (key == 67) {
        output.select();
        document.execCommand('copy');
    }
}

document.body.addEventListener("click", function(event) {
    if (window.transform !== void 0 && typeof transform.onclick !== "function") {
        transform.onclick = function() {
            const track = new Track(worker)
                .move(parseInt(moveX.value) | 0, parseInt(moveY.value) | 0);
            track.on("moved", function() {
                track.scale(parseInt(scaleX.value) | 1, parseInt(scaleY.value) | 1);
            });
            track.on("scaled", function() {
                track.rotate(parseInt(rotate.value) | 0);
            });
            chars.innerText = output.value.length.toString().slice(0, -3) || 0,
            output.select();
        }
    }
});

window.addEventListener("popstate", function pop(event) {
    if (worker !== void 0) {
        worker.terminate();
        worker = null;
    }

    window.removeEventListener("popstate", pop);
});