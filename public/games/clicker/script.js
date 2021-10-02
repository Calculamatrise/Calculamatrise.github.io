const params = new URLSearchParams(location.search);

fetch('./constants.json').then(t => t.json()).then(t => {
    if (params.get("dev")) t.prestige = 10;

    const worker = new Worker("service-worker.js");
    worker.onmessage = function({ data }) {
        t = data.args;
        display.innerHTML = data.args.clicks;
        data.args.level > 1 && (level.innerHTML = `Level ${data.args.level}`);
        data.args.prestige > 0 && (prestige.innerHTML = `Prestige ${data.args.prestige}`);
    }

    document.addEventListener("click", function() {
        worker.postMessage({
            cmd: "click",
            args: t
        });
    });
    setInterval(() => display.innerHTML = t.clicks, 100);
});