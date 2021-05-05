const slides = ["", "section_one.html", "section_two.html", "section_three.html"];
const loc = location.href.split("/");
const slide = slides.indexOf(loc[loc.length - 1].replace(/\.html/, ""));
document.onclick = (t) => {
    if (t.pageX > window.innerWidth / 2) {
        if (slides.indexOf(loc[loc.length - 1].replace(/\.html/, "")) < slides.length - 1) {
            location.href = slides[slide + 1];
        }
    } else {
        if (slides.indexOf(loc[loc.length - 1].replace(/\.html/, "")) > 0) {
            location.href = slides[slide - 1];
        }
    }
}
console.log(slide)
document.title = "Strength Training - " + slides[slide].replace(/_/, " ").replace(/\.html/, "");

const icon = document.createElement("link");
icon.rel = "icon";
icon.href = "./icon.png";

document.head.append(icon);
