onmessage = function(t) {
    switch (t.data.cmd) {
        case "filter":
            for (let e = 0, i = 0; e in t.data.args.pixels.data; e += 4) {
                i = t.data.args.pixels.data[t] * .2 + t.data.args.pixels.data[e + 1] * .7 + t.data.args.pixels.data[e + 2] * .1;
                t.data.args.pixels.data[e] = t.data.args.pixels.data[e + 1] = t.data.args.pixels.data[e + 2] = i <= 85 ? 0 : i <= 170 ? 170 : 255;
            }
        break;

        case "render":
            for (let y = 0, iy; y < t.data.args.canvas.height; y++) {
                for (let x = 0, ix, dx, e; x < t.data.args.canvas.width; x++) {
                    e = (x + y * t.data.args.canvas.width) * 4;
                    ix = x * 2;
                    iy = y * 2;
                    dx = ix + 2;

                    if (t.data.args.pixels.data[e] == 255 || t.data.args.pixels.data[e - 4] == t.data.args.pixels.data[e] && Math.floor((e - 4) / t.data.args.canvas.width / 4) == y) continue;
                    for (let i = x + 1, s; i < t.data.args.canvas.width; i++) {
                        s = (i + y * t.data.args.canvas.width) * 4;
                        if (i >= t.data.args.canvas.width - 1 || t.data.args.pixels.data[s] != t.data.args.pixels.data[e]) {
                            dx = (i - 1) * 2;
                            break;
                        }
                    }
                    t.data.args[t.data.args.pixels.data[e] == 0 ? "physics" : "scenery"] += `${ix.toString(32)} ${iy.toString(32)} ${dx.toString(32)} ${iy.toString(32)},${ix.toString(32)} ${(iy + 2).toString(32)} ${dx.toString(32)} ${(iy + 2).toString(32)},`;
                }
                postMessage({
                    cmd: "progress",
                    args: {
                        value: Math.round(y / (t.data.args.canvas.height / 100)) + "%"
                    }
                });
            }
        break;
    }
    postMessage(t.data);
}