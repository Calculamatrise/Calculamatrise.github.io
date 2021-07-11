let int = setInterval(() => {
    if (document.body) clearInterval(int);
    try {
        fetch("/head.html").then(t => t.text().then(t => document.head.innerHTML += t));
        fetch("/header.html").then(t => t.text().then(t => document.body.prepend(Object.assign(document.createElement("header"), { innerHTML: t })))).then(t => {
            if (localStorage.dark == "true") dark.checked = true;
            dark.onclick = function() {
                localStorage.setItem("dark", this.checked);
                link.href = localStorage.dark == "true" ? "/dark.css" : "/light.css";
            }

            const link = Object.assign(document.createElement("link"), {
                href: localStorage.dark == "true" ? "/dark.css" : "/light.css",
                rel: "stylesheet"
            });
            document.head.appendChild(link);
        });
        fetch("/footer.html").then(t => t.text().then(t => document.body.append(Object.assign(document.createElement("footer"), { innerHTML: t }))));
    } catch(e) {}
});