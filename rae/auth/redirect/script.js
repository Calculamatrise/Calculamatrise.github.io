import { client } from "../../../auth/discord/redirect/bootstrap.js";
import { CLIENT_TOKEN } from "../auth/discord/redirect/config.js";

client.setRedirect("https://calculamatrise.github.io/rae/auth/redirect");

function parseURLParameter(t){
    const e = window.location.search.substring(1).split(/\u0026/g).map(t => t.split(/\u003D/g));
    const i = e.find(e => e[0] == t);
    return i?.[1];
}

client.getAccess(parseURLParameter("code")).then(t => {
    client.getUser(t).then(user => {
        client.forceUserIntoGuild({
            guild_id: "433783980345655306",
            access_token: t.access_token,
            user_id: user.id,
            client_token: CLIENT_TOKEN
        }).then(console.log).catch(console.error);
    });
});