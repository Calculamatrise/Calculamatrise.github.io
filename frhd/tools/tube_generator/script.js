class Segment {
    constructor(last) {
        const random = this.randomize(last);
        this.id = random.id;
        this.code = random.code.split(/,/).map(t => t.split(/\s/));
        this.x = random.x + (last?.x || 0);
        this.y = random.y + (last?.y || 0);
        this.adjust(last);
    }
    adjust(last) {
        for (const t of this.code) {
            for (let e = 0, i = 1; e < t.length; e += 2, i += 2) {
                t[e] = this.encode(this.decode(t[e]) + (last?.x || 0));
                t[i] = this.encode(this.decode(t[i]) + (last?.y || 0));
            }
        }
        this.code = this.code.map(t => t.join(" ")).join(",");
    }
    encode(t) {
        return parseInt(t).toString(32);
    }
    decode(t) {
        return parseInt(t, 32);
    }
    random(t) {
        if (t.length > 3) return this.options[Math.floor(Math.random() * 9)];
        return t[Math.floor(Math.random() * t.length)];
    }
    randomize(last) {
        switch (last?.id) {
            case "right":
            case "up_right":
            case "down_right":
                return this.options[this.random([0, 1, 2])];
    
            case "left":
            case "up_left":
            case "down_left":
                return this.options[this.random([3, 4, 5])];
    
            case "down":
            case "left_down":
            case "right_down":
                return this.options[this.random([6, 7, 8])];
    
            case "up":
            case "left_up":
            case "right_up":
                return this.options[this.random([9, 10, 11])];
        }
        
        return this.random(this.options);
    }
    get options() {
        return [
            {
                id: "right",
                code: "18 1i 50 1i,18 -a 50 -a",
                x: 120,
                y: 0
            }, 
            {
                id: "right_down",
                code: "18 1i 1i 1i 20 1l 2e 1r 2q 26 31 2l 34 33 34 3e,18 -a 1n -a 2g -6 37 1 3s e 4d 11 4o 1l 4s 26 4v 2n 50 3e",
                x: 130,
                y: 60
            }, 
            {
                id: "right_up",
                code: "18 1i 1i 1i 2c 1f 34 18 3q r 4a b 4n -c 4t -13 50 -1v 50 -26,18 -a 1g -a 1p -b 28 -g 2k -o 2t -13 33 -1k 34 -20 34 -26",
                x: 130,
                y: -20
            },  
            {
                // 3
                id: "left",
                code: "-18 1i -50 1i,-18 -a -50 -a",
                x: -120,
                y: 0
            },  
            {
                id: "left_down",
                code: "-18 1i -1i 1i -23 1m -2i 1u -2s 2a -33 2s -34 37 -34 3e,-18 -a -1i -a -2g -6 -39 2 -3u g -4e 13 -4o 1m -4t 2b -50 30 -50 3e",
                x: -130,
                y: 60
            },
            {
                id: "left_up",
                code: "-18 -a -1i -a -20 -d -2e -j -2p -u -31 -1c -34 -1s -34 -26,-18 1i -1l 1i -2l 1d -3f 13 -43 j -4i -2 -4r -q -50 -1o -50 -26",
                x: -130,
                y: -20
            },
            {
                // 6
                id: "down",
                code: "u 1i u 5a,-u 1i -u 5a",
                x: 0,
                y: 120
            },
            {
                id: "down_left",
                code: "-u 1i -u 1s -12 2e -1d 30 -1s 39 -2g 3e -2q 3e,u 1i u 26 o 34 9 43 -c 4n -11 52 -1r 58 -2g 5a -2q 5a",
                x: -50,
                y: 120
            },
            {
                id: "down_right",
                code: "u 1i u 1s 12 2d 1a 2s 1m 36 28 3d 2q 3e,-u 1i -u 26 -n 36 -8 43 c 4n 12 52 1u 58 2j 5a 2q 5a",
                x: 50,
                y: 120
            },
            {
                // 9
                id: "up",
                code: "u -1i u -5a,-u -1i -u -5a",
                x: 0,
                y: -120
            },
            {
                id: "up_left",
                code: "-u -1i -u -1s -12 -2e -1d -30 -1s -39 -2g -3e -2q -3e,u -1i u -26 o -34 9 -43 -c -4n -11 -52 -1r -58 -2g -5a -2q -5a",
                x: -50,
                y: -160
            },
            {
                id: "up_right",
                code: "u -1i u -1s 12 -2d 1a -2s 1m -36 28 -3d 2q -3e,-u -1i -u -26 -n -36 -8 -43 c -4n 12 -52 1u -58 2j -5a 2q -5a",
                x: 50,
                y: -160
            }
        ];
    }
}

function generate() {
	const segments = new Array();

    let segment_one = new Segment();
    segments.push(segment_one);

	for (let i = 0; i < input.value; i++) {
        segments.push(segment_one = new Segment(segment_one));
	}

    let black = segments.map(t => t.code).join(",");

	output.value = (black || "") + "##";
	output.select();
}

function copy() {
	output.select();
	document.execCommand("copy");
}

input.addEventListener("click", input.select);
output.addEventListener("click", output.select);
window.addEventListener("keydown", function(e) {
    switch(e.keyCode) {
        case 13:
            return generate();
        
        case 67:
            return copy();
    }
});
