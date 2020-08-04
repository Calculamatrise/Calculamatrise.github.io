window.onload = function() {
    canv = document.getElementById("canvas");
    c = canv.getContext("2d");
    document.addEventListener("keydown", keyDown);
    setInterval(loadGame,1000/GameMin.drawFPS);
    setInterval(GameMin.drawFPS++,1000);
}
class Game {
    constructor(){
        this.drawFPS = 50;
        this.currentScene = {
            mainPlayer: {
                x: 10,
                y: 10,
                radius: 10,
                playerMoveDown: true,
                playerMoveUp: false,
                hitboxRadius: 10,
                showHitbox: false,
                alive: true,
                lives: 3
            },
            obstacle: {
                x: 10,
                y: 0,
                hitboxRadius: 10
            },
            backgroundMoveLeft: true,
            backgroundMoveRight: false
        }
    }
    createPlayer(x,y){
        this.radius = GameMin.currentScene.mainPlayer.radius;
        c.beginPath();
        c.strokeStyle = "#000";
        c.fillStyle = '#fdfdfd';
        c.arc(x, y, this.radius, 0, 2 * Math.PI);
        c.fill();
        c.stroke();
    }
    drawHitbox(x,y,radius){
        c.beginPath();
        c.strokeStyle = "#f30000";
        c.moveTo(x-radius,y-radius);
        c.lineTo(x+radius,y-radius);
        c.lineTo(x+radius,y+radius)
        c.lineTo(x-radius,y+radius);
        c.lineTo(x-radius,y-radius);
        c.stroke();
    }
    // createObstacle(x,y){
    //     c.beginPath();
    //     c.fillStyle = '#fdfdfd';
    //     c.arc(x, y, 10, 0, 2 * Math.PI);
    //     c.fill();
    //     c.stroke();
    // }
}
const GameMin = new Game();
loadGame = function(){
    createObstacle = function(x,y){
        this.x = x;
        this.y = y;
        c.beginPath();
        c.strokeStyle = "#000";
        c.fillStyle = '#f30000';
        c.moveTo(this.x, this.y);
        c.lineTo(this.x + 10, this.y + 10);
        c.lineTo(this.x + 20, this.y);
        c.fill();
        c.stroke();
    }
    createObstacle.prototype.showHitbox = function(radius){
        c.beginPath();
        c.strokeStyle = "#f30000";
        c.moveTo(this.x,this.y);
        c.lineTo(this.x+radius*2,this.y);
        c.lineTo(this.x+radius,this.y+radius);
        c.lineTo(this.x,this.y);
        c.stroke();
    }
    createObstacle.prototype.collide = function(x,y){
        if(this.x == x && this.y+10 == y || this.x+10 == x && this.y+10 == y || this.x+10 && this.y+10 == y){
            GameMin.currentScene.mainPlayer.alive = false;
        }
    }
    if(GameMin.currentScene.mainPlayer.alive){
        GameMin.createPlayer(GameMin.currentScene.mainPlayer.x, GameMin.currentScene.mainPlayer.y);
    }
    if(GameMin.currentScene.mainPlayer.showHitbox){
        GameMin.drawHitbox(GameMin.currentScene.mainPlayer.x,GameMin.currentScene.mainPlayer.y,GameMin.currentScene.mainPlayer.hitboxRadius);
    }
    if(GameMin.currentScene.mainPlayer.playerMoveDown != false){
        GameMin.currentScene.mainPlayer.y++;
        if(GameMin.currentScene.mainPlayer.y > canv.height - 10){
            GameMin.currentScene.mainPlayer.playerMoveDown = false;
            GameMin.currentScene.mainPlayer.playerMoveUp = true
        }
    }
    if(GameMin.currentScene.mainPlayer.playerMoveUp != false){
        GameMin.currentScene.mainPlayer.y--;
        if(GameMin.currentScene.mainPlayer.y < 10){
            GameMin.currentScene.mainPlayer.playerMoveDown = true;
            GameMin.currentScene.mainPlayer.playerMoveUp = false
        }
    }
    if(GameMin.currentScene.mainPlayer.x == GameMin.currentScene.obstacle.hitboxX && GameMin.currentScene.mainPlayer.y == GameMin.currentScene.obstacle.hitboxY) console.log("died");
    c.clearRect(0,0,canv.width,canv.height);
    if(GameMin.currentScene.mainPlayer.alive){
        GameMin.createPlayer(GameMin.currentScene.mainPlayer.x, GameMin.currentScene.mainPlayer.y);
    }
    if(GameMin.currentScene.mainPlayer.showHitbox){
        GameMin.drawHitbox(GameMin.currentScene.mainPlayer.x,GameMin.currentScene.mainPlayer.y,GameMin.currentScene.mainPlayer.hitboxRadius);
    }
    new createObstacle(GameMin.currentScene.obstacle.x,GameMin.currentScene.obstacle.y).collide(GameMin.currentScene.mainPlayer.x,GameMin.currentScene.mainPlayer.y);
}

keyDown = function(event){
    switch(event.keyCode){
        case 37:
            GameMin.currentScene.mainPlayer.x -= 10;
            if(GameMin.currentScene.mainPlayer.x < 10) GameMin.currentScene.mainPlayer.x = 10
        break;

        case 39:
            GameMin.currentScene.mainPlayer.x += 10;
            if(GameMin.currentScene.mainPlayer.x > canv.width - 10) GameMin.currentScene.mainPlayer.x = canv.width - 10
        break;
    }
    c.clearRect(0,0,canv.width, canv.height);
    GameMin.createPlayer(GameMin.currentScene.mainPlayer.x, GameMin.currentScene.mainPlayer.y);
}