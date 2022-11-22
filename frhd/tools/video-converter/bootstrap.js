import Manipulation from "./utils/Manipulation.js";

const app = new Manipulation(document.querySelector("canvas#view"));

input.addEventListener("change", function() {
    app.progress = 0;
    code.value = null;
    if (this.files.length < 1) {
        app.canvas.getContext("2d").clearRect(0, 0, app.canvas.width, app.canvas.height);
        return;
    }

    app.video.src = URL.createObjectURL(this.files[0]);
});

code.addEventListener("dragenter", function(event) {
    event.preventDefault();
    document.body.classList.add("drag-active");
});

code.addEventListener("dragover", function(event) {
    event.preventDefault();
});

code.addEventListener("dragleave", function(event) {
    event.preventDefault();
    document.body.classList.remove("drag-active");
});

code.addEventListener("drop", function(event) {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
        app.image.src = URL.createObjectURL(event.dataTransfer.files[0]);
    }
});

// const worker = new Worker('my-worker.js');
// const video = document.getElementById('video');
// const stream = video.captureStream();
// const [track] = stream.getVideoTracks();
// const imageCapture = new ImageCapture(track);
// const canvas = document.getElementById('canvas');
// const offscreen = canvas.transferControlToOffscreen();

// worker.postMessage({ offscreen }, [offscreen]);

// const draw = () => {
//   imageCapture.grabFrame().then(imageBitmap => {
//     worker.postMessage({ imageBitmap }, [imageBitmap]);
//   });

//   requestAnimationFrame(draw);
// };

// video.onplay = () => {
//   requestAnimationFrame(draw);
// };