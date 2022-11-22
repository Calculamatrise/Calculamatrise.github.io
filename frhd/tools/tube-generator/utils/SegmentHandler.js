// todo
class SegmentHandler {
    cache = [];
    clear() {
        return this.cache.splice(0, this.cache.length);
    }

    create() {
        let restrictions = new Set();
        let lastSegment = this.cache.at(-1);
        if (!lastSegment) {
            let segment = new Segment();
            this.cache.push(segment);
            return segment;
        }

        let beforeLastSegment = this.cache.at(-2);
        let thirdToLastSegment = this.cache.at(-3);
        if (thirdToLastSegment && thirdToLastSegment.id !== beforeLastSegment.id && !lastSegment.id.endsWith(thirdToLastSegment)) {
            restrictions.add(2);
        }

        let options = Segment.findGroupInOptions(lastSegment.id.split('_').at(-1)).filter((_, index) => !restrictions.has(index));
        let segment = new Segment(options[Math.floor(Math.random() * options.length)].id, lastSegment);
        let n = 0;
        while(this.cache.find(vector => Math.sqrt((vector.x - segment.x) ** 2 + (vector.y - segment.y) ** 2) < 120)) {
            let t = Math.min(Math.floor(Math.random() * ++n) + 4, this.cache.length - 1);
            this.cache.splice(-t);
            restrictions.add(segment.id);
            options = Segment.findGroupInOptions(lastSegment.id.split('_').at(-1)).filter(({ id }, index) => !restrictions.has(id) && !restrictions.has(index));
            if (options.length < 1) continue;
            segment = new Segment(options[Math.floor(Math.random() * options.length)].id, lastSegment);
        }

        this.cache.push(segment);
        return segment;
    }

    add() {}
    verify() {}
    remove() {}
    toString() {
        return this.cache.join(',');
    }
}