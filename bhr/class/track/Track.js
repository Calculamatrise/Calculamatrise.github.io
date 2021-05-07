import Vector from "../Vector.js";
import MTB from "../bike/MTB.js";
import BMX from "../bike/BMX.js";
import { Lb, Mb } from "../../constant/variable.js";
import PhysicsLine from "../item/line/PhysicsLine.js";
import SceneryLine from "../item/line/SceneryLine.js";
import UndoManager from "../history/UndoManager.js";
import tool from "../../constant/tool.js";
import { ctx } from "../../bootstrap.js";
import Sector from "./Sector.js";
import Grid from "../grid/Grid.js";
import RenderCell from "../grid/cell/RenderCell.js";
import PhysicsCell from "../grid/cell/PhysicsCell.js";
import { MAX_ZOOM, MIN_ZOOM, TRACK_DEFAULT } from "../../constant/TrackConstants.js";
import { GRID_CELL_SIZE } from "../../constant/GridConstants.js";

export default class Track {
    constructor(canvas, options = {}) {
        this.scale = 100;

        this.canvas = canvas;

        this.id = options.id;

        this.zoomFactor = 0.6;
        this.cameraLock = !1;
        this.camera = new Vector();
        this.origin = new Vector();

        this.grid = new Grid(GRID_CELL_SIZE, PhysicsCell);
        this.sectors = new Grid(GRID_CELL_SIZE, PhysicsCell);

        this.grid = new Grid(GRID_CELL_SIZE, RenderCell);
        this.sectors = new Grid(GRID_CELL_SIZE, RenderCell);


        this.vehicle = "BMX";
        this.players = [];
        this.editor = options.editor || false;
        this.paused = false;
        this.displayText = false;
        this.lineShading = false;

        if (options.editor) {
            tool.selected = "line";
        }
        this.code = options.code || TRACK_DEFAULT;
        this.targets = 0;
        this.powerups = [];

        this.time = 0;
        
        this.undoManager = new UndoManager();

        this.read(this.code);
        window.Game.watchGhost = this.watchGhost
    }
    zoom(direction = 1) {
        this.zoomFactor = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, 10 * this.zoomFactor + 2 * direction) / 10)
        this.sectors = {};
    }
    switchBike() {
        this.vehicle = "BMX" === this.vehicle ? "MTB" : "BMX";
        this.reset()
    }
    gotoCheckpoint() {
        this.removeCollectedItems();
        this.paused = !1; // JSON.parse(localStorage.pauseOnEnter) ? true : !1;
        let checkpoints = this.firstPlayer.checkpoints,
            checkpointsCache = this.firstPlayer.checkpointsCache;
        this.firstPlayer = this.players[0] = this.vehicle === "BMX" ? new BMX(this, 1, this.firstPlayer.checkpoints) : new MTB(this, 1, this.firstPlayer.checkpoints);
        if (this.firstPlayer) {
            if (checkpoints.length > 0) {
                let cp = checkpoints[checkpoints.length - 1];
                this.firstPlayer.checkpointsCache = checkpointsCache;
                this.time = cp.time;
            } else
                this.time = 0;
            this.cameraFocus = this.firstPlayer.head,
            this.camera = this.firstPlayer.head.pos.clone();
        }
        if (this.players.length > 1) {
            for (let i = 1; i < this.players.length; i++) {
                checkpoints = this.players[i].checkpoints,
                checkpointsCache = this.players[i].checkpointsCache;
                this.players[i] = this.ghost_data[6] === "BMX" ? new BMX(this, 1, this.players[i].checkpoints, this.ghost_data) : new MTB(this, 1, this.players[i].checkpoints, this.ghost_data);
                this.players[i].checkpoints = checkpoints;
                this.players[i].checkpointsCache = checkpointsCache;
                if (!this.firstPlayer || this.time == 0) {
                    this.cameraFocus = this.players[i].head
                }
            }
        }
    }
    removeCheckpoint() {
        for (let i in this.players) {
            if (this.players[i].checkpoints.length > 0) {
                if (this.players[i].checkpointsCache !== void 0) {
                    this.players[i].checkpointsCache.push(this.players[i].checkpoints[this.players[i].checkpoints.length - 1]);
                }
                this.players[i].checkpoints.pop()
            }
        }
    }
    removeCheckpointUndo() {
        for (let i in this.players) {
            if (this.players[i].checkpointsCache.length > 0) {
                if (this.players[i].checkpoints !== void 0) {
                    checkpoints.push(checkpointsCache[checkpointsCache.length - 1]);
                    this.players[i].checkpoints.push(this.players[i].checkpointsCache[this.players[i].checkpointsCache.length - 1]);
                }
                this.players[i].checkpointsCache.pop()
            }
        }
    }
    reset() {
        this.firstPlayer.checkpoints = [];
        this.firstPlayer.checkpointsCache = [];
        if (this.players.length > 1) {
            for (let i = 1; i < this.players.length; i++) {
                this.players[i].checkpoints = [];
                this.players[i].checkpointsCache = [];
            }
        }
        this.gotoCheckpoint()
    }
    removeCollectedItems() {
        let a, b, c, d, e;
        for (a in this.grid) {
            if (this.grid.hasOwnProperty(a)) {
                for (b in this.grid[a]) {
                    if (this.grid[a].hasOwnProperty(b)) {
                        e = this.grid[a][b];
                        c = 0;
                        for (d = e.powerups.length; c < d; c++) {
                            if (e.powerups[c].used !== void 0) {
                                e.powerups[c].used = !1
                            }
                        }
                    }
                }
            }
        }
    }
    watchGhost(a, b) {
        b = b || track
        , e = [], c, d;
        !function(a) {
            e.push(a);
            d && (c = a(c));
        }(function(a) {
            let c = [{}, {}, {}, {}, {}];
            5 < a.split(",").length && (c = c.concat(a.split(",").slice(5)));
            for (let d = 0, e, m, n; 5 > d; d++) {
                n = a.split(",")[d].split(" ");
                e = 0;
                for (m = n.length - 1; e < m; e++)
                    c[d][n[e]] = 1
            }
            b.ghost_data = c
            b.players.push(b.ghost_data[6] === "BMX" ? new BMX(this, 1, [], b.ghost_data) : new MTB(this, 1, [], b.ghost_data))
            b.reset()
        });
        !function(a) {
            d = !0;
            c = a;
            for (let b = 0, f = e.length; b < f; b++) {
                e[b](a)
            }
        }(a);
        this.paused = !1;
    }
    collide(a) {
        let x = Math.floor(a.pos.x / this.scale - 0.5),
            y = Math.floor(a.pos.y / this.scale - 0.5),
            grid = this.grid;
        if (grid[x] !== void 0) {
            if (grid[x][y] !== void 0) {
                grid[x][y].za()
            }
            if (grid[x][y + 1] !== void 0) {
                grid[x][y + 1].za()
            }
        }
        if (grid[x + 1] !== void 0) {
            if (grid[x + 1][y] !== void 0) {
                grid[x + 1][y].za()
            }
            if (grid[x + 1][y + 1] !== void 0) {
                grid[x + 1][y + 1].za()
            }
        }
        if (grid[x] !== void 0 && grid[x][y] !== void 0) {
            grid[x][y].collide(a)
        }
        if (grid[x + 1] !== void 0) {
            if (grid[x + 1][y] !== void 0) {
                grid[x + 1][y].collide(a)
            }
            if (grid[x + 1][y + 1] !== void 0) {
                grid[x + 1][y + 1].collide(a)
            }
        }
        if (grid[x] !== void 0 && grid[x][y + 1] !== void 0) {
            grid[x][y + 1].collide(a)
        }
        return this
    }
    update(t) {
        if (!this.paused) {
            for (let i in this.players) {
                this.players[i].update(t);
            }
            this.time += 1000 / 25
        }
        if (this.cameraFocus) {
            this.camera.addToSelf(this.cameraFocus.pos.sub(this.camera).scale(0.3))
        }
        return this
    }
    render(ctx) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.lineWidth = Math.max(2 * this.zoomFactor, 0.5);
        if (this.cameraLock && ["line", "scenery line", "brush", "scenery brush", "teleporter"].includes(tool.selected)) {
            if (tool.mouse.pos.toPixel(this).x < 50) {
                this.camera.x -= 10 / this.zoomFactor;
                tool.mouse.pos.x -= 10 / this.zoomFactor;
            } else {
                if (tool.mouse.pos.toPixel(this).x > this.canvas.width - 50) {
                    this.camera.x += 10 / this.zoomFactor;
                    tool.mouse.pos.x += 10 / this.zoomFactor;
                }
            }
            if (tool.mouse.pos.toPixel(this).y < 50) {
                this.camera.y -= 10 / this.zoomFactor;
                tool.mouse.pos.y -= 10 / this.zoomFactor;
            } else {
                if (tool.mouse.pos.toPixel(this).y > this.canvas.height - 50) {
                    this.camera.y += 10 / this.zoomFactor;
                    tool.mouse.pos.y += 10 / this.zoomFactor;
                }
            }
            ctx.strokeStyle = "#f00";
            ctx.beginPath();
            ctx.moveTo(tool.mouse.old.toPixel(this).x, tool.mouse.old.toPixel(this).y);
            ctx.lineTo(tool.mouse.pos.toPixel(this).x, tool.mouse.pos.toPixel(this).y);
            ctx.stroke();
        }
        let topLeft = (new Vector(0,0)).adjustToCanvas(this);
        let bottomRight = (new Vector(this.canvas.width, this.canvas.height)).adjustToCanvas(this);
        topLeft.x = Math.floor(topLeft.x / this.scale);
        topLeft.y = Math.floor(topLeft.y / this.scale);
        bottomRight.x = Math.floor(bottomRight.x / this.scale);
        bottomRight.y = Math.floor(bottomRight.y / this.scale);
        
        let m = [], n, x, w, y, C;
        for (let w = topLeft.x; w <= bottomRight.x; w++) {
            for (let y = topLeft.y; y <= bottomRight.y; y++) {
                if (this.grid[w] !== void 0 && this.grid[w][y] !== void 0) {
                    if (this.grid[w][y].physics.length > 0 || this.grid[w][y].scenery.length > 0) {
                        m[C = w + "_" + y] = 1;
                        if (this.sectors[C] === void 0) {
                            n = this.sectors[C] = document.createElement("canvas");
                            n.width = this.scale * this.zoomFactor;
                            n.height = this.scale * this.zoomFactor;
                            let M = n.getContext("2d");
                            M.lineCap = "round";
                            M.lineWidth = Math.max(2 * this.zoomFactor, 0.5);
                            M.strokeStyle = "#aaa";
                            n = 0;
                            for (x = this.grid[w][y].scenery.length; n < x; n++)
                            this.grid[w][y].scenery[n].draw(M, w * this.scale * this.zoomFactor, y * this.scale * this.zoomFactor);
                            M.strokeStyle = "#000";
                            this.lineShading && (M.shadowOffsetX = M.shadowOffsetY = 2,
                            M.shadowBlur = Math.max(2, 10 * this.zoomFactor),
                            M.shadowColor = "#000");
                            n = 0;
                            for (x = this.grid[w][y].physics.length; n < x; n++)
                                this.grid[w][y].physics[n].draw(M, w * this.scale * this.zoomFactor, y * this.scale * this.zoomFactor)
                        }
                        ctx.drawImage(this.sectors[C], Math.floor(this.canvas.width / 2 - this.camera.x * this.zoomFactor + w * this.scale * this.zoomFactor), Math.floor(this.canvas.height / 2 - this.camera.y * this.zoomFactor + y * this.scale * this.zoomFactor))
                    }
                    ctx.strokeStyle = "#000";
                    n = 0;
                    for (x = this.grid[w][y].powerups.length; n < x; n++) {
                        this.grid[w][y].powerups[n].draw();
                    }
                }
            }
        }
        for (let X in this.sectors)
            m[X] === void 0 && delete this.sectors[X];
        if (250 !== this.canvas.width) {
            if (tool.selected !== "camera" && !this.cameraFocus)
                switch (tool.selected) {
                    case "line":
                    case "scenery line":
                    case "brush":
                    case "scenery brush":
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "#000";
                        w = tool.mouse.pos.toPixel(this).x;
                        y = tool.mouse.pos.toPixel(this).y;
                        ctx.beginPath(),
                        ctx.moveTo(w - 10, y),
                        ctx.lineTo(w + 10, y),
                        ctx.moveTo(w, y + 10),
                        ctx.lineTo(w, y - 10),
                        ctx.stroke();
                        break;
                    case "eraser":
                        tool.eraser.draw();
                        break;
                    case "goal":
                    case "checkpoint":
                    case "bomb":
                    case "slow-mo":
                    case "antigravity":
                    case "teleporter":
                        ctx.fillStyle = tool.selected == "goal" ? "#ff0" : tool.selected == "checkpoint" ? "#00f" : tool.selected == "bomb" ? "#f00" : tool.selected == "slow-mo" ? "#eee" : tool.selected == "antigravity" ? "#0ff" : "#f0f";
                        ctx.beginPath(),
                        ctx.arc(tool.mouse.pos.toPixel(this).x, tool.mouse.pos.toPixel(this).y, 7 * this.zoomFactor, 0, 2 * Math.PI, !0),
                        ctx.fill(),
                        ctx.stroke();
                        break;
                    case "boost":
                    case "gravity":
                        ctx.beginPath(),
                        ctx.fillStyle = tool.selected == "boost" ? "#ff0" : "#0f0",
                        ctx.save();
                        if (this.cameraLock) {
                            ctx.translate(tool.mouse.old.toPixel(this).x, tool.mouse.old.toPixel(this).y),
                            ctx.rotate(Math.atan2(-(tool.mouse.pos.x - tool.mouse.old.x), tool.mouse.pos.y - tool.mouse.old.y));
                        } else {
                            ctx.translate(tool.mouse.pos.toPixel(this).x, tool.mouse.pos.toPixel(this).y);
                        }
                        ctx.moveTo(-7 * this.zoomFactor, -10 * this.zoomFactor),
                        ctx.lineTo(0, 10 * this.zoomFactor),
                        ctx.lineTo(7 * this.zoomFactor, -10 * this.zoomFactor),
                        ctx.lineTo(-7 * this.zoomFactor, -10 * this.zoomFactor),
                        ctx.fill(),
                        ctx.stroke(),
                        ctx.restore()
                }
            ctx.beginPath();
            ctx.fillStyle = "#ff0";
            ctx.lineWidth = 1;
            ctx.arc(40, 12, 3.5, 0, 2 * Math.PI, !0),
            ctx.fill(),
            ctx.stroke(),
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = "#fff";
            ctx.fillStyle = "#000";
            let e = Math.floor(this.time / 6E4);
            let h = Math.floor(this.time % 6E4 / 1E3);
            if (e < 10) {
                e = "0" + e;
            }
            if (h < 10) {
                h = "0" + h;
            }
            let i = e + ":" + h + "." + Math.floor((this.time - 6E4 * e - 1E3 * h) / 100);
            if (this.paused && !window.autoPause) {
                i += " - Game paused";
            } else if (this.firstPlayer && this.firstPlayer.dead) {
                i = "Press ENTER to restart";
                if (this.firstPlayer.checkpoints.length > 1) {
                    i += " or BACKSPACE to cancel Checkpoint"
                }
            } else if (this.id === void 0) {
                if (tool.grid === 10 && "line\\scenery line\\brush\\scenery brush".split(/\\/).includes(tool.selected)) {
                    i += " - Grid ";
                }
                i += " - " + tool.selected;
                if ("brush\\scenery brush".split(/\\/).includes(tool.selected)) {
                    i += " ( size " + tool.brush.length + " )";
                }
            }
            if (this.displayText) {
                if (this.displayText[2] !== void 0) {
                    if (!this.displayText[0] && !this.displayText[1]) {
                        i += " - " + (this.paused ? "Unp" : "P") + "ause ( SPACE )";
                    }
                }
            }
            ctx.strokeText(i = ": " + this.firstPlayer.targetsCollected + " / " + this.targets + "  -  " + i, 50, 16);
            ctx.fillText(i, 50, 16);
            if (this.players.length > 1) {
                for (let i = 1; i < this.players.length; i++) {
                    ctx.fillStyle = "#aaa";
                    ctx.textAlign = "right";
                    ctx.strokeText(i = (this.players[i].name || "Ghost") + (this.players[i].targetsCollected === this.targets ? " finished!" : ": " + this.players[i].targetsCollected + " / " + this.targets), this.canvas.width - 7, 16);
                    ctx.fillText(i, this.canvas.width - 7, 16);
                    ctx.textAlign = "left";
                    ctx.fillStyle = "#000";
                }
            }
            if (this.displayText) {
                if (this.displayText[2] !== void 0) {
                    if (this.displayText[0]) {
                        ctx.textAlign = "right";
                        if (document.documentElement.offsetHeight <= window.innerHeight) {
                            ctx.strokeText(this.displayText[2], this.canvas.width - 36, 15 + 25 * this.displayText[1]);
                            ctx.fillText(this.displayText[2], this.canvas.width - 36, 15 + 25 * this.displayText[1]);
                        } else {
                            ctx.strokeText(this.displayText[2], this.canvas.width - 51, 15 + 25 * this.displayText[1]);
                            ctx.fillText(this.displayText[2], this.canvas.width - 51, 15 + 25 * this.displayText[1]);
                        }
                        ctx.textAlign = "left";
                    } else {
                        ctx.strokeText(this.displayText[2], 36, 15 + 25 * this.displayText[1]);
                        ctx.fillText(this.displayText[2], 36, 15 + 25 * this.displayText[1]);
                    }
                }
            }
            if (this.Ab) {
                let b = (this.canvas.width - 250) / 2;
                let c = (this.canvas.height - 150) / 2;
                ctx.lineWidth = 1;
                ctx.strokeStyle = "#fff";
                ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                ctx.fillRect(0, 0, this.canvas.width, c);
                ctx.fillRect(0, c + 150, this.canvas.width, c);
                ctx.fillRect(0, c, b, 150);
                ctx.fillRect(b + 250, c, b, 150);
                ctx.strokeRect(b, c, 250, 150);
            }
        }



        for (let i in this.players) {
            this.players[i].draw();
        }
        tool.draw.left;
        if ("eraser\\brush\\scenery brush".split(/\\/).includes(tool.selected)) {
            tool.draw.bottomLeft;
        }
        if (this.editor) {
            tool.draw.right;
        }
    }
    erase(a) {
        function b(b) {
            (b = b.erase(a)) && l.push(b)
        }
        let t = Math.floor(a.x / this.scale - 0.5), d = Math.floor(a.y / this.scale - 0.5), e = this.grid[t], c = this.grid[t + 1], f, h, i, l = [];
        if (e !== void 0) {
            f = e[d];
            h = e[d + 1];
            if (f !== void 0) {
                if (tool.eraser.settings.physics) {
                    for (e = 0, i = f.physics.length; e < i; e++) {
                        f.physics[e] && b(f.physics[e]);
                    }
                }
                if (tool.eraser.settings.scenery) {
                    for (e = 0, i = f.scenery.length; e < i; e++) {
                        f.scenery[e] && b(f.scenery[e]);
                    }
                }
                if (tool.eraser.settings.powerups) {
                    for (e = 0, i = f.powerups.length; e < i; e++) {
                        f.powerups[e] && b(f.powerups[e]);
                    }
                }
            }
            if (h !== void 0) {
                if (tool.eraser.settings.physics) {
                    for (e = 0, i = h.physics.length; e < i; e++) {
                        h.physics[e] && b(h.physics[e]);
                    }
                }
                if (tool.eraser.settings.scenery) {
                    for (e = 0, i = h.scenery.length; e < i; e++) {
                        h.scenery[e] && b(h.scenery[e]);
                    }
                }
                if (tool.eraser.settings.powerups) {
                    for (e = 0, i = h.powerups.length; e < i; e++) {
                        h.powerups[e] && b(h.powerups[e])
                    }
                }
            }
        }
        if (c !== void 0) {
            f = c[d];
            d = c[d + 1];
            if (f !== void 0) {
                if (tool.eraser.settings.physics) {
                    for (e = 0, i = f.physics.length; e < i; e++) {
                        f.physics[e] && b(f.physics[e]);
                    }
                }
                if (tool.eraser.settings.scenery) {
                    for (e = 0, i = f.scenery.length; e < i; e++) {
                        f.scenery[e] && b(f.scenery[e]);
                    }
                }
                if (tool.eraser.settings.powerups) {
                    for (e = 0, i = f.powerups.length; e < i; e++) {
                        f.powerups[e] && b(f.powerups[e])
                    }
                }
            }
            if (d !== void 0) {
                if (tool.eraser.settings.physics) {
                    for (e = 0, i = d.physics.length; e < i; e++) {
                        d.physics[e] && b(d.physics[e]);
                    }
                }
                if (tool.eraser.settings.scenery) {
                    for (e = 0, i = d.scenery.length; e < i; e++) {
                        d.scenery[e] && b(d.scenery[e]);
                    }
                }
                if (tool.eraser.settings.powerups) {
                    for (i = d.powerups.length; e < i; e++) {
                        d.powerups[e] && b(d.powerups[e]);
                    }
                }
            }
        }
        e = 0;
        for (i = this.powerups.length; e < i; e++) {
            this.powerups[e] && this.powerups[e].Remove !== void 0 && l.push(this.powerups.splice(e--, 1)[0]);
        }
        return l
    }
    addLine(a, b, c) {
        a = new (c ? SceneryLine : PhysicsLine)(a.x,a.y,b.x,b.y,this);
        if (2 <= a.len && 1E5 > a.len && (this.addLineInternal(a), "line\\scenery line\\brush\\scenery brush".split(/\\/).includes(tool.selected)))
            if ("line\\brush".split(/\\/).includes(tool.selected)) {
                Lb.copy(tool.mouse.pos)
            } else {
                Mb.copy(tool.mouse.pos)
            }
            tool.mouse.old.copy(tool.mouse.pos);
        return a
    }
    addLineInternal(a) {
        let b = function(a, b, c) {
            let zb = {}, e, f, h, i;
            zb[c] || (zb[c] = {});
            let d = a + ";" + b;
            if (zb[c][d]) {
                return zb[c][d];
            }
            d = zb[c][d] = []
            , e = new Vector(a.x,a.y)
            , f = (b.y - a.y) / (b.x - a.x)
            , h = new Vector(a.x < b.x ? 1 : -1,a.y < b.y ? 1 : -1)
            , i = 0;
            for (d.push(a); 5E3 > i && !(Math.floor(e.x / c) === Math.floor(b.x / c) && Math.floor(e.y / c) === Math.floor(b.y / c));) {
                let l = new Vector(0 > h.x ? Math.round(Math.ceil((e.x + 1) / c + h.x) * c) - 1 : Math.round(Math.floor(e.x / c + h.x) * c),0);
                l.y = Math.round(a.y + (l.x - a.x) * f);
                let m = new Vector(0,0 > h.y ? Math.round(Math.ceil((e.y + 1) / c + h.y) * c) - 1 : Math.round(Math.floor(e.y / c + h.y) * c));
                m.x = Math.round(a.x + (m.y - a.y) / f);
                if (Math.pow(l.x - a.x, 2) + Math.pow(l.y - a.y, 2) < Math.pow(m.x - a.x, 2) + Math.pow(m.y - a.y, 2)) {
                    e = l;
                    d.push(l);
                } else {
                    e = m;
                    d.push(m);
                }
                i++
            }
            return d
        }(a.a, a.b, this.scale), c, d, e, f;
        e = 0;
        for (f = b.length; e < f; e++)
            c = Math.floor(b[e].x / this.scale),
            d = Math.floor(b[e].y / this.scale),
            this.grid[c] === void 0 && (this.grid[c] = {}),
            this.grid[c][d] === void 0 && (this.grid[c][d] = new Sector),
            a.hb ? this.grid[c][d].scenery.push(a) : this.grid[c][d].physics.push(a),
            delete this.sectors[c + "_" + d]
    }
    read(a = "-18 1i 18 1i###BMX") {
        ctx.fillText("Loading track... Please wait.", 36, 16);
        let e = a.split("#")
          , i = e[0].split(",")
          , s = []
          , n = [];
        if (e.length > 2)
            s = e[1].split(",")
            , n = e[2].split(",");
        else if (e.length > 1)
            n = e[1].split(",");
        this.addLines(i, this.addLine),
        this.addLines(s, this.addLine, !0);
        for (let t in n) {
            e = n[t].split(/\s+/g);
            let i, b = parseInt(e[1], 32);
            let d = parseInt(e[2], 32);
            switch (e[0]) {
                case "T":
                    i = new Target(b, d, this);
                    this.targets++;
                    this.powerups.push(i);
                    break;
                case "C":
                    i = new Checkpoint(b,d,this);
                    this.powerups.push(i);
                    break;
                case "B":
                    i = new Boost(b, d, parseInt(e[3], 32) + 180,this);
                    break;
                case "G":
                    i = new Gravity(b, d, parseInt(e[3], 32) + 180,this);
                    break;
                case "O":
                    i = new Bomb(b, d, this);
                    break;
                case "S":
                    i = new Slowmo(b, d, this);
                    break;
                case "A":
                    i = new Antigravity(b, d, this);
                    break;
                case "W":
                    i = new Teleporter(b, d, this);
                    i.tpb(parseInt(e[3], 32), parseInt(e[4], 32));
                    this.powerups.push(i);
            }
            if (i) {
                b = Math.floor(b / this.scale);
                d = Math.floor(d / this.scale);
                if (this.grid[b] === void 0) this.grid[b] = {};
                if (this.grid[b][d] === void 0) this.grid[b][d] = new Sector;
                this.grid[b][d].powerups.push(i);
            }
        }
    }
    addLines(t, e, scenery = !1) {
        for (let i = t.length, s = 0; i > s; s++) {
            let n = t[s].split(" ")
              , r = n.length;
            if (r > 3) {
                for (let o = 0; r - 2 > o; o += 2) {
                    let a = parseInt(n[o], 32)
                      , h = parseInt(n[o + 1], 32)
                      , l = parseInt(n[o + 2], 32)
                      , c = parseInt(n[o + 3], 32)
                      , u = a + h + l + c;
                    isNaN(u) || e.call(this, { x: a, y: h }, { x: l, y: c }, scenery)
                }
            }
        }
    }
    addToSelf(a, b) {
        for (let i = 0, d = a.length; i < d; i++) {
            if (a[i].type) {
                a[i] = new a[i].type(a[i].x,a[i].y,this)
            }
            if (b) {
                this.addLineInternal(a[i])
            } else {
                this.addLine(a[i].a, a[i].b, a[i].hb)
            }
        }
    }
    remove(a, b) {
        b === void 0 && (b = a);
        for (let c = function(a, b, c) {
            let zb = {};
            zb[c] || (zb[c] = {});
            let d = a + ";" + b;
            if (zb[c][d])
                return zb[c][d];
            d = zb[c][d] = []
            , e = new Vector(a.x,a.y)
            , f = (b.y - a.y) / (b.x - a.x)
            , h = new Vector(a.x < b.x ? 1 : -1,a.y < b.y ? 1 : -1)
            , i = 0;
            for (d.push(a); 5E3 > i && !(Math.floor(e.x / c) === Math.floor(b.x / c) && Math.floor(e.y / c) === Math.floor(b.y / c)); ) {
                let l = new Vector(0 > h.x ? Math.round(Math.ceil((e.x + 1) / c + h.x) * c) - 1 : Math.round(Math.floor(e.x / c + h.x) * c),0);
                l.y = Math.round(a.y + (l.x - a.x) * f);
                let m = new Vector(0,0 > h.y ? Math.round(Math.ceil((e.y + 1) / c + h.y) * c) - 1 : Math.round(Math.floor(e.y / c + h.y) * c));
                m.x = Math.round(a.x + (m.y - a.y) / f);
                Math.pow(l.x - a.x, 2) + Math.pow(l.y - a.y, 2) < Math.pow(m.x - a.x, 2) + Math.pow(m.y - a.y, 2) ? (e = l,
                d.push(l)) : (e = m,
                d.push(m));
                i++
            }
            return d
        }(a, b, this.scale), d = [], e = 0, f = c.length; e < f; e++) {
            let h = Math.floor(c[e].x / this.scale),
                i = Math.floor(c[e].y / this.scale),
                d = d.concat(this.grid[h][i].remove());
            delete this.sectors[h + "_" + i]
        }
        e = 0;
        for (f = d.length; e < f; e++)
            d[e].Remove = !1
    }
    pushUndo(a, b) {
        this.undoManager.push({
            undo: a,
            redo: b
        });
        return this
    }
    undo() {
        if ("scenery line" === tool.selected || "scenery brush" === tool.selected) {
            let a = Math.floor(Mb.x / this.scale)
            , b = Math.floor(Mb.y / this.scale);
            (a = this.grid[a][b].scenery[this.grid[a][b].scenery.length - 1]) && a.b.x === Math.round(Mb.x) && a.b.y === Math.round(Mb.y) ? (a.Remove = !0,
            Mb.copy(a.a),
            this.remove(a.a, a.b)) : alert("No more scenery line to erase!")
        } else
            a = Math.floor(Lb.x / this.scale),
            b = Math.floor(Lb.y / this.scale),
            a = this.grid[a][b].physics[this.grid[a][b].physics.length - 1],
            a !== void 0 && a.b.x === Math.round(Lb.x) && a.b.y === Math.round(Lb.y) ? (a.Remove = !0,
            Lb.copy(a.a),
            this.remove(a.a, a.b)) : alert("No more line to erase!")
    }
    toString() {
        let a = "", b = "", c = "", d;
        for (d in this.grid)
            for (let e in this.grid[d])
                if (this.grid[d][e].physics) {
                    for (let f = 0; f < this.grid[d][e].physics.length; f++)
                        this.grid[d][e].physics[f].ma || (a += this.grid[d][e].physics[f].a + this.grid[d][e].physics[f].getEnd() + ",");
                    for (f = 0; f < this.grid[d][e].scenery.length; f++)
                        this.grid[d][e].scenery[f].ma || (b += this.grid[d][e].scenery[f].a + this.grid[d][e].scenery[f].getEnd() + ",");
                    for (f = 0; f < this.grid[d][e].powerups.length; f++)
                        c += this.grid[d][e].powerups[f] + ","
                }
        for (d in this.grid)
            for (e in this.grid[d])
                if (this.grid[d][e].physics) {
                    for (f = 0; f < this.grid[d][e].physics.length; f++)
                        this.grid[d][e].physics[f].ma = !1;
                    for (f = 0; f < this.grid[d][e].scenery.length; f++)
                        this.grid[d][e].scenery[f].ma = !1
                }
        return a.substr(0, a.length - 1) + "#" + b.substr(0, b.length - 1) + "#" + c.substr(0, c.length - 1) + "#" + this.vehicle
    } 
}