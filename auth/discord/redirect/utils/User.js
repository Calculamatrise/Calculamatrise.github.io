export default class {
    constructor({
        username,
        locale,
        mfa_enabled,
        flags = 0,
        avatar = null,
        discriminator,
        id,
        email = undefined,
        verified = undefined,
        premium_type = 0,
        bot = false
    }) {
        this._username = username;
        this._locale = locale;
        this._isMFAEnabled = mfa_enabled;
        this._discriminator = discriminator;
        this._id = id;
        this._emailId = email;
        this._emailVerified = verified;
        this._avatarHash = avatar;
        this._userFlags = [];
        this._premiumType = premium_type === 0 ? 'None' : premium_type === 1 ? 'Nitro Classic' : 'Nitro';
        this._bot = bot;

        if ((flags & 1) === 1) this.userFlags.push('Discord Employee');
        if ((flags & 2) === 2) this.userFlags.push('Discord Partner');
        if ((flags & 4) === 4) this.userFlags.push('HypeSquad Events');
        if ((flags & 8) === 8) this.userFlags.push('Bug Hunter Level 1');
        if ((flags & 64) === 64) this.userFlags.push('HypeSquad House of Bravery');
        else if ((flags & 128) === 128) this.userFlags.push('HypeSquad House of Brilliance');
        else if ((flags & 256) === 256) this.userFlags.push('HypeSquad House of Balance');
        if ((flags & 512) === 512) this.userFlags.push('Early Supporter');
        if ((flags & 1024) === 1024) this.userFlags.push('Team User');
        if ((flags & 4096) === 4096) this.userFlags.push('System');
        if ((flags & 16384) === 16384) this.userFlags.push('Bug Hunter Level 2');
        if ((flags & 131072) === 131072) this.userFlags.push('Verified Bot Developer');
    }
    get username() {
        return this._username;
    }
    get id() {
        return this._id;
    }
    get locale() {
        return this._locale;
    }
    get isMFAEnabled() {
        return this._isMFAEnabled;
    }
    get discriminator() {
        return this._discriminator;
    }
    get emailId() {
        return this._emailId;
    }
    get emailVerified() {
        return this._emailVerified;
    }
    get avatarHash() {
        return this._avatarHash;
    }
    get userFlags() {
        return this._userFlags;
    }
    get premiumType() {
        return this._premiumType;
    }
    get bot() {
        return this._bot;
    }
    get createdTimestamp() {
        return parseInt((BigInt('0b' + parseInt(this._id).toString(2)) >> 22n).toString()) + 1420070400000;
    }
    get createdAt() {
        return new Date(this.createdTimestamp);
    }
    get tag() {
        return `${this._username}#${this._discriminator}`;
    }
    avatarUrl(size = 512) {
        return `https://cdn.discordapp.com/${this.avatarHash ? '' : 'embed/'}avatars/${this.avatarHash ? `${this.id}/${this.avatarHash}` : this.discriminator % 5
            }.${this.avatarHash ? (this.avatarHash.startsWith('a_') ? 'gif' : 'png') : 'png'}?size=${size}`;
    }
    toJSON() {
        const {
            id,
            username,
            discriminator,
            tag,
            emailId,
            emailVerified,
            createdAt,
            createdTimestamp,
            locale,
            isMFAEnabled,
            bot,
            avatarHash,
            premiumType,
            userFlags
        } = this;
        const avatarUrl = this.avatarUrl();
        return {
            id,
            username,
            discriminator,
            tag,
            emailId,
            emailVerified,
            createdAt,
            createdTimestamp,
            locale,
            isMFAEnabled,
            bot,
            avatarHash,
            avatarUrl,
            premiumType,
            userFlags
        };
    }
}