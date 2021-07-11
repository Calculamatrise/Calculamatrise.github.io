function openDiv(t) {
    [...document.querySelectorAll(".tab-content")].forEach(t => t.style.display = "none");
    document.getElementById(t).style.display = "block";
}