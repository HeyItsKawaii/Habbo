
const initDiffieHandshakeMessageComposer = 1030;
const completeDiffieHandshakeMessageComposer = 1989;
const uniqueIDMessageEvent = 2935;
const habboBroadcastMessageComposer = 3578;
const authenticationOKMessageComposer = 347;
const availabilityStatusMessageComposer = 3590;
const navigatorSettingsMessageComposer = 3001;
const userRightsMessageComposer = 901;
const avatarEffectsMessageComposer = 3798;
const getMinimailMessageCountComposer = 417;
const scrSendUserInfoMessageComposer = 3457;
const favoritesMessageComposer = 1767;

class Outgoing {
    static get InitDiffieHandshakeMessageComposer() {
        return initDiffieHandshakeMessageComposer;
    }

    static get CompleteDiffieHandshakeMessageComposer() {
        return completeDiffieHandshakeMessageComposer;
    }
    
    static get UniqueIDMessageEvent() {
        return uniqueIDMessageEvent;
    }

    static get HabboBroadcastMessageComposer() {
        return habboBroadcastMessageComposer;
    }

    static get AuthenticationOKMessageComposer() {
        return authenticationOKMessageComposer;
    }

    static get AvailabilityStatusMessageComposer() {
        return availabilityStatusMessageComposer;
    }

    static get NavigatorSettingsMessageComposer() {
        return navigatorSettingsMessageComposer;
    }

    static get UserRightsMessageComposer() {
        return userRightsMessageComposer;
    }

    static get AvatarEffectsMessageComposer() {
        return avatarEffectsMessageComposer;
    }

    static get GetMinimailMessageCountComposer() {
        return getMinimailMessageCountComposer;
    }

    static get ScrSendUserInfoMessageComposer() {
        return scrSendUserInfoMessageComposer;
    }

    static get FavoritesMessageComposer() {
        return favoritesMessageComposer;
    }
}

module.exports = Outgoing;