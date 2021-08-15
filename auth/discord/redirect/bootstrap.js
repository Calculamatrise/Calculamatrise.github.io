import Client from "./utils/Client.js";

const params = new URLSearchParams(location.search);

window.onload = async function() {
    const client = new Client();

    client.on("ready", function() {
        this.requestToken(params.get("code")).then(console.log)
    });

    client.login({
        id: "708904786916933693",
        secret: null,
        token: null
    });

    //location.load("/");
}