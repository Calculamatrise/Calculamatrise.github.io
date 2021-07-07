fetch("/header.html").then(async response => document.body.prepend(Object.assign(document.createElement("header"), {
    innerHTML: await response.text()
}))).then(t => {
    const dark = document.getElementById("dark");
    if (localStorage.dark == "true") {
        dark.checked = true;
    }

    dark.onclick = function() {
        localStorage.setItem("dark", this.checked);
        link.href = localStorage.dark == "true" ? "/dark.css" : "/light.css";
    }

    const link = document.createElement("link");
    link.href = localStorage.dark == "true" ? "/dark.css" : "/light.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
})

fetch("/footer.html").then(async response => document.body.append(Object.assign(document.createElement("footer"), {
    innerHTML: await response.text()
})));