import Segment from "./utils/segment.js";

generate.onclick = function() {
	const segments = new Array();

    let segment_one = new Segment();
    segments.push(segment_one);

	for (let i = 0; i < input.value; i++) {
        segments.push(segment_one = new Segment(segment_one));
	}

    let black = segments.map(t => t.code).join(",");

	output.value = (black || "") + "##";
	output.select();
}

copy.onclick = function() {
	output.select();
	document.execCommand("copy");
}

input.addEventListener("click", input.select);
output.addEventListener("click", output.select);
window.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 13:
            return generate.onclick();
        
        case 67:
            return copy.onclick();
    }
});
