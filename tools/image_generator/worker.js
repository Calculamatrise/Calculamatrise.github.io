onmessage = function({ data }) {
    switch(data.cmd) {
        case "move":
            data.args.physics = data.args.physics.split(/\u002C/g).map(t => t.split(/\s/g).map((t, e) => (parseInt(t, 32) + data.args[e % 2 == 0 ? "x" : "y"]).toString(32)).join(" ")).join(" ");
            data.args.scenery = data.args.scenery.split(/\u002C/g).map(t => t.split(/\s/g).map((t, e) => (parseInt(t, 32) + data.args[e % 2 == 0 ? "x" : "y"]).toString(32)).join(" ")).join(" ");
            data.args.powerups = data.args.powerups.split(/\u002C/g).map(t => t.split(/\s/g).map((t, e, i) => (i[0] == "V" ? e > 0 && e < 3 : e > 0) ? (parseInt(t, 32) + data.args[e % 2 == 0 ? "x" : "y"]).toString(32) : t).join(" ")).join(",");
        break;

        case "render":
            for (let y = 0, iy; y < data.args.canvas.height; y++) {
                for (let x = 0, ix, dx, e; x < data.args.canvas.width; x++) {
                    e = (x + y * data.args.canvas.width) * 4;
                    ix = x * 2;
                    iy = y * 2;
                    dx = ix + 2;

                    if (data.args.pixels.data[e] == 255 || data.args.pixels.data[e - 4] == data.args.pixels.data[e] && Math.floor((e - 4) / data.args.canvas.width / 4) == y) continue;
                    for (let i = x + 1, s; i < data.args.canvas.width; i++) {
                        s = (i + y * data.args.canvas.width) * 4;
                        if (i >= data.args.canvas.width - 1 || data.args.pixels.data[s] != data.args.pixels.data[e]) {
                            dx = (i - 1) * 2;
                            break;
                        }
                    }
                    data.args[data.args.pixels.data[e] == 0 ? "physics" : "scenery"] += `${ix.toString(32)} ${iy.toString(32)} ${dx.toString(32)} ${iy.toString(32)},${ix.toString(32)} ${(iy + 2).toString(32)} ${dx.toString(32)} ${(iy + 2).toString(32)},`;
                }
                postMessage({
                    cmd: "progress",
                    args: {
                        value: Math.round(y / (data.args.canvas.height / 100)) + "%"
                    }
                });
            }
        break;
    }
    postMessage(data);
}