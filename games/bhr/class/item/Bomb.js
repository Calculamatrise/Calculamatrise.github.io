import Item from "./Item.js";
import Explosion from "../effect/Explosion.js";

export default class Bomb extends Item {
    activate(part) {
        if (part.parent instanceof Explosion || part.parent.parent.dead)
            return;

        part.parent.parent.createExplosion();
    }
    get type() {
        return "O";
    }
    get color() {
        return "#f00";
    }
}