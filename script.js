let int = setInterval(() => {
    if (document.body) clearInterval(int);
    try {
        fetch("/head.html").then(t => t.text().then(t => document.head.innerHTML += t));
        fetch("/header.html").then(t => t.text().then(t => document.body.prepend(Object.assign(document.createElement("header"), { innerHTML: t })))).then(t => {
            const link = Object.assign(document.createElement("link"), {
                href: localStorage.dark == "true" ? "/dark.css" : "/light.css",
                rel: "stylesheet"
            });

            if (localStorage.dark == "true") dark.checked = true;
            dark.onclick = function() {
                localStorage.setItem("dark", this.checked);
                link.href = localStorage.dark == "true" ? "/dark.css" : "/light.css";
            }
            
            document.head.appendChild(link);
        });
        fetch("/footer.html").then(t => t.text().then(t => document.body.append(Object.assign(document.createElement("footer"), { innerHTML: t }))));
    } catch(e) {}
});

function loadPage(t) {
    fetch(t).then(e => e.text()).then(e => {
        let i = createElement("html", {
            innerHTML: e
        });
        console.log(history.state)
        history[(history.state ? "replace" : "push") + "State"]({
            content: document.querySelector(".content").innerHTML,
            title: document.title,
            path: location.pathname
        }, document.title, t);
        document.querySelector(".content").innerHTML = i.querySelector(".content").innerHTML
        document.title = i.querySelector("title").innerText;
    });
}

function createElement(t, e) {
    return Object.assign(document.createElement(t), e);
}

onpopstate = function() {
    loadPage(location.pathname)
}