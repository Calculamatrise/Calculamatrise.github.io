import SVGRenderingContext2D from "./SVGRenderingContext2D.js";

let guesses;
let correct_guesses;
let head = true;
let body = true;
let lleg = true;
let rleg = true;
let larm = true;
let rarm = true;

export default class {
	constructor(canvas) {
		this.canvas = canvas;
		this.canvas.addEventListener("click", this.click.bind(this));
		this.canvas.addEventListener("mousemove", this.hover.bind(this));
		this.canvas.getContext = function(dimension) {
			return new SVGRenderingContext2D(this);
		}

        Object.defineProperties(canvas, {
            width: {
                get: function() {
                    return parseInt(getComputedStyle(this).width);
                }
            },
            height: {
                get: function() {
                    return parseInt(getComputedStyle(this).height);
                }
            }
        })

		this.ctx = this.canvas.getContext("2d");
		
		window.addEventListener("resize", this.adjust.bind(this.canvas));
		this.adjust.bind(this.canvas)();
		
		this.draw();
	}
	fps = 20;
	delta = null;
	lastTime = -1;
	lastFrame = null;
	lastMessage = null;
	guesses = []
    correct_guesses = []
    words = [
        "pub",
        "class",
        "course",
        "meal",
        "food",
        "plane",
        "flight",
        "music",
        "song",
        "theme",
        "poem"
    ]
    word = this.words[Math.floor(Math.random() * this.words.length)];
    throwaway = this.word.replace(/./g, "_").trim().split("");
    mouse = {
		x: 0,
		y: 0
	}
	get best() {
		return JSON.parse(localStorage.getItem("best_score")) | 0;
	}
	get bestToday() {
		return JSON.parse(sessionStorage.getItem("best_score")) | 0;
	}
	get dark() {
		return JSON.parse(localStorage.getItem("dark")) ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	adjust() {
		const height = getComputedStyle(this).getPropertyValue('height').slice(0, -2);
		const width = getComputedStyle(this).getPropertyValue('width').slice(0, -2);
		this.setAttribute("height", height * window.devicePixelRatio);
		this.setAttribute("width", width * window.devicePixelRatio);
	}
	init() {
        // clear canvas and draw initial vectors

		this.lastFrame = requestAnimationFrame(this.update.bind(this));
	}
	click(event) {
		this.mouse = {
			x: event.offsetX,
			y: event.offsetY
		}

		if (this.lastMessage) {
			this.lastMessage.remove();
			this.lastMessage = null;
		}

		this.lastFrame ?? this.init();
	}
	hover(event) {
		this.mouse = {
			x: event.offsetX,
			y: event.offsetY
		}
	}
	update(time) {
		this.delta = (time - this.lastTime) / 1000;


		this.lastFrame = requestAnimationFrame(this.update.bind(this));
	}
	draw() {
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = "round";

        this.ctx.beginPath();
        this.ctx.moveTo(30, this.canvas.height - 100);
        this.ctx.lineTo(110, this.canvas.height - 100);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(60, this.canvas.height - 100);
        this.ctx.lineTo(60, 100);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(60, 150);
        this.ctx.lineTo(100, 100);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(60, 100);
        this.ctx.lineTo(180, 100);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(180, 100);
        this.ctx.lineTo(180, 130);
        this.ctx.stroke();
	}
    renderGuesses() {
        if (guesses !== void 0) {
            guesses.innerHTML = this.guesses.join(", ");
        } else {
            guesses = this.ctx.fillText(this.guesses.join(", "), 250, 100);
        }

        if (correct_guesses !== void 0) {
            correct_guesses.innerHTML = this.throwaway.join(" ");
        } else {
            correct_guesses = this.ctx.fillText(this.correct_guesses.join(", "), 250, this.canvas.height - 100);
        }

        if (this.guesses.length > 0) {
            const HEAD_RADIUS = 15;

            if (head) {
                this.ctx.beginPath();
                this.ctx.arc(180, 130 + HEAD_RADIUS, HEAD_RADIUS, 0, 2 * Math.PI);
                this.ctx.stroke();

                head = false;
            }

            if (this.guesses.length > 1) {
                if (body) { 
                    this.ctx.beginPath();
                    this.ctx.moveTo(180, 130 + HEAD_RADIUS * 2);
                    this.ctx.lineTo(180, 180 + HEAD_RADIUS * 2);
                    this.ctx.stroke();

                    body = false;
                }
            }

            if (this.guesses.length > 2) {
                if (lleg) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(180, 180 + HEAD_RADIUS * 2);
                    this.ctx.lineTo(170, 210 + HEAD_RADIUS * 2);
                    this.ctx.stroke();

                    lleg = false;
                }
            }

            if (this.guesses.length > 3) {
                if (rleg) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(180, 180 + HEAD_RADIUS * 2);
                    this.ctx.lineTo(190, 210 + HEAD_RADIUS * 2);
                    this.ctx.stroke();

                    rleg = false;
                }
            }

            if (this.guesses.length > 4) {
                if (larm) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(180, 140 + HEAD_RADIUS * 2);
                    this.ctx.lineTo(170, 160 + HEAD_RADIUS * 2);
                    this.ctx.stroke();

                    larm = false;
                }
            }

            if (this.guesses.length > 5) {
                if (rarm) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(180, 140 + HEAD_RADIUS * 2);
                    this.ctx.lineTo(190, 160 + HEAD_RADIUS * 2);
                    this.ctx.stroke();

                    rarm = false;
                }

                // You lose.
            }
        }
    }
    guess(input, char) {
        if (this.word.toLowerCase().includes(char)) {
            if (!this.correct_guesses.includes(char)) {
                this.correct_guesses.push(char);

                for (const i in this.word) {
                    if (this.correct_guesses.includes(this.word[i].toLowerCase())) {
                        if (this.word[i].toLowerCase() === char) {
                            this.throwaway[i] = char;
                        }

                        continue;
                    }

                    this.throwaway[i] = "_";
                }
            }
        } else {
            if (!this.guesses.includes(char) && char.length === 1) {
                this.guesses.push(char);
            }
        }

        input.value = null;

        this.renderGuesses();
    }
	restart() {
		return;
	}
	close() {
		cancelAnimationFrame(this.lastFrame);

		this.lastFrame = null;
	}
}