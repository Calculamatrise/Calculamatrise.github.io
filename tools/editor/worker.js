onmessage = function({ data }) {
    switch(data.cmd) {
        case "move":
            data.args.physics = data.args.physics.split(/\u002C/g).map(t => t.split(/\s/g).map((t, e) => (parseInt(t, 32) + data.args[e % 2 == 0 ? "x" : "y"]).toString(32)).join(" ")).join(" ");
            data.args.scenery = data.args.scenery.split(/\u002C/g).map(t => t.split(/\s/g).map((t, e) => (parseInt(t, 32) + data.args[e % 2 == 0 ? "x" : "y"]).toString(32)).join(" ")).join(" ");
            data.args.powerups;
        break;
    }
    postMessage(data);
}