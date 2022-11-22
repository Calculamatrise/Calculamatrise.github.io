var inputs = tracks.querySelectorAll('textarea');
for (const input of inputs) {
    input.addEventListener('change', run);
}

function add() {
    return tracks.appendChild(Object.assign(document.createElement("textarea"), {
        placeholder: 'Track ' + (inputs.length + 1),
        style: "width: 222.5px;height: 65px;",
        spellcheck: false,
        onchange: run
    }));
}

function run() {
    let physics = [];
    let scenery = [];
    let powerups = [];
    let inputs = tracks.querySelectorAll('textarea');
    for (let i = 0; i < inputs.length; i++) {
        let parts = inputs[i].value.split('#');
        parts[0] && physics.push(parts[0]);
        parts[1] && scenery.push(parts[1]);
        parts[2] && powerups.push(parts[2]);
    }

    output.value = physics.join(',') + '#' + scenery.join(',') + '#' + powerups.join(',');
    output.select();
}

function copy() {
    navigator.clipboard.writeText(output.value);
}

navigation.addEventListener('navigate', function navigate() {
    navigation.removeEventListener('navigate', navigate);
    window.removeEventListener('keydown', keydown);
});

window.addEventListener('keydown', keydown);
function keydown(event) {
    event.shiftKey || event.key == 'Enter' && run();
}