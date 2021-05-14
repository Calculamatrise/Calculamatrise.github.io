function openDiv(t) {
    const div = document.getElementById(t)
    for (const t of document.getElementsByClassName("content")) {
        t.style.display = "none";
    }
    div.style.display = "block";
}