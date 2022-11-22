importScripts("./utils/Track.js");
onmessage = function({ data }) {
    if (this.track == void 0 || data.args.code != void 0 || (data.args.tracks != void 0 && data.args.tracks.length > 0)) {
        this.track = new Track(data.args.code);
        for (const track of data.args.tracks) {
            this.track.import(track);
        }
    }

    switch(data.cmd) {
        case 'transform':
            this.track.move(data.args.move.x, data.args.move.y);
            this.track.rotate(data.args.rotationFactor);
            this.track.scale(data.args.scale.x, data.args.scale.y);
            this.track.flip(data.args.reflect.x, data.args.reflect.y);
            break;

        case 'move':
            this.track.move(data.args.x, data.args.y);
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

    data.args.code = this.track.code;
    postMessage(data);
}