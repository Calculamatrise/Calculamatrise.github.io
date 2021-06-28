onmessage = function(t) {
    switch (t.data.cmd) {
        case "filter":
            for (let e = 0, i = 0; e in t.data.args.pixels.data; e += 4) {
                i = t.data.args.pixels.data[t] * .2 + t.data.args.pixels.data[e + 1] * .7 + t.data.args.pixels.data[e + 2] * .1;
                t.data.args.pixels.data[e] = t.data.args.pixels.data[e + 1] = t.data.args.pixels.data[e + 2] = i <= 85 ? 0 : i <= 170 ? 170 : 255;
            }
        break;

        case "render":
            for (let y = 0, iy, ay; y < t.data.args.canvas.height; y++) {
                for (let x = 0, ix, dx; x < t.data.args.canvas.width; x++) {
                    let e = (x + y * t.data.args.canvas.width) * 4;

                    ix = x * 2;
                    iy = y * 2;
                    dx = ix + 2;
                    ay = iy - 1;
        
                    if (t.data.args.pixels.data[e] == 0) {
                        if (t.data.args.pixels.data[e - 4] == 0) continue;
                        if (t.data.args.pixels.data[e + 4] == 0) {
                            for (let i = x; i < t.data.args.canvas.width; i++) {
                                let s = (i + y * t.data.args.canvas.width) * 4;
                                if (t.data.args.pixels.data[s + 4] != 0) {
                                    dx = i * 2;
                                    break;
                                }
                            }
                        }
                        t.data.args.physics += `${ix.toString(32)} ${iy.toString(32)} ${dx.toString(32)} ${iy.toString(32)},${ix.toString(32)} ${ay.toString(32)} ${dx.toString(32)} ${ay.toString(32)},`;
                    } else if (t.data.args.pixels.data[e] == 170) {
                        if (t.data.args.pixels.data[e - 4] == 170) continue;
                        if (t.data.args.pixels.data[e + 4] == 170) {
                            for (let i = x; i < t.data.args.canvas.width; i++) {
                                let s = (i + y * t.data.args.canvas.width) * 4;
                                if (t.data.args.pixels.data[s + 4] != 170) {
                                    dx = i * 2;
                                    break;
                                }
                            }
                        }
                        t.data.args.scenery += `${ix.toString(32)} ${iy.toString(32)} ${dx.toString(32)} ${iy.toString(32)},${ix.toString(32)} ${ay.toString(32)} ${dx.toString(32)} ${ay.toString(32)},`;
                    }
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