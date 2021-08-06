import PhysicsLine from "./tools/PhysicsLine.js";

export default class {
    constructor(canvas) {
        this.canvas = canvas;

        this.canvas.onmousedown = t => this.onmousedown(t),
        this.canvas.onmousemove = t => this.onmousemove(t),
        this.canvas.onmouseup = t => this.onmouseup(t);
        this.canvas.oncontextmenu = () => false;

        this.ctx = this.canvas.getContext("2d");

        this.physics = {
            "-1": new PhysicsLine(-40, 50, 40, 50)
        },
        this.scenery = {},
        this.powerups = {};

        this.zoom = 1;

        this.item_id = 0;

        this.toolHandler = {
            selected: "physics",
            tools: [
                "physics",
                "scenery",
                "powerup"
            ]
        }

        this.fps = 60;
        this.ms = 1000 / this.fps;
        this.lastTime = -1;
        this.frame = null;

        requestAnimationFrame(this.tick.bind(this));
    }
    mouse = {
        down: false,
        old: {
            x: 0,
            y: 0
        },
        pos: {
            x: 0,
            y: 0
        }
    }
    tick(time) {
        this.frame = requestAnimationFrame(this.tick.bind(this)),
        this.delta = time - this.lastTime;
        if (this.delta < (1000 / this.fps)) {
            return;
        }
        //this.update(),
        this.draw();
    }
    onmousedown(t) {
        if (t.which != 1) return;
        this.mouse.down = true;
        this.mouse.old.x = this.mouse.pos.x;
        this.mouse.old.y = this.mouse.pos.y;
        this.mouse.pos.x = t.offsetX - this.canvas.width / 2;
        this.mouse.pos.y = t.offsetY - this.canvas.height / 2;
    }
    onmousemove(t) {
        this.mouse.pos.x = t.offsetX - this.canvas.width / 2;
        this.mouse.pos.y = t.offsetY - this.canvas.height / 2;
        if (this.mouse.down) {
            switch(this.toolHandler.selected) {
                case "physics":
                    this.physics[this.item_id] = new PhysicsLine(this.mouse.old.x, this.mouse.old.y, this.mouse.pos.x, this.mouse.pos.y);
                break;
            }
        }
    }
    onmouseup(t) {
        if (t.which != 1) return;
        this.mouse.down = false;
        this.mouse.pos.x = t.offsetX - this.canvas.width / 2;
        this.mouse.pos.y = t.offsetY - this.canvas.height / 2;
        switch(this.toolHandler.selected) {
            case "physics":
                this.physics[this.item_id++] = new PhysicsLine(this.mouse.old.x, this.mouse.old.y, this.mouse.pos.x, this.mouse.pos.y);
            break;
        }
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height),
        this.ctx.lineCap = "round",
        this.ctx.lineJoin = "round",
        this.ctx.save(),
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2),
        this.ctx.lineWidth = 2 * this.zoom;
        for (const t in this.physics) {
            this.ctx.strokeStyle = "#000000",
            this.ctx.beginPath(),
            this.physics[t].draw(this.ctx),
            this.ctx.stroke();
        }
        for (const t in this.scenery) {
            this.ctx.strokeStyle = "#AAAAAA",
            this.ctx.beginPath(),
            this.scenery[t].draw(this.ctx),
            this.ctx.stroke();
        }
        for (const t in this.powerups) {
            this.powerups[t].draw(this.ctx);
        }
        this.ctx.restore();
    }
    update() {
        if (this.mouse.down) {
            switch(this.toolHandler.selected) {
                case "physics":
                    this.toolHandler.touching = true;
                    console.log(this);
                break;
            }
        }
    }
    close() {
        cancelAnimationFrame(this.frame);
    }
}