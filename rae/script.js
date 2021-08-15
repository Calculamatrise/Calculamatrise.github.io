function openDiv(t) {
    [...document.querySelectorAll(".tab-content")].forEach(t => t.style.display = "none");
    document.getElementById(t).style.display = "block";
}

[...document.querySelectorAll("td:nth-child(1)")].forEach(t => {
    t.onclick = function() {
        openDiv("usage"),
        location.hash = t.innerText.toLowerCase();
    }
});