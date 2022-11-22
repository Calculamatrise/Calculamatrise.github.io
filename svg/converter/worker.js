onmessage = function({ data }) {
    switch(data.cmd) {
        case "render": {
            data.result = '';
            data.filter && filter(data.pixels);
            data.invert && invert(data.pixels);
            for (let y = 0; y < data.pixels.height; y++) {
                for (let x = 0, ix, dx, e, f; x < data.pixels.width; x++) {
                    e = (x + y * data.pixels.width) * 4;
                    dx = x + 1;
                    if (data.pixels.data[e] == 255 || data.pixels.data[e - 4] == data.pixels.data[e] && Math.floor((e - 4) / data.pixels.width / 4) == y) continue;
                    for (let i = x + 1, s; i < data.pixels.width; i++) {
                        s = (i + y * data.pixels.width) * 4;
                        if (i >= data.pixels.width - 1 || data.pixels.data[s] != data.pixels.data[e]) {
                            dx = (i - 1) * 2;
                            break;
                        }
                    }

                    // check lines below for matching colours then create a polyline
                    data.result += `<line x1="${x}" y1="${y}" x2="${dx}" y2="${y}" stroke="rgba(${data.pixels.data[e]},${data.pixels.data[e + 1]},${data.pixels.data[e + 2]},${data.pixels.data[e + 3]})" stroke-width="2" />`;
                }

                postMessage({
                    cmd: 'progress',
                    progress: Math.round(y / (data.pixels.height / 100))
                });
            }
            break;
        }
    }

    postMessage(data);
}

function filter(pixels) {
    for (let t = 0, e = 0; t in pixels.data; t += 4) {
        e = pixels.data[t] * .2 + pixels.data[t + 1] * .7 + pixels.data[t + 2] * .1;
        pixels.data[t] = pixels.data[t + 1] = pixels.data[t + 2] = e <= 85 ? 0 : e <= 170 ? 170 : 255;
    }
    return pixels;
}

function invert(pixels) {
    for (let t = 0; t in pixels.data; t += 4) {
        pixels.data[t] = 255 - pixels.data[t];
        pixels.data[t + 1] = 255 - pixels.data[t + 1];
        pixels.data[t + 2] = 255 - pixels.data[t + 2];
    }
    return pixels;
}