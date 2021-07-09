function generate() {
    let code = input.value.split("#");
    output.value = (code[0].split(",").map(t => t.split(" ").map((t, e) => horizontal.checked ? e % 2 == 0 ? t.indexOf("-") == 0 ? t.replace(/\u002D/, "") : ("-" + t) : t : e % 2 == 1 ? t.indexOf("-") == 0 ? t.replace(/\u002D/, "") : ("-" + t) : t).join(" ")).join(",").replace(/,$/, "") || "") + "#" + (code[1].split(",").map(t => t.split(" ").map((t, e) => horizontal.checked ? e % 2 == 0 ? t.indexOf("-") == 0 ? t.replace(/\u002D/, "") : ("-" + t) : t : e % 2 == 1 ? t.indexOf("-") == 0 ? t.replace(/\u002D/, "") : ("-" + t) : t).join(" ")).join(",").replace(/,$/, "") || "") + "#" + (code[2] || "");
    output.select();
}

this.copy = function() {
    output.select();
    document.execCommand('copy');
}

window.addEventListener('keydown',function(e) {
    let key = e.keyCode || e.which;
    if (key == 13) generate();
    if (key == 67) copy();
});