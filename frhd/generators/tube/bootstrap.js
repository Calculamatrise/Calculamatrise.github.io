import Segment from "./utils/Segment.js";

let input = document.querySelector("input#input");
let output = document.querySelector("textarea#output");
let generate = document.querySelector("button[data-id=generate]");
let copy = document.querySelector("button[data-id=copy]");

generate.addEventListener("click", function() {
	let segments = new Array();
	main: for (let i = 0; i < +input.value + 1; i++) {
        let segment = new Segment(segments[segments.length - 1]);
        let n = 0;
        while(segments.find((vector) => Math.sqrt((vector.x - segment.x) ** 2 + (vector.y - segment.y) ** 2) < 120)) {
            if (n++ > 40) {
                continue main;
            }

            segments.pop();
            segment = new Segment(segments[segments.length - 1]);
        }

        segments.push(segment);
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
