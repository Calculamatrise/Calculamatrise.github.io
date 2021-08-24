onmessage = function({ data }) {
    switch(data.cmd) {
        case "render":
            for (let y = 0; y < data.args.canvas.height; y++) {
                for (let x = 0, e; x < data.args.canvas.width; x++) {
                    e = (x + y * data.args.canvas.width) * 4;

                    data.args.lines += `<line x1="${x}" y1="${y}" x2="${x + 1}" y2="${y}" stroke="rgba(${data.args.pixels.data[e]},${data.args.pixels.data[e + 1]},${data.args.pixels.data[e + 2]},${data.args.pixels.data[e + 3]})" stroke-width="2" />`;
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