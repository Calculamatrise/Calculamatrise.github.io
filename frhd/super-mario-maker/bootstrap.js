import Helpers from "./utils/Helpers.js";
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

window.preview = function() {
	this.requestFullscreen();
}

import levelDictionary from "./constants/marioLevelDictionary.js";

const offscreen = view.transferControlToOffscreen();
const worker = new Worker('./worker.js');
worker.addEventListener('message', function({ data }) {
	output.title = `${Number(String(data.args.code.length).slice(0, -3))}k`;
	if (parseInt(output.title) > 2e3 && confirm("The track is a little large; would you like to download the edited track instead?")) {
		let date = new Date(new Date().setHours(new Date().getHours() - new Date().getTimezoneOffset() / 60)).toISOString().split(/t/i);
		let link = document.createElement('a');
		link.href = URL.createObjectURL(new Blob([data.args.code], { type: 'text/plain' }));
		link.download = 'frhd_edit_' + date[0] + '_' + date[1].replace(/\..+/, '').replace(/:/g, '-');
		link.click();
		URL.revokeObjectURL(link.href);
		return;
	}

	output.value = data.args.code;
});

worker.postMessage({ canvas: offscreen }, [offscreen]);

function updateCombined(updated = insertedObjects) {
	// let physics = [];
	// let scenery = [];
	// let powerups = [];
	// for (const object of updated) {
	// 	const parts = object.toString().split('#');
	// 	parts[0] && physics.push(parts[0]);
	// 	parts[1] && scenery.push(parts[1]);
	// 	parts[2] && powerups.push(parts[2]);
	// }

	// output.value = Array(physics.join(','), scenery.join(','), powerups.join(',')).join('#');
	worker.postMessage({
		args: {
			code: lvl.value === 'custom' ? custom.value.padEnd(2, '##') : levelDictionary[lvl.value],
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

navigation.addEventListener('navigate', function onnavigate() {
	this.removeEventListener('click', onnavigate);
	worker !== void 0 && worker.terminate();
});