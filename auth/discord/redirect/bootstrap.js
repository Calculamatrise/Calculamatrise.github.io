import Client from "./utils/client.js";

const params = new URLSearchParams(location.search);

window.onload = async function() {
    const client = new Client();

    client.on("ready", function() {
        this.getUser();
    });

    client.login({
        id: "708904786916933693",
        secret: "mtFStf87nPB28ANW77zxIgUxZ9pKf-It",
        token: null
    });

    //location.load("/");
}