import Track from "./utils/track.js";

var bikePng = null;//"C:Users/User/folder/VTEbike.png" or something
const track = new Track();

const ctx = canvas.getContext("2d");
canvas.width = 720;
canvas.height = 480;

const img = new Image(70, 70);
if (bikePng)
    img.src = bikePng;

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.lineCap = ctx.lineJoin = "round";
    var s = track.code.split("#");
    for (let i = 0; i < s.length; i++)
        if (s[i] !== "")
            s[i] = s[i].split(",");
    for (let n = 1; n >= 0; n--) {
        ctx.strokeStyle = (n === 0) ? JSON.parse(localStorage.getItem("dark")) ? "#fdfdfd" : "#000000" : JSON.parse(localStorage.getItem("dark")) ? "#666666" : "#AAAAAA";
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
        ctx.drawImage(img, canvas.width / 2 - img.height / 2, canvas.height / 2 - 20, img.width, img.height);
    else {
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.strokeRect(canvas.width / 2 - img.height / 2, canvas.height / 2 - 20, img.width, img.height);
    }
    if (parseInt(document.querySelector("#chars").innerHTML) != track.code.length - 2)
        document.querySelector("#chars").innerHTML = track.code.length - 2;
}
draw();

var x, y, xx, yy;
function move(e) {
    draw();
    xx = e.offsetX;
    yy = e.offsetY;
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle = track.mode === 0 ? JSON.parse(localStorage.getItem("dark")) ? "#fdfdfd" : "#000000" : JSON.parse(localStorage.getItem("dark")) ? "#666666" : "#AAAAAA";
    switch (document.querySelector("#tool").value.toLowerCase()) {
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

canvas.addEventListener("mousedown", function(e) {
    x = e.offsetX;
    y = e.offsetY;
    track.mode = document.querySelector("#black").checked ? 0 : 1;
    this.addEventListener("mousemove", move, false);
}, false);

canvas.addEventListener("mouseup", function(e) {
    xx = e.offsetX;
    yy = e.offsetY;
    this.removeEventListener("mousemove", move, false);
    if (Math.abs(x - xx) >= 2 || Math.abs(y - yy) >= 2)
        //Line Tools
        switch (document.querySelector("#tool").value.toLowerCase()) {
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
    switch (tool.value.toLowerCase()) {
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
        break;
    }
    draw();
}, false);

document.querySelector("#import").addEventListener("click", function() {
    const code = prompt("Enter the code to import:");
    if (code)
        track.close(),
        track.import(code);
    draw();
}, false);

document.querySelector("#export").addEventListener("click", function() {
    const a = Object.assign(new Track(), track);
    //console.log(track)
    //a.import(track);
    a.transform("translate", -canvas.width / 2, -canvas.height / 2);
    code.value = a.code;
    code.select();
}, false);

clear.addEventListener("click", function() {
    if (!confirm("Are you sure you want to clear the track?"))
        return;
    track = new Track();
    code.value = track.code;
    draw();
}, false);

window.addEventListener("keydown", function(e) {
    switch (e.which || e.keyCode) {
        case 16:
            if (tool.value == "Move")
                return;
            track.tool = tool.value;
            tool.value = "Move";
        break;
        case 90:
            track.type.pop();
            draw();
    }
}, false);

window.addEventListener("keyup", function(e) {
    switch (e.which || e.keyCode) {
        case 16:
            tool.value = track.tool;
    }
}, false);