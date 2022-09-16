function t(e) {
    let ctx = document.querySelector("canvas").getContext("2d");
    let code = e.code.split("#");
    let physics = code[0].split(",").map(t => t.split(/\s/).map(t => parseInt(t, 32)));
    let scenery = code[1].split(",").map(t => t.split(/\s/).map(t => parseInt(t, 32)));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(0, 0);
    ctx.lineTo(1, 1)
    let limitX = physics.sort((t, e) => t[0] - e[0]);
    canvas.width = Math.abs(limitX[0][0]) + Math.abs(limitX[limitX.length - 1][0]);
    let limitY = physics.sort((t, e) => t[1] - e[1]);
    canvas.height = Math.abs(limitY[0][1]) + Math.abs(limitY[limitY.length - 1][1]);
    ctx.translate(limitX[0][0] / 2, limitY[0][0] / 2);
    ctx.strokeStyle = invert.checked ? "#FFF" : "#000";
    for (const t of physics) {
        for (let e = 0; e < t.length; e += 2) {
            ctx.beginPath();
            ctx.moveTo(t[e], t[e + 1]);
            ctx.lineTo(t[e + 2], t[e + 3]);
            ctx.stroke();
        }
    }
    ctx.strokeStyle = invert.checked ? "#555" : "#AAA";
    for (const t of scenery) {
        for (let e = 0; e < t.length; e += 2) {
            ctx.beginPath();
            ctx.moveTo(t[e], t[e + 1]);
            ctx.lineTo(t[e + 2], t[e + 3]);
            ctx.stroke();
        }
    }
}