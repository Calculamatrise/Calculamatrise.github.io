let offset = { x: 0, y: 0 };
let types = {
    physics: [],
    scenery: [],
    powerups: []
}

addEventListener("message", function({ data }) {
    switch(data.cmd) {
        case "init":
            offset = { x: 0, y: 0 };
            types.physics = [];
            types.scenery = [];
            types.powerups = [];
            offset = {
                x: -data.width,
                y: 50
            }

            postMessage(data);
            break;

        case "render":
            data.filter && filter(data.pixels);
            data.invert && invert(data.pixels);
            for (let y = 0, iy; y < data.pixels.height; y++) {
                for (let x = 0, ix, dx, e; x < data.pixels.width; x++) {
                    e = (x + y * data.pixels.width) * 4;
                    ix = x * 2 + offset.x;
                    iy = y * 2 + offset.y;
                    dx = ix + 2;
                    if (data.pixels.data[e] == 255 || data.pixels.data[e - 4] == data.pixels.data[e] && Math.floor((e - 4) / data.pixels.width / 4) == y) continue;
                    for (let i = x + 1, s; i < data.pixels.width; i++) {
                        s = (i + y * data.pixels.width) * 4;
                        if (i >= data.pixels.width - 1 || data.pixels.data[s] != data.pixels.data[e]) {
                            dx = (i - 1) * 2 + offset.x;
                            break;
                        }
                    }

                    types[data.pixels.data[e] == 0 ? "physics" : "scenery"].push(`${ix.toString(32)} ${iy.toString(32)} ${dx.toString(32)} ${iy.toString(32)},${ix.toString(32)} ${(iy + 2).toString(32)} ${dx.toString(32)} ${(iy + 2).toString(32)}`);
                }
            }

            types.physics.push(`${(offset.x + data.pixels.width - 40).toString(32)} 1i ${(offset.x + data.pixels.width + 40).toString(32)} 1i`);
            types.powerups.push(`W ${(offset.x + data.pixels.width).toString(32)} 0 ${(offset.x + data.pixels.width + data.pixels.width * 10).toString(32)} 0`);
            offset.x += data.pixels.width * 10;
            break;

        case "fetch":
            data.result = `${types.physics.join(",")}#${types.scenery.join(",")}#${types.powerups.join(",")}`;
            data.size = data.result.length;
            postMessage(data);
            break;
    }
});

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


// let canvas;
// let context;

// addEventListener('message', event => {
//   if (event.data.offscreen) {
//     canvas = event.data.offscreen;
//     context = canvas.getContext('2d');
//   } else if (event.data.imageBitmap && context) {
//     context.drawImage(event.data.imageBitmap, 0, 0);
//     // do something with frame
//   }
// });