importScripts("./utils/Segment.js");

addEventListener("message", function({ data }) {
    let segments = new Array();
	main: for (let i = 0; i < data.segments + 1; i++) {
        let segment = new Segment(segments[segments.length - 1]);
        let n = 0;
        while(segments.find((vector) => Math.sqrt((vector.x - segment.x) ** 2 + (vector.y - segment.y) ** 2) < 120)) {
            let t = Math.min(Math.floor(Math.random() * ++n) + 4, segments.length - 1);
            segments.splice(-t);
            i -= t;
            segment = new Segment(segments[segments.length - 1], Segment.options.indexOf(Segment.options.find((value) => value.id === segment.id)));
        }

        segments.push(segment);
	}

    this.postMessage({
        segments
    });
});