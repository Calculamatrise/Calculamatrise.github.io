import Layer from "./Layer.js";

export default class {
    cache = []
    create() {
        return new Layer(this);
    }
    get(layerId) {
        return this.cache.find(function(layer) {
            if (layer.id === parseInt(layerId)) {
                return true;
            }

            return false;
        });
    }
    remove(layerId) {
        return this.cache.splice(this.cache.indexOf(this.get(layerId)), 1);
    }
}