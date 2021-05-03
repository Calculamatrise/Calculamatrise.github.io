const slides = ["title", "section_one", "section_two", "section_three"];

const loc = location.href.split("/");
const slide = slides.indexOf(loc[loc.length - 1].replace(/\.html/, ""));
document.onclick = (t) => {
    if (t.pageX > window.innerWidth / 2) {
        if (slides.indexOf(loc[loc.length - 1].replace(/\.html/, "")) < slides.length) {
            location.href = slides[slide + 1] + ".html";
        }
    } else {
        if (slides.indexOf(loc[loc.length - 1].replace(/\.html/, "")) > 0) {
            location.href = slides[slide - 1] + ".html";
        }
    }
    //location.href = loc.join("/") + ".html";
}

document.title = "Slide " + loc[loc.length - 1];

const icon = document.createElement("link");
icon.rel = "icon";
icon.href = "./icon.png";

document.head.append(icon);