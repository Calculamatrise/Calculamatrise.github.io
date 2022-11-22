let worker = new Worker('./worker.js');
worker.addEventListener('message', function({ data }) {
    output.title = `${String(data.args.code.length).slice(0, -3) ?? 0}k`;
    if (parseInt(output.title) > 2e3 && confirm("The track is a little large; would you like to download the edited track instead?")) {
        let date = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString().split(/t/i);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([ data.args.code ], { type: 'text/plain' }));
        link.download = 'frhd_edit_' + date[0] + '_' + date[1].replace(/\..+/, '').replace(/:/g, '-');
        link.click();
        return;
    }

    output.value = data.args.code;
});

let transform = document.querySelector("button#transform");
transform.addEventListener('click', function commit() {
    let trackInputs = Array.from(tracks.querySelectorAll("textarea"));
    let moveX = document.querySelector("input#moveX");
    let moveY = document.querySelector("input#moveY");
    let reflectX = document.querySelector("input#reflectX");
    let reflectY = document.querySelector("input#reflectY");
    let rotate = document.querySelector("input#rotate");
    let scaleX = document.querySelector("input#scaleX");
    let scaleY = document.querySelector("input#scaleY");
    worker.postMessage({
        cmd: 'transform',
        args: {
            code: trackInputs.shift().value,
            move: {
                x: parseFloat(moveX.value) || 0,
                y: parseFloat(moveY.value) || 0
            },
            reflect: {
                x: parseFloat(reflectX.value) || 0,
                y: parseFloat(reflectY.value) || 0
            },
            rotationFactor: (parseFloat(rotate.value) | 0) * -Math.PI / 180,
            scale: {
                x: parseFloat(scaleX.value) || 1,
                y: parseFloat(scaleY.value) || 1
            },
            tracks: trackInputs.map((track) => track.value)
        }
    });

    output.select();
});

navigation.addEventListener('navigate', function navigate() {
    if (worker !== void 0) {
        worker.terminate();
        worker = null;
    }

    navigation.removeEventListener('navigate', navigate);
    window.removeEventListener('keydown', keydown);
});

window.addEventListener('keydown', keydown);
function keydown(event) {
    event.shiftKey || event.key == 'Enter' && transform.click();
}