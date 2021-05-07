import Track from "./track/Track.js";
import MTB from "./bike/MTB.js";
import BMX from "./bike/BMX.js";
import { canvas, ctx } from "../bootstrap.js";

const Bike = { MTB, BMX }

export class Ride {
    constructor(t) {
        this.track = new Track(canvas, { code: t, editor: true });
        this.track.players.push(this.track.firstPlayer = new Bike[this.track.vehicle](this.track, 1, []));
        this.track.cameraFocus = this.track.firstPlayer.head;
        this.fps = 25;
        this.lastFrameTime = -1;
        this.animationFrame = null;
    }
    startTicker(time) {
        this.delta = time - this.lastFrameTime;
        if (this.delta < 1000 / this.fps) {
            this.animationFrame = requestAnimationFrame(this.startTicker.bind(this));
            return;
        }
        this.track.update(this.delta);
        this.track.render(ctx);
        this.lastFrameTime = time;
        this.animationFrame = requestAnimationFrame(this.startTicker.bind(this));
    }
    close() {
        cancelAnimationFrame(this.animationFrame);
    }
    static get Track() {
        return this.track;
    }
}