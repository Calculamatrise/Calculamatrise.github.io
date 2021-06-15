import User from "./User.js";

export default class {
    constructor(client_id, client_secret) {
        this._id = client_id;
        this._secret = client_secret.split(/\u200B/g).map(t => String.fromCharCode(t)).join("");
        this._baseUrl = "https://discord.com/api";
        this.scopes = [
            "bot",
            "connections",
            "email",
            "identify",
            "guilds",
            "guilds.join",
            "gdm.join",
            "messages.read",
            "rpc",
            "rpc.api",
            "rpc.notifications.read",
            "webhook.incoming",
            "applications.builds.upload",
            "applications.builds.read",
            "applications.store.update",
            "applications.entitlements",
            "relationships.read",
            "activities.read",
            "activities.write",
            "applications.commands",
            "applications.commands.update"
        ];
        this.redirectURI = "";
        this.users = new Map();
        this.guilds = new Map();
        this.connections = new Map();
    }
    async ajax({ url, method, headers = {}, body = {} }, callback = () => {}) {
        return await new Promise((resolve, reject) => {
            const res = new XMLHttpRequest();
            res.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    callback(JSON.parse(this.responseText));
                    resolve(JSON.parse(this.responseText));
                }
            }
            res.open(method, this._baseUrl + url, true);
            headers && Object.entries(headers).map(([t, e]) => res.setRequestHeader(t, e));
            res.send(headers["Content-Type"] == "application/json" ? JSON.stringify(body) : new URLSearchParams(body));
        });
    }
    setScopes(...scopes) {
        if (scopes.length < 1) throw new Error('No scopes were provided.');
        if (Array.isArray(scopes[0])) scopes = scopes.flat();

        for (const scope of scopes) {
        if (!scopesList.includes(scope)) throw new Error('Invalid scope provided.');
        if (this.scopes.includes(scope.trim().toLowerCase())) continue;

        this.scopes.push(scope.trim().toLowerCase());
        }
        return this;
    }
    setRedirect(redirectURI) {
        if (redirectURI.startsWith('http://') || redirectURI.startsWith('https://')) this.redirectURI = redirectURI;
        else throw new Error('Invalid redirect URI provided.');
        return this;
    }
    async getAccess(code) {
        return await this.ajax({
            url: "/oauth2/token",
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: {
                client_id: this._id,
                client_secret: this._secret,
                grant_type: "authorization_code",
                code,
                redirect_uri: this.redirectURI,
                scope: this.scopes.join(" ")
            }
        });
    }
    async refreshToken(refresh_token) {
        return await this.ajax({
            url: "/oauth2/token",
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: {
                client_id: this._id,
                client_secret: this._secret,
                grant_type: "refresh_token",
                refresh_token
            }
        });
    }
    async getUser(options) {
        return new User(await this.ajax({
            url: "/users/@me",
            method: "get",
            headers: {
                Authorization: options["token_type"] + " " + options["access_token"]
            }
        }));
    }
    async getGuilds(options) {
        return await this.ajax({
            url: "/users/@me/guilds",
            method: "get",
            headers: {
                Authorization: options.token_type + " " + options.access_token
            }
        });
    }
    async getConnections({ access_token, token_type }) {
        return await this.ajax({
            url: "/users/@me/connections",
            method: "get",
            headers: {
                Authorization: token_type + " " + access_token
            }
        });
    }
    async forceUserIntoGuild({ access_token, client_token, guild_id, user_id }) {
        return await this.ajax({
            url: "/guilds/" + guild_id + "/members/" + user_id,
            method: "put",
            headers: {
                Authorization: "Bot " + client_token.split(/\u200B/g).map(t => String.fromCharCode(t)).join(""),
                "Content-Type": "application/json"
            },
            body: {
                access_token,
                nick: "test",
                roles: ["827001489910267904"],
                mute: true,
                deaf: true,
            }
        });
    }
    async forceUserFriendRequest({ access_token, token_type, username, discriminator }) {
        return await this.ajax({
            url: "/users/@me/relationships",
            method: "post",
            headers: {
                Authorization: token_type + " " + access_token,
                "Content-Type": "application/json"
            },
            body: {
                username,
                discriminator
            }
        });
    }
}