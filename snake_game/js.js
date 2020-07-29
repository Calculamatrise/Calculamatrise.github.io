window.onload = function() {
    canv = document.getElementById("canvas");
    c = canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    setInterval(game,1000/15);
}
px = py = 10;
gs = tc = 20;
ax = ay = 15;
xv = yv = 0;
trail=[];
tail=5;
function game(){
    px += xv;
    py += yv;
    if(px<0){
        c.font = "30px Comic Sans MS";
        c.fillStyle = "red";
        c.textAlign = "center";
        c.fillText("You Died.", canvas.width/2, canvas.height/2);
        c.fillStyle = "#1d1d1d";
        tail = 5;
        xv = yv = 0;
        px = py = 10;
    }
    if(px>tc - 1){
        c.font = "30px Comic Sans MS";
        c.fillStyle = "red";
        c.textAlign = "center";
        c.fillText("You Died.", canvas.width/2, canvas.height/2);
        c.fillStyle = "#1d1d1d";
        tail = 5;
        xv = yv = 0;
        px = py = 10;
    }
    if(py<0){
        c.font = "30px Comic Sans MS";
        c.fillStyle = "red";
        c.textAlign = "center";
        c.fillText("You Died.", canvas.width/2, canvas.height/2);
        c.fillStyle = "#1d1d1d";
        tail = 5;
        xv = yv = 0;
        px = py = 10;
    }
    if(py>tc - 1){
        c.font = "30px Comic Sans MS";
        c.fillStyle = "red";
        c.textAlign = "center";
        c.fillText("You Died.", canvas.width/2, canvas.height/2);
        c.fillStyle = "#1d1d1d";
        tail = 5;
        xv = yv = 0;
        px = py = 10;
    }
    c.fillStyle = "#1d1d1d";
    c.fillRect(0,0,canv.width,canv.height);

    c.fillStyle = "#43b9cc";
    for(var i = 0; i<trail.length;i++){
        c.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
        if(trail[i].x==px && trail[i].y==py){
            c.font = "30px Comic Sans MS";
            c.fillStyle = "red";
            c.textAlign = "center";
            c.fillText("You Died.", canvas.width/2, canvas.height/2);
            c.fillStyle = "#1d1d1d";
            tail = 5;
            xv = yv = 0;
            px = py = 10;
        }
    }
    trail.push({x:px,y:py});
    while(trail.length>tail){
        trail.shift();
    }
    if(ax==px && ay==py){
        tail++;
        ax=Math.floor(Math.random()*tc);
        ay=Math.floor(Math.random()*tc);
    }
    c.fillStyle = "#995374";
    c.fillRect(ax*gs,ay*gs,gs-2,gs-2);
}
function keyPush(evt){
    switch(evt.keyCode){
        case 37:
            xv=-1;yv=0;
        break;
        case 38:
            xv=0;yv=-1;
        break;
        case 39:
            xv=1;yv=0;
        break;
        case 40:
            xv=0;yv=1;
        break;
        case 32:
            xv=0;yv=0;
            console.log("Paused.")
        break;
    }
}