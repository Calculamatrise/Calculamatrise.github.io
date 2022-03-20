class Segment {
    constructor(last = {}, restriction = null) {
        if (restriction !== null) {
            this.restrictions.add(restriction);
        }

        const random = this.randomize(last);
        this.id = random.id;
        this.code = random.code.split(",").map(t => t.split(/\s+/g));
        this.x = random.x + (last.x || 0);
        this.y = random.y + (last.y || 0);
        this.adjust(last);
    }

    static options = [
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
    ]

    restrictions = new Set();

    adjust(last) {
        for (const vector of this.code) {
            for (let x = 0, y = 1; x < vector.length; x += 2, y += 2) {
                vector[x] = this.encode(this.decode(vector[x]) + (last.x || 0));
                vector[y] = this.encode(this.decode(vector[y]) + (last.y || 0));
            }
        }

        this.code = this.code.map((vector) => vector.join(" ")).join(",");
    }

    encode(value) {
        return parseInt(value).toString(32);
    }

    decode(value) {
        return parseInt(value, 32);
    }

    random(options = null) {
        if (options === null) {
            return this.constructor.options[Math.floor(Math.random() * 9)];
        }

        options = options.filter((value) => !this.restrictions.has(value));

        return this.constructor.options[options[Math.floor(Math.random() * options.length)]];
    }

    randomize(last) {
        switch (last.id) {
            case "right":
            case "up_right":
            case "down_right":
                return this.random([0, 1, 2]);
    
            case "left":
            case "up_left":
            case "down_left":
                return this.random([3, 4, 5]);
    
            case "down":
            case "left_down":
            case "right_down":
                return this.random([6, 7, 8]);
    
            case "up":
            case "left_up":
            case "right_up":
                return this.random([9, 10, 11]);
        }
        
        return this.random();
    }
}