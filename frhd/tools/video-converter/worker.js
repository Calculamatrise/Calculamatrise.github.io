let canvas = new OffscreenCanvas(0, 0);
let ctx = canvas.getContext('2d');
let readCtx = canvas.getContext('2d', { willReadFrequently: true });
let shouldFilter = false;
let shouldInvert = false;
let offset = {x: 0, y: 50};
let types = {
    physics: [],
    scenery: [],
    powerups: []
}

addEventListener('message', ({ data }) => {
	if ('canvas' in data) {
		canvas = data.canvas;
		ctx = canvas.getContext('2d');
		readCtx = canvas.getContext('2d', { willReadFrequently: true }); // set to false when hardware acceleration is enabled
		return;
	} else if ('imageBitmap' in data) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(data.imageBitmap, 0, 0, canvas.width, canvas.height);
		const pixels = readCtx.getImageData(0, 0, canvas.width, canvas.height);
		shouldFilter && filter(pixels);
		shouldInvert && invert(pixels);
		for (let y = 0, iy; y < pixels.height; y++) {
			for (let x = 0, ix, dx, e; x < pixels.width; x++) {
				e = (x + y * pixels.width) * 4;
				ix = x * 2 + offset.x;
				iy = y * 2 + offset.y;
				dx = ix + 2;
				if (pixels.data[e] == 255 || pixels.data[e - 4] == pixels.data[e] && Math.floor((e - 4) / pixels.width / 4) == y) continue;
				for (let i = x + 1, s; i < pixels.width; i++) {
					s = (i + y * pixels.width) * 4;
					if (i >= pixels.width - 1 || pixels.data[s] != pixels.data[e]) {
						dx = (i - 1) * 2 + offset.x;
						break;
					}
				}

				types[pixels.data[e] == 0 ? 'physics' : 'scenery'].push(`${ix.toString(32)} ${iy.toString(32)} ${dx.toString(32)} ${iy.toString(32)},${ix.toString(32)} ${(iy + 2).toString(32)} ${dx.toString(32)} ${(iy + 2).toString(32)}`);
			}
		}

		types.physics.push(`${(offset.x + pixels.width - 40).toString(32)} 1i ${(offset.x + pixels.width + 40).toString(32)} 1i`);
		types.powerups.push(`W ${(offset.x + pixels.width).toString(32)} 0 ${(offset.x + pixels.width + pixels.width * 10).toString(32)} 0`);
		offset.x += pixels.width * 10;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(pixels, 0, 0);
		data.imageBitmap.close();
		return;
	}

    switch(data.cmd) {
        case 'init':
			canvas.height = data.height;
			canvas.width = data.width;
			shouldFilter = data.filter;
			shouldInvert = data.invert;
            types.physics.splice(0);
            types.scenery.splice(0);
            types.powerups.splice(0);
			offset.x = -data.width;
            postMessage(data);
            break;

        case 'fetch':
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