body = document.body || document.documentElement.querySelector("body");
fetch("/head.html").then(t => t.text().then(t => document.head.innerHTML += t));
fetch("/header.html").then(t => t.text().then(t => !body.querySelector("header") && body.prepend(Object.assign(document.createElement("header"), { innerHTML: t })))).then(t => {
    if (JSON.parse(localStorage.getItem("dark"))) dark.checked = true;
});
fetch("/footer.html").then(t => t.text().then(t => !body.querySelector("footer") && body.append(Object.assign(document.createElement("footer"), { innerHTML: t }))));

location.load = function(t, e = true, i) {
    if (i && typeof i === "function") return i(replace);
    fetch(t).then(t => t.text()).then(html => {
        if (e) history.pushState({ html }, null, t),
        replace(html);
    })
    
    function replace(html) {
        if (window.Game) window.Game.close(), window.Game = null;;
        let e = createElement("html", { innerHTML: html });
        document.head.querySelectors("title", "style", "link[rel=icon]", "link[src='style.css']", "script[src='script.js']", "script[src='./script.js']", "script[src='bootstrap.js']").forEach(t => t.remove());
        document.title = e.querySelector("title") ? e.querySelector("title").innerHTML : "Calculamatrise";
        for (const { attributes: { href: { value: href } }, rel } of [...e.querySelectorAll("link")])
            !document.head.querySelector(`link[href='${href}']`) && document.head.appendChild(createElement("link", { href, rel }));
        for (const t of [...e.querySelectorAll("style")])
            document.head.appendChild(t);
        for (const { attributes: { src: { value: src } = { value: "" } }, innerHTML, type } of [...e.querySelectorAll("script")])
            !document.head.querySelector(`script[src='${src}']`) && document.head.appendChild(createElement("script", { innerHTML, src, type }));
        document.querySelector(".content").innerHTML = e.querySelector(".content") ? e.querySelector(".content").innerHTML : e.querySelector("body").innerHTML;
    }
}

function querySelectors(t) {
    if (!t) throw new Error("INVALID_DOM_ELEMENT");
    let e = [];
    for (const i of [...arguments].slice(1)) {
        let s = t.querySelectorAll(i);
        s && e.push(...s);
    }
    return e;
}

document.head.querySelectors = function() {
    return querySelectors(this, ...arguments);
}

function createElement(t, e) {
    return Object.assign(document.createElement(t), e);
}

onpopstate = function({ state = this.history && this.history.state }) {
    if (state)
        return location.load(null, null, t => t(state.html));
    location.load(location.pathname, false);
}