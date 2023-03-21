import Builder from "./utils/Builder.js";

const input = document.querySelector(".code-block");
const output = document.querySelector("#output");
const canvas = document.querySelector("#view");

let ctx = new Builder();

eval(input.innerText);

output.value = ctx.code;
ctx = canvas.getContext("2d");
ctx.translate(canvas.width / 2, canvas.height / 2);
eval(input.innerText);

const tokens = ['\'', '"', '/', '+', '%', '='];
input.addEventListener('input', function (event) {
	const selection = document.getSelection();
	const isWrapped = selection.anchorNode.parentElement.matches('code');

	const query = selection.anchorNode.data.slice(0, selection.anchorOffset).replace(/^.*[\s\.,;={}]/, '');
	const searchResults = Reflect.ownKeys(Builder.prototype).filter(key => key != 'constructor').filter(key => key.startsWith(query));
	if (query.length > 0) {
		selection.anchorNode.parentElement.style.setProperty('position', 'relative');
		selection.anchorNode.parentElement.appendChild(createDropdown(searchResults, function (text) {
			selection.anchorNode.parentElement.innerText = selection.anchorNode.data.slice(0, selection.anchorOffset) + text.replace(query, '') + selection.anchorNode.data.slice(selection.anchorOffset);
		}));
	}
	console.log(event.data)
	ctx = new Builder();
	try {
		eval(input.innerText);
		output.value = ctx.code;
		ctx = canvas.getContext("2d");
		ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
		eval(input.innerText);
	} catch { }
});

const dropdown = document.createElement('div');
dropdown.style.setProperty('background-color', 'var(--accent-color)');
dropdown.style.setProperty('display', 'flex');
dropdown.style.setProperty('flex-direction', 'column');
dropdown.style.setProperty('left', 0);
dropdown.style.setProperty('position', 'absolute');
dropdown.style.setProperty('right', 0);
function createDropdown(entries, complete) {
	dropdown.replaceChildren();
	for (const entry of entries) {
		const span = document.createElement('div');
		span.innerText = entry;
		span.setAttribute('tabIndex', '0');
		span.addEventListener('keydown', function (event) {
			event.preventDefault();
			if (typeof complete == 'function') {
				complete(this.innerText);
			}
		});
		dropdown.appendChild(span);
	}

	return dropdown;
}