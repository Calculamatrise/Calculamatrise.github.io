import Track from "./utils/track.js";

transform.onclick = function() {
    const track = new Track(input.value)
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

copy.onclick = function() {
    output.select();
    document.execCommand('copy');
}

input.onclick = output.onclick = function() {
    this.select();
}

window.onkeydown = function(e) {
    let key = e.keyCode || e.which;
    if (key == 13) transform.onclick();
    if (key == 67) copy.onclick();
}