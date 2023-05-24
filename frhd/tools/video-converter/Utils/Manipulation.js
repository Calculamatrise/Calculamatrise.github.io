export default class {
    scale = -5;
    video = document.createElement('video');
	videoFrameCallback = null;
    worker = new Worker('./worker.js');
    constructor(view) {
		this.video.muted = true;
        this.video.addEventListener('play', () => this.videoFrameCallback = this.video.requestVideoFrameCallback(this.render.bind(this)));
        this.video.addEventListener('ended', () => this.worker.postMessage({ cmd: 'fetch' }));
        // const captureStream = this.video.captureStream(30);
		this.video.addEventListener('loadeddata', () => {
			this.video.cancelVideoFrameCallback(this.videoFrameCallback);
			this.video.pause();
			this.video.currentTime = 0;
			// const [track] = captureStream.getVideoTracks();
			// this.imageCapture = new ImageCapture(track);
            this.worker.postMessage({
                cmd: 'init',
				filter: true,
				height: this.video.videoHeight * this.#scale,
            	invert: invert.checked,
                width: this.video.videoWidth * this.#scale
            });
        });

		const offscreen = view.transferControlToOffscreen();
		this.worker.postMessage({ canvas: offscreen }, [offscreen]);
        this.worker.addEventListener('message', ({ data }) => {
            switch(data.cmd) {
                case 'init':
                    this.video.play();
                    break;

                case 'fetch':
                    document.title = 'Ready!';
                    if (~~data.size > 16e4) {
                        if (!confirm("The result is a quite large; would you like to download the converted track instead?")) return;
						Object.assign(document.createElement('a'), {
							download: 'frhd_track-' + new Intl.DateTimeFormat('en-CA', { dateStyle: 'short', timeStyle: 'medium' }).format().replace(/[/:]/g, '-').replace(/,+\s*/, '_').replace(/\s+.*$/, ''),
							   href: window.URL.createObjectURL(new Blob([data.result], { type: 'text/plain' }))
						}).dispatchEvent(new MouseEvent('click'));
                        return;
                    }

                    code.value = data.result;
                    break;
            }
        });
    }

    get #scale() {
        return Math.abs(this.scale ** (this.scale / Math.abs(this.scale))); // Math.abs(this.scale / this.scale ** 2);
    }

    /** @param {number} value */
    set progress(value) {
        value = ~~value;
        document.title = `Progress... ${value}%`;
        progress.setAttribute('value', value);
    }

    render() {
		// this.imageCapture.grabFrame();
        createImageBitmap(this.video).then(imageBitmap => {
			this.worker.postMessage({ imageBitmap }, [imageBitmap]);
			// this.worker.postMessage({ imageBitmap }, [imageBitmap]); // duplicate so track plays video at the correct frame-rate
		});
		this.progress = Math.round(this.video.currentTime / this.video.duration * 100);
        this.videoFrameCallback = this.video.requestVideoFrameCallback(this.render.bind(this));
    }
}