import { Game, fixDpi } from './Game.js';

window.Game = new Game(document.getElementById('canvas'));

window.onresize = () => fixDpi(window.Game.canvas);

document.onkeypress = window.Game.onstart;
