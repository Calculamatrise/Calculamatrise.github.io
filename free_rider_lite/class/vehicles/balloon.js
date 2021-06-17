import s from "../math/cartesian.js";
import a from "./canopy.js";
import n from "./mass.js";
import r from "./spring.js";
import Vehicle from "./vehicle.js";

let h = {
    BALLOON_ON: "balloon_on"
}

export default class extends Vehicle {
    constructor(t, e) {
        super();
        this.vehicleInit(t);
        this.createMasses(e);
        this.createSprings();
        this.stopSounds();
        this.focalPoint = this.head;
    }
    vehicleName = "BALLOON";
    head = null;
    basket = null;
    masses = null;
    springs = null;
    slow = !1;
    vehicleInit = this.init;
    crashed = !1;
    createMasses(t) {
        this.masses = [];
        var e = new a(t.x,t.y - 10,this);
        e.radius = 30;
        var i = new n;
        i.init(new s(t.x,t.y + 35), this),
        i.friction = .1,
        this.masses.push(e),
        this.masses.push(i),
        this.head = this.masses[0],
        this.basket = this.masses[1];
        var r = this;
        this.masses[0].drive = this.head.drive = function() {
            r.explode()
        }
    }
    updateCameraFocalPoint() {}
    createSprings() {
        this.springs = [];
        var t = new r(this.head,this.basket,this);
        t.springConstant = .2,
        t.dampConstant = .2,
        t.lrest = t.leff = 45,
        this.springs.push(t)
    }
    update() {
        if (this.crashed === !1 && this.updateSound(),
        this.explosion)
            this.explosion.update();
        else {
            this.head.wind = !this.basket.contact,
            this.slow = !1;
            for (var t = this.springs, e = t.length, i = e - 1; i >= 0; i--)
                t[i].update();
            for (var s = this.masses, n = s.length, r = n - 1; r >= 0; r--)
                s[r].update();
            for (var i = e - 1; i >= 0; i--)
                t[i].update();
            for (var r = n - 1; r >= 0; r--)
                s[r].update()
        }
    }
    updateSound() {
        if (this.player.isInFocus()) {
            var t = this.scene.sound
                , e = this.gamepad;
            e.isButtonDown("up") ? t.play(h.BALLOON_ON, .6) : e.isButtonDown("up") || t.stop(h.BALLOON_ON)
        }
    }
    stopSounds() {
        var t = this.scene.sound;
        t.stop(h.BALLOON_ON)
    }
    draw() {
        if (this.explosion)
            this.explosion.draw(1);
        else {
            var t = this.scene.game.canvas.getContext("2d");
            if (this.settings.developerMode)
                for (var e = this.masses, i = e.length, s = i - 1; s >= 0; s--)
                    e[s].draw();
            t.globalAlpha = this.player._opacity,
            this.drawBalloon(t),
            t.globalAlpha = 1
        }
    }
    drawBalloon(t) {
        var e = this.scene
            , i = this.basket.pos.toScreen(e)
            , s = this.head.pos.toScreen(e)
            , n = e.camera.zoom
            , r = s.x - i.x
            , o = s.y - i.y
            , a = -o
            , h = r;
        t.save(),
        t.strokeStyle = "#999999",
        t.lineWidth = 1,
        t.beginPath(),
        t.moveTo(i.x + .1 * a, i.y + .1 * h),
        t.lineTo(i.x + .5 * r + .4 * a, i.y + .5 * o + .4 * h),
        t.moveTo(i.x - .1 * a, i.y - .1 * h),
        t.lineTo(i.x + .5 * r - .4 * a, i.y + .5 * o - .4 * h),
        t.moveTo(i.x + .1 * a, i.y + .1 * h),
        t.lineTo(i.x + .36 * r + .2 * a, i.y + .36 * o + .2 * h),
        t.moveTo(i.x - .1 * a, i.y - .1 * h),
        t.lineTo(i.x + .36 * r - .2 * a, i.y + .36 * o - .2 * h),
        t.closePath(),
        t.stroke(),
        this.head.draw(t),
        this.gamepad.isButtonDown("up") && (t.beginPath(),
        t.strokeStyle = "#FFFF00",
        t.lineWidth = 8 * n,
        t.moveTo(i.x, i.y),
        t.lineTo(i.x + .1 * r, i.y + .1 * o),
        t.closePath(),
        t.stroke(),
        t.beginPath(),
        t.strokeStyle = "#FFAA00",
        t.lineWidth = 3 * n,
        t.moveTo(i.x, i.y),
        t.lineTo(i.x + .1 * r, i.y + .1 * o),
        t.closePath(),
        t.stroke()),
        t.beginPath(),
        t.fillStyle = "#000000",
        t.moveTo(i.x + .1 * a, i.y + .1 * h),
        t.lineTo(i.x - .1 * a, i.y - .1 * h),
        t.lineTo(i.x - .22 * r - .1 * a, i.y - .22 * o - .1 * h),
        t.lineTo(i.x - .22 * r + .1 * a, i.y - .22 * o + .1 * h),
        t.lineTo(i.x + .1 * a, i.y + .1 * h),
        t.closePath(),
        t.fill(),
        t.restore()
    }
}