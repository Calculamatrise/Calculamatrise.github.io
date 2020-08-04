fetch('./storage.json').then((response) => response.json()).then(json => {
    document.addEventListener("click", function(){
        json.clicks ++
        document.getElementById("display").innerHTML = json.clicks;
        if(document.getElementById("level"))
            document.getElementById("level").innerHTML = `Level ${json.level}`;
        if(document.getElementById("prestige"))
            document.getElementById("prestige").innerHTML = `Prestige ${json.prestige}`;
    });
    setInterval(() => {
        if(json.clicks >= 100 && json.level == 0 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
            const div = document.createElement('div');
            div.id = "level";
            div.innerHTML = `Level ${json.level}`;
            document.getElementById('body').appendChild(div);
        } else if(json.clicks >= 150 && json.level == 1 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
        } else if(json.clicks >= 300 && json.level == 2 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
        } else if(json.clicks >= 500 && json.level == 3 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
        } else if(json.clicks >= 750 && json.level == 4 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
        } else if(json.clicks >= 1000 && json.level == 5 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
        } else if(json.clicks >= 2500 && json.level == 6 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
        } else if(json.clicks >= 5000 && json.level == 7 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
        } else if(json.clicks >= 10000 && json.level == 8 && json.prestige == 0){
            json.clicks = 0;
            json.level ++
        } else if(json.clicks >= 100000 && json.level == 9 && json.prestige == 0){
            json.clicks = 0;
            json.level = 0;
            json.prestige ++
            const div = document.createElement('div');
            div.id = "prestige";
            div.innerHTML = `Prestige ${json.level}`;
            document.getElementById('body').appendChild(div);
        }
        document.getElementById("display").innerHTML = json.clicks;
    },100);
});