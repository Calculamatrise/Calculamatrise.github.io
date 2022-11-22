importScripts("./utils/Segment.js", "./utils/SegmentHandler.js");

const segments = new SegmentHandler();
addEventListener('message', function({ data }) {
    segments.clear();
    for (let i = 0; i < data.segments; i++) {
        segments.create();
    }

    this.postMessage({
        result: segments.cache.join(',')
    });
});