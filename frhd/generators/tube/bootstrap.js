let input = document.querySelector("input#input");
let output = document.querySelector("textarea#output");
let generate = document.querySelector("button[data-id=generate]");
let copy = document.querySelector("button[data-id=copy]");

let slave = new Worker("./worker.js");
slave.addEventListener("message", function({ data }) {
    let physics = data.segments.map(t => t.code).join(",");

	output.value = (physics || "") + "##";
	output.select();
});

generate.addEventListener("click", function() {
    output.value = "";
    slave.postMessage({
        segments: +input.value
    });
});

copy.addEventListener("click", function() {
	output.select();
	document.execCommand("copy");
});

input.addEventListener("click", input.select);
output.addEventListener("click", output.select);
window.addEventListener("keydown", function(event) {
    switch(event.key.toLowerCase()) {
        case "enter":
            return generate.click();

        case "c":
            return copy.click();
    }
});
