import Cell from "./Cell.js";

export default class RenderCell extends Cell {
    constructor(x, y, size) {
        super(x, y, size);

        this.canvas = new Map();
    }

    clear() {
        this.canvas = new Map();
    }

    getCanvas(zoom, opacityFactor) {
        if (!this.canvas.has(zoom)) {
            this.canvas.set(zoom, this.renderCache(zoom, opacityFactor));
        }

        return this.canvas.get(zoom);
    }

    renderCache(zoom, opacityFactor) {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        
        canvas.width = this.size * zoom + 2;
        canvas.height = this.size * zoom + 2;

        context.lineCap = 'round';
        context.lineWidth = Math.max(2 * zoom, 0.5);
        context.globalAlpha = opacityFactor;

        context.strokeStyle = '#aaa';
        for (let scenery of this.scenery) {
            scenery.renderCache(context, this.x * zoom - 1, this.y * zoom - 1, zoom);
        }

        context.strokeStyle = '#000';
        for (let line of this.lines) {
            line.renderCache(context, this.x * zoom - 1, this.y * zoom - 1, zoom);
        }

        return canvas;
    }
}