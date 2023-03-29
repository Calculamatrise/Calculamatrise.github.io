const offscreen = view.transferControlToOffscreen();
const video = document.createElement('video');
video.addEventListener('play', event => event.target.videoFrameCallback = event.target.requestVideoFrameCallback(render));
video.addEventListener('ended', () => worker.postMessage({ cmd: 'fetch' }));
video.addEventListener('loadeddata', event => {
	event.target.cancelVideoFrameCallback(event.target.videoFrameCallback);
	event.target.pause();
	event.target.currentTime = 0;
	// const [track] = captureStream.getVideoTracks();
	// this.imageCapture = new ImageCapture(track);
	worker.postMessage({
		cmd: 'init',
		height: event.target.videoHeight,
		width: event.target.videoWidth
	});
});

const worker = new Worker('./worker.js');
worker.postMessage({ canvas: offscreen }, [offscreen]);
worker.addEventListener('message', ({ data }) => {
	if ('blob' in data) {
		console.log(data.blob, URL.createObjectURL(data.blob));
		return;
	}

	switch(data.cmd) {
		case 'play':
			video.play();
			break;
	}
});

input.addEventListener('input', async event => {
	const [file] = event.target.files;
	file && worker.postMessage({ blob: file });
	file && (video.src = URL.createObjectURL(file));
});

function render() {
	createImageBitmap(video).then(imageBitmap => {
		worker.postMessage({ imageBitmap }, [imageBitmap]);
	});
	progress.value = Math.round(video.currentTime / video.duration * 100);
	video.videoFrameCallback = video.requestVideoFrameCallback(render);
}