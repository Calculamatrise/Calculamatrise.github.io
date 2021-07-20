let inputs = [
    document.getElementById("input1"),
    document.getElementById("input2")
];

function add() {
    let e = Object.assign(document.createElement("textarea"), {
        placeholder: "Track " + (inputs.length + 1),
        style: "width: 230px; height: 65px;",
        spellcheck: false,
        onclick: function() {
            this.select()
        } 
    });
    inputs[inputs.length - 1].after(e);
    inputs.push(e);
}

function run() {
    let physics = "", scenery = "", powerups = "";
    inputs.forEach(i => {
        physics += (i.value.split("#")[0] || "") + (i.value.split("#")[0] ? "," : "")
        scenery += (i.value.split("#")[1] || "") + (i.value.split("#")[1] ? "," : "")
        powerups += (i.value.split("#")[2] || "") + (i.value.split("#")[2] ? "," : "")
    });
    output.value = physics.replace(/,$/g, "") + "#" + scenery.replace(/,$/g, "") + "#" + powerups.replace(/,$/g, "");
    output.select();
}

function copy() {
    output.select();
    document.execCommand('copy');
}

window.addEventListener('keydown',function(e) {
    var key = e.keyCode || e.which;
    if (key == 13) run();
    if (key == 67) copy();
});