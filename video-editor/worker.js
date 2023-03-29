self.frames = [];
addEventListener('message', async ({ data }) => {
	if ('canvas' in data) {
		self.canvas = data.canvas;
		self.ctx = self.canvas.getContext('2d');
		self.quickCtx = self.canvas.getContext('2d', { willReadFrequently: true });
	} else if ('imageBitmap' in data) {
		self.ctx.drawImage(data.imageBitmap, 0, 0);
		const imageData = self.quickCtx.getImageData(0, 0, self.canvas.width, self.canvas.height);
		self.frames.push(imageData);
		filter(imageData);
		self.ctx.putImageData(imageData, 0, 0);
		self.frames.push(imageData);
	} else if ('blob' in data) {
		self.blob = data.blob;
		self.arrayBuffer = await self.blob.arrayBuffer();
	} else {
		switch (data.cmd) {
			case 'init': {
				self.canvas.height = data.height;
				self.canvas.width = data.width;
				self.postMessage({ cmd: 'play' });
				break;
			}

			case 'fetch': {
				console.log(self.blob.arrayBuffer())
				self.postMessage({ blob: new Blob([self.arrayBuffer.slice(1200, 4e5)], { type: self.blob.type }) });
				break;
			}
		}
	}
});

function filter(pixels) {
	for (let t = 0, e = 0; t in pixels.data; t += 4) {
		e = pixels.data[t] * .2 + pixels.data[t + 1] * .7 + pixels.data[t + 2] * .1;
		pixels.data[t] = pixels.data[t + 1] = pixels.data[t + 2] = e <= 85 ? 0 : e <= 170 ? 170 : 255;
	}
	return pixels;
}

function handleFrame() {
	console.log('omg', ...arguments)
}