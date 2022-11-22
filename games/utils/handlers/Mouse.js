import EventEmitter from "/utils/EventEmitter.js";
import Vector from "../Vector.js";

export default class extends EventEmitter {
    down = false;
    position = new Vector();
    constructor(element = window) {
        super();
        const press = this.press.bind(this);
        const stroke = this.stroke.bind(this);
        const clip = this.clip.bind(this);
        element.addEventListener('pointerdown', press);
        element.addEventListener('pointermove', stroke);
        element.addEventListener('pointerup', clip);
        this.close = function() {
            element.removeEventListener('pointerdown', press);
            element.removeEventListener('pointermove', stroke);
            element.removeEventListener('pointerup', clip);
        }
    }

    press(event) {
        // down
        this.down = true;
    }

    stroke(event) {
        // move
        // this.position
    }

    clip(event) {
        this.down = false;
        // up
    }
}