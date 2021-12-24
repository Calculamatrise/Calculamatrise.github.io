function init() {
    let worker = new Worker("./worker.js");
    worker.onmessage = function({ data }) {
        output.title = `${data.args.code.length.toString().slice(0, -3) | 0}k`;
        if (parseInt(output.title) > 2000 && confirm("The track is a little large; would you like to download the edited track instead?")) {
            let date = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString().split(/t/i);
            let link = document.createElement("a");
            let file = new Blob([data.args.code], {
                type: "text/plain"
            });
            link.href = window.URL.createObjectURL(file);
            link.download = "frhd_edit_" + date[0] + "_" + date[1].replace(/\..+/, "").replace(/:/g, "-");
            link.click();

            return;
        }

        output.value = data.args.code;
    }

    transform.onclick = function commit() {
        worker.postMessage({
            cmd: "transform",
            args: {
                code: input.value,
                rotationFactor: (parseFloat(rotate.value) | 0) * -Math.PI / 180,
                move: {
                    x: parseFloat(moveX.value) | 0,
                    y: parseFloat(moveY.value) | 0
                },
                scale: {
                    x: parseFloat(scaleX.value) | 1,
                    y: parseFloat(scaleY.value) | 1
                }
            }
        });

        output.select();
    }

    window.onkeydown = function(e) {
        let key = e.keyCode || e.which;
        if (key == 13) {
            commit();
        }
    }

    window.addEventListener("popstate", function pop(event) {
        if (worker !== void 0) {
            worker.terminate();
            worker = null;
        }

        window.removeEventListener("popstate", pop);
    });
}

init();

document.body.addEventListener("click", function(event) {
    if (window.transform !== void 0 && typeof transform.onclick !== "function") {
        init();
    }
});