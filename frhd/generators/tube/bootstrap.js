import Segment from "./utils/Segment.js";

let input = document.querySelector("input#input");
let output = document.querySelector("textarea#output");
let generate = document.querySelector("button[data-id=generate]");
let copy = document.querySelector("button[data-id=copy]");

generate.addEventListener("click", function() {
	let segments = new Array();
	for (let i = 0; i < +input.value + 1; i++) {
        segments.push(new Segment(segments[segments.length - 1]));
	}

    let physics = segments.map(t => t.code).join(",");

	output.value = (physics || "") + "##";
	output.select();
});

copy.addEventListener("click", function() {
	output.select();
	document.execCommand("copy");
});

input.addEventListener("click", input.select);
output.addEventListener("click", output.select);
window.addEventListener("keydown", function(e) {
    switch(e.key.toLowerCase()) {
        case "enter":
            return generate.click();

        case "c":
            return copy.click();
    }
});
