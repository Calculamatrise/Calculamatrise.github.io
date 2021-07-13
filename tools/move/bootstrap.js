import Track from "./utils/Track.js";

move.onclick = function() {
    new Track(input.value || "-18 1i 18 1i##").move(parseInt(travelDistanceX.value) | 0, parseInt(travelDistanceY.value) | 0);
}

copy.onclick = function() {
    input.select(), document.execCommand("copy");
}

input.onclick = input.select;

document.onkeypress = t => {
    switch(t.key) {
        case "Enter":
            move.onclick();
        break;

        case "c":
            copy.onclick();
        break;
    }
}