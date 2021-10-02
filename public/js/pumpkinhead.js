!function() {
    'use strict';
    function e(e) {
        this.createVersion();
    }
    let r = GameInventoryManager.HeadClass,
        o = {},
        i = 0,
        v = 0,
        T = e.prototype = new r,
        img = new Image(90, 90);
    T.versionName = '',
    T.dirty = !0,
    img.src = 'https://imgur.com/guYyHAV.png',
    T.cache = function(e) {
        const r = o[this.versionName];
        r.dirty = !1;
        const T = 105 * (e = Math.max(e, 1)) * 0.25,
            b = 91 * e * 0.25,
            u = r.canvas;
        u.width = T,
        u.height = b,
        i = u.width / 2,
        v = u.height / 2;
        const C = u.getContext('2d'),
            z = 0.25 * e;
        this.colors;
 
        C.save();
        C.scale(z, z);
        C.save();
        C.translate(0, 0);
        C.beginPath();
        C.moveTo(0, 0);
 
        C.beginPath();
        C.drawImage(img, 0, 0, 90, 90);
 
        C.restore();
    },
    T.getVersions = function() { return o; },
    T.getBaseWidth = function() { return 105; },
    T.getBaseHeight = function() { return 91; },
    T.getDrawOffsetX = function() { return -2; },
    T.getDrawOffsetY = function() { return -3; },
    T.getScale = function() { return 0.25; },
    GameInventoryManager && GameInventoryManager.register('pumpkinhead', e),
    typeof exports != 'undefined' && (typeof module != 'undefined' && module.exports && (exports = module.exports = e), exports.Pumpkinhead = e);
}();