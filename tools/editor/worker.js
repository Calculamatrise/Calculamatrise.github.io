onmessage = function({ data }) {
    switch(data.cmd) {
        case "move":
            data.args.physics = data.args.physics.map(t => t.map((t, e) => t && (parseInt(t, 32) + data.args[e % 2 == 0 ? "x" : "y"]).toString(32)).join(" ")).join(",");
            data.args.scenery = data.args.scenery.map(t => t.map((t, e) => t && (parseInt(t, 32) + data.args[e % 2 == 0 ? "x" : "y"]).toString(32)).join(" ")).join(",");
            data.args.powerups = data.args.powerups.map(t => t.map((t, e, i) => (i[0] == "V" ? e > 0 && e < 3 : e > 0) ? t && (parseInt(t, 32) + data.args[e % 2 == 0 ? "x" : "y"]).toString(32) : t).join(" ")).join(",");
        break;
    }
    postMessage(data);
}