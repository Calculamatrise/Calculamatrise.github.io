importScripts("/frhd/utils/Track.js");

this.track = new Track();
onmessage = function({ data }) {
    if (data.args.code != void 0 || (data.args.tracks != void 0 && data.args.tracks.length > 0)) {
        this.track.clear();
		this.track.import(data.args.code || '-18 1i 18 1i##');
		for (const track of data.args.tracks) {
            this.track.import(track);
        }
    }

    switch(data.cmd) {
        case 'transform':
            this.track.translate(data.args.translate.x, data.args.translate.y);
            this.track.rotate(data.args.rotationFactor);
            this.track.scale(data.args.scale.x, data.args.scale.y);
            this.track.flip(data.args.reflect.x, data.args.reflect.y);
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
    postMessage(data);
}