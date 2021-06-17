import "../../libs/lodash.js";

import i from "../math/cartesian.js";
import Tool from "./tool.js";

export default class extends Tool {
    constructor(t) {
        super();
        this.toolInit(t);
        let e = t.scene.settings.eraser;
        this.options = e;
        this.eraserPoint = new i;
        this.erasedObjects = [];
    }
    toolInit = this.init;
    toolUpdate = this.update();
    name = "Eraser";
    options = null;
    reset() {
        this.recordActionsToToolhandler()
    }
    press() {
        this.recordActionsToToolhandler()
    }
    recordActionsToToolhandler() {
        this.erasedObjects.length > 0 && this.toolhandler.addActionToTimeline({
            type: "remove",
            objects: n.flatten(this.erasedObjects)
        }),
        this.erasedObjects = []
    }
    release() {
        this.recordActionsToToolhandler()
    }
    hold() {
        var t = this.mouse.touch
          , e = t.pos
          , i = this.scene.track
          , s = this.scene.screen
          , n = this.scene.camera
          , o = s.center
          , a = n.position
          , h = (e.x - o.x) / n.zoom + a.x
          , l = (e.y - o.y) / n.zoom + a.y;
        this.eraserPoint.x = Math.round(h),
        this.eraserPoint.y = Math.round(l);
        var c = i.erase(this.eraserPoint, this.options.radius / this.scene.camera.zoom, this.options.types);
        c.length > 0 && this.erasedObjects.push(c)
    }
    draw() {
        var t = this.scene
          , e = (t.game.canvas,
        t.game.canvas.getContext("2d"));
        this.drawEraser(e)
    }
    drawEraser(t) {
        {
            var e = this.mouse.touch
              , i = e.pos;
            this.camera.zoom
        }
        t.beginPath(),
        t.arc(i.x, i.y, this.options.radius, 0, 2 * Math.PI, !1),
        t.lineWidth = 1,
        t.fillStyle = "rgba(255,255,255,0.8)",
        t.fill(),
        t.strokeStyle = "#000000",
        t.stroke()
    }
    setOption(t, e) {
        this.options[t] = e
    }
    getOptions() {
        return this.options
    }
    update() {
        var t = this.toolhandler.gamepad
          , e = this.mouse;
        t.isButtonDown("shift") && e.mousewheel !== !1 && this.adjustRadius(e.mousewheel),
        this.toolUpdate()
    }
    adjustRadius(t) {
        var e = this.options.radius
          , i = this.options.radiusSizeSensitivity
          , s = this.options.maxRadius
          , n = this.options.minRadius
          , r = t > 0 ? i : -i;
        e += r,
        n > e ? e = n : e > s && (e = s),
        this.setOption("radius", e)
    }
}