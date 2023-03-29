import MarioObject from "./utils/MarioObject.js";

const insertedObjects = new Proxy([], {
	set(target, property, value) {
		if (target.length == property) {
			value.element.objectButton.addEventListener('click', function () {
				insertedObjects.splice(target.indexOf(value), 1);
				value.element.remove();
			});
			value.element.objectTypeMenu.onchange = () => updateCombined();
			value.element.objectXInput.onchange = () => updateCombined();
			value.element.objectYInput.onchange = () => updateCombined();
			value.element.objectRotation.onchange = () => updateCombined();
			objects.appendChild(value.element);
			updateCombined(target.concat(value));
		}

		return Reflect.set(...arguments);
	},
	deleteProperty(target, property) {
		Reflect.deleteProperty(...arguments);
		if (isFinite(property)) {
			updateCombined(target.filter(item => typeof item != 'undefined'));
		}

		return true;
	}
});

window.levelChanged = function (event) {
	custom.style[(event.target.value === 'custom' ? 'remove' : 'set') + 'Property']('display', 'none');
	custom.value = null;
	updateCombined();
}

window.insertObject = function () {
	const object = document.querySelector(`option[value=${obj.value}]`);
	if (!object.disabled) {
		insertedObjects.push(new MarioObject({
			rotation: rotation.value,
			type: obj.value,
			x: ~~x.valueAsNumber,
			y: ~~y.valueAsNumber
		}));
		// insertedObjects.push({
		// 	type: obj.value,
		// 	x: ~~x.valueAsNumber,
		// 	y: ~~y.valueAsNumber
		// });
		rotation.value = 0;
		x.value = null;
		y.value = null;
	}
}

const LevelDictionary = await fetch('./constants/levels.json').then(r => r.json());
const worker = new Worker('./worker.js');
worker.addEventListener('message', ({ data }) => {
	URL.revokeObjectURL(preview.src);
	preview.src = URL.createObjectURL(data.args.blob);
	output.title = `${Number(String(data.args.code.length).slice(0, -3))}k`;
	if (parseInt(output.title) > 2e3 && confirm("The result is quite large; would you like to download the edited track instead?")) {
		let link = Object.assign(document.createElement('a'), {
			download: 'frhd_edit-' + new Intl.DateTimeFormat('en-CA', { dateStyle: 'short', timeStyle: 'medium' }).format().replace(/[/:]/g, '-').replace(/,+\s*/, '_').replace(/\s+.*$/, ''),
			href: window.URL.createObjectURL(new Blob([data.args.code], { type: 'text/plain' }))
		});
		link.click();
		URL.revokeObjectURL(link.href);
		return;
	}

	output.value = data.args.code;
});

navigation.addEventListener('navigate', function onnavigate() {
	this.removeEventListener('click', onnavigate);
	worker !== void 0 && worker.terminate();
});

function updateCombined(updated = insertedObjects) {
	worker.postMessage({
		args: {
			code: lvl.value === 'custom' ? custom.value.padEnd(2, '##') : LevelDictionary[lvl.value],
			translate: {
				x: 0,
				y: 2e3
			},
			scale: {
				x: 0.6,
				y: 0.6
			},
			tracks: updated.map(object => object.toString())
		},
		cmd: 'transform'
	});
}