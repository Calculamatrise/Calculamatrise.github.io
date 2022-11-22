let input = document.querySelector("input#input");
let output = document.querySelector("textarea#output");
let generate = document.querySelector("button[data-id=generate]");
let copy = document.querySelector("button[data-id=copy]");

let slave = new Worker('./worker.js');
slave.addEventListener('message', function({ data }) {
	output.value = data.result + '##';
	output.select();
});

generate.addEventListener('click', function() {
    output.value = '';
    slave.postMessage({
        segments: +input.value
    });
});

navigation.addEventListener('navigate', function navigate() {
    if (slave !== void 0) {
        slave.terminate();
        slave = null;
    }

    navigation.removeEventListener('navigate', navigate);
    window.removeEventListener('keydown', keydown);
});

window.addEventListener('keydown', keydown);
function keydown(event) {
    event.shiftKey || event.key === 'Enter' && generate.click();
}