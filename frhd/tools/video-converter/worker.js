onmessage = function({ data }) {
    switch(data.cmd) {
        case "fetch":
            this.code = this.physics + "#" + this.scenery + "#" + this.powerups;
            postMessage({
                cmd: "result",
                args: {
                    code: this.code,
                    size: this.code.length
                }
            });

            this.code = "";
            this.physics = ""
            this.scenery = ""
            this.powerups = "";
            break;

        case "init":
            this.code = "";
            this.physics = ""
            this.scenery = ""
            this.powerups = "";
            this.offset = {
                x: -data.args.width,
                y: 50
            }
            break;

        case "render":
            for (let y = 0, iy; y < data.args.height; y++) {
                for (let x = 0, ix, dx, e; x < data.args.width; x++) {
                    e = (x + y * data.args.width) * 4;
                    ix = x * 2 + this.offset.x;
                    iy = y * 2 + this.offset.y;
                    dx = ix + 2;
                    if (data.args.pixels.data[e] == 255 || data.args.pixels.data[e - 4] == data.args.pixels.data[e] && Math.floor((e - 4) / data.args.width / 4) == y) continue;
                    for (let i = x + 1, s; i < data.args.width; i++) {
                        s = (i + y * data.args.width) * 4;
                        if (i >= data.args.width - 1 || data.args.pixels.data[s] != data.args.pixels.data[e]) {
                            dx = (i - 1) * 2 + this.offset.x;
                            break;
                        }
                    }

                    this[data.args.pixels.data[e] == 0 ? "physics" : "scenery"] += `${ix.toString(32)} ${iy.toString(32)} ${dx.toString(32)} ${iy.toString(32)},${ix.toString(32)} ${(iy + 2).toString(32)} ${dx.toString(32)} ${(iy + 2).toString(32)},`;
                }
            }

            this.physics += `${(this.offset.x + data.args.width - 40).toString(32)} 1i ${(this.offset.x + data.args.width + 40).toString(32)} 1i,`;
            this.powerups += `W ${(this.offset.x + data.args.width).toString(32)} 0 ${(this.offset.x + data.args.width + data.args.width * 10).toString(32)} 0,`;
            this.offset.x += data.args.width * 10;
            postMessage({
                cmd: "ready",
                args: {
                    code: this.code,
                    size: this.code.length
                }
            });
            break;
    }
}