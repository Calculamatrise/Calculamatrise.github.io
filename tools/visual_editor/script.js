window.onload = () => {
    //
    //
    var bikePng = null;//"C:Users/User/folder/VTEbike.png" or something
    //
    //
    var Track = function() {
        this.black = [];
        this.gray = [];
        this.powerups = [];
        this.mode = 0;
        this.encode = function(n) {
            return parseInt(Math.floor(n)).toString(32);
        };
        this.decode = function(s) {
            return parseInt(parseInt(s, 32).toString(10));
        };
        this.getType = function() {
            return this.mode === 0 ? this.black : this.gray;
        };
        this.change = function() {
            this.mode = this.mode === 0 ? 1 : 0;
            return this;
        };
        this.line = function() {
            var p = [];
            var a = Array.isArray(arguments[0]) ?
            arguments[0] : arguments;
            for (let i = 0; i < a.length; i++)
                p.push(this.encode(a[i]));
            this.getType().push(p.join(" "));
            return this;
        };
        this.rect = function(x, y, w, h) {
            return this.line(x, y, x + w, y, x + w, y + h, x, y + h, x, y);
        };
        this.fillRect = function(x, y, w, h) {
            for (let i = y; i < y + h; i++)
                this.line(x, i, x + w, i);
            return this;
        };
        this.circle = function(x, y, r, s) {
            var p = [];
            if (s === void 0) s = 5;
            for (let i = 0; i <= 360; i += s)
                p.push(x + r * Math.cos(i * Math.PI / 180), y + r * Math.sin(i * Math.PI / 180));
            return this.line(p);
        };
        this.fillCircle = function(xx, yy, r) {
            for (let y = -r; y < r; y++) {
                var x = 0;
                while (Math.hypot(x, y) <= r) x++;
                this.line(xx - x, yy + y, xx + x, yy + y);
            }
            return this;
        };
        this.powerup = function() {
            var a = Array.isArray(arguments[0]) ?
            arguments[0] : arguments;
            var p = [a[0]];
            for (let i = 1; i < a.length; i++)
                p.push(this.encode(a[i]));
            this.powerups.push(p.join(" "));
            return this;
        };
        this.export = function() {
            return this.black + "#" + this.gray + "#" + this.powerups;
        };
        this.import = function(s) {
            if (s.export) s = s.export();
            if (!s.match(/\#/g) || s.match(/\#/g).length != 2)
                throw new Error("Invalid track detected.");
            s = s.split("#");
            var m = this.mode;
            this.mode = 0;
            for (let i = 0; i < s.length; i++)
                if (s[i] !== "")
                    s[i] = s[i].split(",");
            for (let n = 0; n < 2; n++) {
                for (let i = 0; i < s[n].length; i++) {
                    let p = [];
                    let a = s[n][i].split(" ");
                    for (let x = 0; x < a.length; x++)
                        p.push(this.decode(a[x]));
                    this.line(p);
                }
                this.change();
            }
            for (let i = 0; i < s[2].length; i++) {
                let a = s[2][i].split(" ");
                let p = [a[0]];
                for (let x = 1; x < a.length; x++)
                    p.push(this.decode(a[x]));
                this.powerup(p);
            }
            this.mode = m;
            return this;
        };
        this.transform = function(t, x, y) {
            if (t == "rotate") x *= Math.PI / 180;
            if (this.export().length == 2) return this;
            var s = this.export().split("#");
            for (let i = 0; i < s.length; i++)
                if (s[i] !== "")
                    s[i] = s[i].split(",");
            for (let n = 0; n < 2; n++) {
                for (let i = 0; i < s[n].length; i++) {
                    s[n][i] = s[n][i].split(" ");
                    for (let a = 0; a < s[n][i].length - 1; a += 2) {
                        switch (t) {
                            case "translate":
                                s[n][i][a] = this.encode(this.decode(s[n][i][a]) + x);
                                s[n][i][a + 1] = this.encode(this.decode(s[n][i][a + 1]) + y);
                                break;
                            case "scale":
                                s[n][i][a] = this.encode(this.decode(s[n][i][a]) * x);
                                s[n][i][a + 1] = this.encode(this.decode(s[n][i][a + 1]) * y);
                                break;
                            case "rotate":
                                let xx = this.decode(s[n][i][a]);
                                let yy = this.decode(s[n][i][a + 1]);
                                xx = xx * Math.cos(x) + yy * Math.sin(x);
                                yy = yy * Math.cos(x) - xx * Math.sin(x);
                                s[n][i][a] = this.encode(xx);
                                s[n][i][a + 1] = this.encode(yy);
                        }
                    }
                    s[n][i] = s[n][i].join(" ");
                }
            }
            for (let i = 0; i < s[2].length; i++) {
                s[2][i] = s[2][i].split(" ");
                switch (t) {
                    case "translate":
                        s[2][i][1] = this.encode(this.decode(s[2][i][1]) + x);
                        s[2][i][2] = this.encode(this.decode(s[2][i][2]) + y);
                        break;
                    case "scale":
                        s[2][i][1] = this.encode(this.decode(s[2][i][1]) * x);
                        s[2][i][2] = this.encode(this.decode(s[2][i][2]) * y);
                        break;
                    case "rotate":
                        let xx = this.decode(s[2][i][1]);
                        let yy = this.decode(s[2][i][2]);
                        xx = xx * Math.cos(x) + yy * Math.sin(x);
                        yy = yy * Math.cos(x) - xx * Math.sin(x);
                        s[2][i][1] = this.encode(xx);
                        s[2][i][2] = this.encode(yy);
                }
                s[2][i] = s[2][i].join(" ");
            }
            this.black = s[0];
            this.gray = s[1];
            this.powerups = s[2];
            return this;
        };
    };
    var track = new Track();
    var $ = function(s) {
        return document.querySelector(s);
    };
    var can = $("#view");
    var ctx = can.getContext("2d");
    can.width = 720;
    can.height = 480;
    var img = new Image(70, 70);
    if (bikePng)
        img.src = bikePng;
    var draw = function() {
        ctx.beginPath();
        ctx.clearRect(0, 0, can.width, can.height);
        ctx.lineWidth = 2;
        ctx.lineCap = ctx.lineJoin = "round";
        var s = track.export().split("#");
        for (let i = 0; i < s.length; i++)
            if (s[i] !== "")
                s[i] = s[i].split(",");
        for (let n = 1; n >= 0; n--) {
            ctx.strokeStyle = n === 0 ? "black" : "rgb(150, 150, 150)";
            for (let i = 0; i < s[n].length; i++) {
                let a = [];
                s[n][i] = s[n][i].split(" ");
                for (let x = 0; x < s[n][i].length; x++)
                    a.push(track.decode(s[n][i][x]));
                ctx.beginPath();
                ctx.moveTo(a[0], a[1]);
                for (let x = 2; x < a.length - 1; x += 2)
                    ctx.lineTo(a[x], a[x + 1]);
                ctx.stroke();
            }
        }
        let colors = {
            "T": "yellow",
            "B": "green",
            "G": "blue",
            "S": "rgb(250, 250, 250)",
            "O": "red",
            "C": "indigo",
            "A": "aqua"
        };
        for (let i = 0; i < s[2].length; i++) {
            let a = [];
            s[2][i] = s[2][i].split(" ");
            for (let x = 1; x < s[2][i].length; x++)
                a.push(track.decode(s[2][i][x]));
            ctx.beginPath();
            if (colors[s[2][i][0]])
                ctx.fillStyle = colors[s[2][i][0]];
            switch (s[2][i][0]) {
                case "B":
                case "G":
                let pts = [
                    {x: 10, y: 0},
                    {x: 20, y: 20},
                    {x: 0, y: 20}
                ];
                for (let i = 0; i < pts.length; i++) {
                    pts[i].x += 10;
                    pts[i].y += 10;
                    pts[i].x = pts[i].x * Math.cos(a[2]) + pts[i].y * Math.sin(a[2]) + a[0] - 10;
                    pts[i].y = pts[i].y * Math.cos(a[2]) - pts[i].x * Math.sin(a[2]) + a[1] - 10;
                }
                ctx.moveTo(pts[0].x, pts[0].y);
                for (let i = 1; i < pts.length; i++)
                    ctx.lineTo(pts[i].x, pts[i].y);
                ctx.closePath();
                break;
                default:
                ctx.arc(a[0], a[1], 10, 0, 2 * Math.PI);
            }
            ctx.fill();
            ctx.stroke();
        }
        if (bikePng)
            ctx.drawImage(img, can.width / 2 - img.height / 2, can.height / 2 - 20, img.width, img.height);
        else {
            ctx.beginPath();
            ctx.strokeStyle = "red";
            ctx.strokeRect(can.width / 2 - img.height / 2, can.height / 2 - 20, img.width, img.height);
        }
        if (parseInt($("#chars").innerHTML) != track.export().length - 2)
            $("#chars").innerHTML = track.export().length - 2;
    }
    draw();
    var x, y, xx, yy;
    var move = function(e) {
        draw();
        xx = e.offsetX;
        yy = e.offsetY;
        ctx.beginPath();
        ctx.strokeStyle = ctx.fillStyle = track.mode === 0 ? "black" : "rgb(150, 150, 150)";
        switch ($("#tool").value.toLowerCase()) {
            case "line":
            ctx.moveTo(x, y);
            ctx.lineTo(xx, yy);
            ctx.stroke();
            break;
            case "box":
            ctx.strokeRect(x, y, xx - x, yy - y);
            break;
            case "circle":
            ctx.arc(x, y, Math.hypot(x - xx, y - yy), 0, 2 * Math.PI);
            ctx.stroke();
            break;
            case "filled box":
            ctx.fillRect(x, y, xx - x, yy - y);
            break;
            case "filled circle":
            ctx.arc(x, y, Math.hypot(x - xx, y - yy), 0, 2 * Math.PI);
            ctx.fill();
            break;
            case "move":
            ctx.moveTo(x, y);
            ctx.lineTo(xx, yy);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(xx - 5, yy - 5);
            ctx.lineTo(xx + 5, yy + 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(xx + 5, yy - 5);
            ctx.lineTo(xx - 5, yy + 5);
            ctx.stroke();
        }
    };
    can.addEventListener("mousedown", function(e) {
        x = e.offsetX;
        y = e.offsetY;
        track.mode = $("#black").checked ? 0 : 1;
        this.addEventListener("mousemove", move, false);
    }, false);
    can.addEventListener("mouseup", function(e) {
        xx = e.offsetX;
        yy = e.offsetY;
        this.removeEventListener("mousemove", move, false);
        if (Math.abs(x - xx) >= 2 || Math.abs(y - yy) >= 2)
            //Line Tools
            switch ($("#tool").value.toLowerCase()) {
                case "line":
                track.line(x, y, xx, yy);
                break;
                case "box":
                track.rect(x, y, xx - x, yy - y);
                break;
                case "circle":
                track.circle(x, y, Math.hypot(x - xx, y - yy));
                break;
                case "filled box":
                track.fillRect(x, y, xx - x, yy - y);
                break;
                case "filled circle":
                track.fillCircle(x, y, Math.hypot(x - xx, y - yy));
            }
        //Other Tools
        let a = (Math.atan2(y - yy, x - xx) / (Math.PI / 180) + 360) % 360 + 270;
        switch ($("#tool").value.toLowerCase()) {
            case "move":
            track.transform("translate", x - xx, y - yy);
            break;
            case "star":
            track.powerup("T", x, y);
            break;
            case "boost":
            track.powerup("B", x, y, a);
            break;
            case "gravity":
            track.powerup("G", x, y, a);
            break;
            case "slow motion":
            track.powerup("S", x, y);
            break;
            case "bomb":
            track.powerup("O", x, y);
            break;
            case "checkpoint":
            track.powerup("C", x, y);
            break;
            case "anti-gravity":
            track.powerup("A", x, y);
        }
        draw();
    }, false);
    $("#import").addEventListener("click", function() {
        var code = window.prompt("Enter the code to import:");
        var a = new Track();
        a.import(code);
        a.transform("translate", can.width / 2, can.height / 2);
        track.import(a);
        draw();
    }, false);
    $("#export").addEventListener("click", function() {
        var a = new Track();
        a.import(track);
        a.transform("translate", -can.width / 2, -can.height / 2);
        $("#code").value = a.export();
        $("#code").select();
    }, false);
    $("#clear").addEventListener("click", function() {
        if (!window.confirm("Are you sure you want to clear the track?"))
            return;
        track = new Track();
        $("#code").value = track.export();
        draw();
    }, false);
    var tool;
    window.addEventListener("keydown", function(e) {
        switch (e.which || e.keyCode) {
            case 16:
            if ($("#tool").value == "Move")
                return;
            tool = $("#tool").value;
            $("#tool").value = "Move";
            break;
            case 90:
            track.getType().pop();
            draw();
        }
    }, false);
    window.addEventListener("keyup", function(e) {
        switch (e.which || e.keyCode) {
            case 16:
            $("#tool").value = tool;
        }
    }, false);
}