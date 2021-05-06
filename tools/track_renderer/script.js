const ctx = canvas.getContext("2d");
ctx.translate(canvas.width / 2, canvas.height / 2);
run.onclick = () => {
    fetch("https://cors-anywhere.herokuapp.com/https://cdn.freeriderhd.com/free_rider_hd/tracks/prd/" + input.value + "/track-data-v1.js").then(response => response.text()).then(function(data) {
        data = JSON.parse(data.slice(2, -2));
        let code = data.code.split("#");
        let physics = code[0].split(",").map(t => t.split(/\s/).map(t => parseInt(t, 32)));
        let scenery = code[1].split(",").map(t => t.split(/\s/).map(t => parseInt(t, 32)));
        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = invert.checked ? "#555" : "#AAA";
        for (const t of scenery) {
            for (let e = 0; e < t.length; e += 2) {
                ctx.beginPath();
                ctx.moveTo(t[e], t[e + 1]);
                ctx.lineTo(t[e + 2], t[e + 3]);
                ctx.stroke();
            }
        }
        ctx.strokeStyle = invert.checked ? "#FFF" : "#000";
        for (const t of physics) {
            for (let e = 0; e < t.length; e += 2) {
                ctx.beginPath();
                ctx.moveTo(t[e], t[e + 1]);
                ctx.lineTo(t[e + 2], t[e + 3]);
                ctx.stroke();
            }
        }
    }).catch(function(error) {
        canvas.prepend("Something went wrong. Please try again later. (Too many requests)\n" + error);
    });
}