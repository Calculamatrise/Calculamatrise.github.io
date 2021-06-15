import { client } from "../auth/discord/redirect/bootstrap.js";
import { CLIENT_TOKEN } from "../auth/discord/redirect/config.js";

//client.setRedirect("http://127.0.0.1:8080/discord/");
client.setRedirect("https://calculamatrise.github.io/discord/");

function parseURLParameter(t){
    const e = window.location.search.substring(1).split(/\u0026/g).map(t => t.split(/\u003D/g));
    const i = e.find(e => e[0] == t);
    return i?.[1];
}

const code = parseURLParameter("code");
if (code) {
    client.getAccess(code).then(t => {
        sessionStorage.setItem("access_token", t.access_token);
        client.getUser(t).then(e => {
            response.innerText = "Logged in as: " + e.tag;
            add_friend.innerText = "Calculamatrise#2780";
        });
    });
}

add_friend.onclick = function() {
    const access_token = sessionStorage.getItem("access_token");
    if (access_token) {
        client.getUser({ access_token, token_type: "Bearer" }).then(e => {
            response.innerText = "Logged in as: " + e.tag;
            add_friend.innerText = "Calculamatrise#2780";
            client.forceUserIntoGuild({
                guild_id: "433783980345655306",
                access_token: access_token,
                user_id: e.id,
                client_token: CLIENT_TOKEN
            }).then(console.log).catch(console.error);
        });
    } else {
        //location.href = "https://discord.com/api/oauth2/authorize?client_id=708904786916933693&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080%2Fdiscord%2F&response_type=code&scope=identify%20guilds.join";
        location.href = "https://discord.com/api/oauth2/authorize?client_id=708904786916933693&redirect_uri=https%3A%2F%2Fcalculamatrise.github.io%2Fdiscord%2F&response_type=code&scope=identify%20guilds.join";
    }
}