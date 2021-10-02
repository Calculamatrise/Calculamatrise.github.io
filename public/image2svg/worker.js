onmessage = function({ data }) {
    switch(data.cmd) {
        case "render":
            for (let y = 0; y < data.args.canvas.height; y++) {
                for (let x = 0, dx, e; x < data.args.canvas.width; x++) {
                    e = (x + y * data.args.canvas.width) * 4;
                    dx = x + 1;

                    if (data.args.pixels.data[e - 4] == data.args.pixels.data[e] &&
                        data.args.pixels.data[e - 3] == data.args.pixels.data[e + 1] &&
                        data.args.pixels.data[e - 2] == data.args.pixels.data[e + 2] &&
                        data.args.pixels.data[e - 1] == data.args.pixels.data[e + 3] && Math.floor((e - 4) / data.args.canvas.width / 4) == y) continue;
                    for (let i = x + 1, s; i < data.args.canvas.width; i++) {
                        s = (i + y * data.args.canvas.width) * 4;

                        if (i >= data.args.canvas.width - 1 || data.args.pixels.data[s] != data.args.pixels.data[e] ||
                            data.args.pixels.data[s + 1] != data.args.pixels.data[e + 1] ||
                            data.args.pixels.data[s + 2] != data.args.pixels.data[e + 2] ||
                            data.args.pixels.data[s + 3] != data.args.pixels.data[e + 3]) {
                            dx = i + 1;
                            break;
                        }
                    }
                    data.args.lines += `<line x1="${x}" y1="${y}" x2="${dx}" y2="${y}" stroke="rgba(${data.args.pixels.data[e]},${data.args.pixels.data[e + 1]},${data.args.pixels.data[e + 2]},${data.args.pixels.data[e + 3]})" stroke-width="2" />`;
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