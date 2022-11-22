import Game from "./utils/Game.js";

window.game = new Game(document.querySelector('#view'));
window.game.init();

navigation.addEventListener('navigate', function navigate() {
    this.removeEventListener('navigate', navigate);
    window.game.close();
});