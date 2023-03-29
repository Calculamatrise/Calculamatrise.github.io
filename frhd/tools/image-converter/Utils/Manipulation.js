export default class Manipulation {
    canvas = new OffscreenCanvas(0, 0);
    ctx = this.canvas.getContext('2d');
    image = new Image();
    worker = new Worker('./worker.js');
    constructor() {
        this.image.crossOrigin = 'Anonymous';
        this.image.onload = this.render.bind(this);
        this.worker.addEventListener('message', ({ data }) => {
            switch(data.cmd) {
                case 'move':
                    code.value = data.result;
                    break;

                case 'progress':
                    this.progress = data.progress;
                    break;

                case 'render':
                    this.image.value = null;
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

	/** @param {number} value */
    set progress(value) {
        value = ~~value;
        document.title = `Progress... ${value}%`;
        progress.setAttribute('value', value);
    }

    render() {
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        this.worker.postMessage({
            cmd: 'render',
            filter: true,
            invert: invert.checked,
            pixels: this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        });
    }
}