import Builder from "./utils/Builder.js";

const input = document.querySelector("#input");
const output = document.querySelector("#output");
const canvas = document.querySelector("#view");

let ctx = new Builder();

eval(input.value);

output.value = ctx.code;
ctx = canvas.getContext("2d");

ctx.translate(canvas.width / 2, canvas.height / 2);
eval(input.value);

input.addEventListener("input", () => {
    ctx = new Builder();

    try {
        eval(input.value);

        output.value = ctx.code;
        ctx = canvas.getContext("2d");

        ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        eval(input.value);
    } catch(error) {}
});