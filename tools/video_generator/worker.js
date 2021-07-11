onmessage = function({ data }) {
    if (!this.physics) this.physics = "";
    if (!this.scenery) this.scenery = "";
    if (!this.powerups) this.powerups = "";
    switch(data.cmd) {
        case "fetch":
            postMessage({
                cmd: "result",
                args: {
                    physics: this.physics,
                    scenery: this.scenery,
                    powerups: this.powerups
                }
            });
        break;

        case "render":
            for (let y = 0, iy; y < data.args.canvas.height; y++) {
                for (let x = 0, ix, dx, e; x < data.args.canvas.width; x++) {
                    e = (x + y * data.args.canvas.width) * 4;
                    ix = x * 2 + data.args.offset.x;
                    iy = y * 2 + data.args.offset.y;
                    dx = ix + 2;

                    if (data.args.pixels.data[e] == 255 || data.args.pixels.data[e - 4] == data.args.pixels.data[e] && Math.floor((e - 4) / data.args.canvas.width / 4) == y) continue;
                    for (let i = x + 1, s; i < data.args.canvas.width; i++) {
                        s = (i + y * data.args.canvas.width) * 4;
                        if (i >= data.args.canvas.width - 1 || data.args.pixels.data[s] != data.args.pixels.data[e]) {
                            dx = (i - 1) * 2 + data.args.offset.x;
                            break;
                        }
                    }
                    data.args[data.args.pixels.data[e] == 0 ? "physics" : "scenery"] += `${ix.toString(32)} ${iy.toString(32)} ${dx.toString(32)} ${iy.toString(32)},${ix.toString(32)} ${(iy + 2).toString(32)} ${dx.toString(32)} ${(iy + 2).toString(32)},`;
                }
            }
            data.args.powerups += `W ${(data.args.offset.x + (data.args.canvas.width / 2)).toString(32)} 0 ${(data.args.offset.x + data.args.canvas.width * 10 + (data.args.canvas.width / 2)).toString(32)} 0,`;
        break;
    }
    postMessage(data);
}