const slides = ["title", "section_one", "section_two", "section_three"];
const loc = location.href.split("/");
const slide = slides.indexOf(loc[loc.length - 1].replace(/\.html/, ""));
document.onclick = (t) => {
    if (t.pageX > window.innerWidth / 2) {
        if (slides.indexOf(loc[loc.length - 1].replace(/\.html/, "")) < slides.length - 1) {
            location.href = slides[slide + 1] + ".html";
        }
    } else {
        if (slides.indexOf(loc[loc.length - 1].replace(/\.html/, "")) > 0) {
            location.href = slides[slide - 1] + ".html";
        }
    }
}

document.title = "Slide - " + slides[slide];

const icon = document.createElement("link");
icon.rel = "icon";
icon.href = "./icon.png";

document.head.append(icon);