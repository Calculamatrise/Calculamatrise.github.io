onmessage = function({ data }) {
    switch(data.cmd) {
        case "render":
            let red = 0;
            let green = 0;
            let blue = 0;
            let alpha = 0;
            for (let t = 0; t in data.pixels; t += 4) {
                red += data.pixels[t];
                green += data.pixels[t + 1];
                blue += data.pixels[t + 2];
                alpha += data.pixels[t + 3];
            }

            red = (red / data.pixels.length).toFixed();
            green = (green / data.pixels.length).toFixed();
            blue = (blue / data.pixels.length).toFixed();
            alpha /= data.pixels.length * 255;

            postMessage({
                cmd: "result",
                args: {
                    red,
                    green,
                    blue,
                    alpha,
                    hex: "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue)
                }
            });
            break;
    }
}

function componentToHex(component) {
    return ("0" + component.toString(16)).slice(-2);
}