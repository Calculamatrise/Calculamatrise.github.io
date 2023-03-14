importScripts("/frhd/utils/Track.js");

let canvas = null;
let ctx = null;
this.track = new Track();
onmessage = async function ({ data }) {
	if ('canvas' in data) {
		canvas = data.canvas;
		ctx = canvas.getContext('2d');
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.lineWidth = 2;
		return;
	}

	if (data.args.code != void 0 || (data.args.tracks != void 0 && data.args.tracks.length > 0)) {
		this.track.clear();
		this.track.import(data.args.code);
		for (const track of data.args.tracks) {
			this.track.import(track);
		}
	}

	const combined = this.track.toString();
	switch (data.cmd) {
		case 'transform':
			typeof data.args.translate == 'object' && this.track.translate(data.args.translate.x, data.args.translate.y);
			this.track.rotate(data.args.rotationFactor || 0);
			typeof data.args.scale == 'object' && this.track.scale(data.args.scale.x, data.args.scale.y);
			typeof data.args.reflect == 'object' && this.track.flip(data.args.reflect.x, data.args.reflect.y);
			this.track.import(combined);
			break;

		case 'translate':
			this.track.translate(data.args.x, data.args.y);
			break;

		case 'rotate':
			this.track.rotate(data.args.rotationFactor);
			break;

		case 'scale':
			this.track.scale(data.args.x, data.args.y);
			break;

		case 'reflect':
			this.track.flip(data.args.x, data.args.y);
			break;
	}

	data.args.code = this.track.toString();
	this.track.getImageData();
	postMessage(data);
}

Track.prototype.getImageData = function() {
	ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    let combined = [...this.physics, ...this.scenery];
	let limitX = combined.flatMap(r => r.filter((t, i) => i % 2 == 0)).sort((a, b) => a - b);
	ctx.canvas.width = 4000;
	let limitY = combined.flatMap(r => r.filter((t, i) => i % 2)).sort((a, b) => a - b);
	ctx.canvas.height = 2000;
    ctx.translate(Math.abs(limitX[0]), Math.abs(limitY[0]));
    ctx.strokeStyle = '#000';
    for (const t of this.physics) {
        for (let e = 0; e < t.length; e += 2) {
            ctx.beginPath();
            ctx.moveTo(t[e], t[e + 1]);
            ctx.lineTo(t[e + 2], t[e + 3]);
            ctx.stroke();
        }
    }

    ctx.strokeStyle = '#AAA';
    for (const t of this.scenery) {
        for (let e = 0; e < t.length; e += 2) {
            ctx.beginPath();
            ctx.moveTo(t[e], t[e + 1]);
            ctx.lineTo(t[e + 2], t[e + 3]);
            ctx.stroke();
        }
    }
}