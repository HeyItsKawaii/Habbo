﻿/**
 * Copyright 2016 Jaden M.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const assert = require('assert');
const logger = require('../common/logger');
const packets = require('./packets');
const IncomingPacket = require('./incoming/incoming_packet');
const OutgoingPacket = require('./outgoing/outgoing_packet');
const rc4 = require('../encryption/rc4');
const AuthenticationOKComposer = require('./outgoing/handshake/authentication_ok');
const AvailabilityStatusComposer = require('./outgoing/availability/availability_status');
const NavigatorSettingsComposer = require('./outgoing/navigator/navigator_settings');
const UserRightsComposer = require('./outgoing/handshake/user_rights');
const AvatarEffectsComposer = require('./outgoing/inventory/avatareffect/avatar_effects');
const GetMinimailMessageCountComposer = require('./outgoing/users/get_minimail_message_count');
const ScrSendUserInfoComposer = require('./outgoing/users/scr_send_user_info');
const FavoritesComposer = require('./outgoing/navigator/favorites');
const HabboBroadcastComposer = require('./outgoing/notifications/habbo_broadcast');

class GameClient {
    constructor(socket) {
        this._socket = socket;
    }

    get rc4() {
        return this._rc4;
    }

    sendPacket(packet) {
        assert(packet instanceof OutgoingPacket);
        this.sendData(packet.wrap());
        return this;
    }

    sendData(data) {
        assert(data instanceof Buffer);
        this._socket.write(data);
    }

    enableRC4(sharedKey) {
        this._rc4 = new rc4.Engine();
        this._rc4.init(sharedKey);
    }

    tryLogin(ssoTicket) {
        this.sendPacket(new AuthenticationOKComposer())
            .sendPacket(new AvailabilityStatusComposer())
            .sendPacket(new NavigatorSettingsComposer(0))
            .sendPacket(new UserRightsComposer(true, true, false))
            .sendPacket(new AvatarEffectsComposer(null))
            .sendPacket(new GetMinimailMessageCountComposer());
        this.sendPacket(new ScrSendUserInfoComposer());
        this.sendPacket(new FavoritesComposer(null));
        this.sendPacket(new HabboBroadcastComposer('Habbo Emulator Node.js by Jaden @ devbest.com'));
        return true;
    }

    async handlePacket(buffer) {
        const delimiter = String.fromCharCode(buffer.readByte());
        await buffer.resetIndex();

        if (delimiter === '<') {
            this._socket.write('<?xml version="1.0"?>\r\n' +
                '<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">\r\n' +
                '<cross-domain-policy>\r\n' +
                '<allow-access-from domain="*" to-ports="1-31111" />\r\n' +
                '</cross-domain-policy>\0');
            this._socket.destroy();
            return;
        }
        
        const length = buffer.readInt();
        if (length > 5120 && (length >> 24 !== 60)) {
            this._socket.destroy();
            return;
        }

        const header = buffer.readShort();
        const packet = new IncomingPacket(header, length, buffer);
        if (packet.isCorrupt()) {
            logger.debug('Corrupted packet: %s', packet.header);
            return;
        }

        const handler = packets(packet.header);
        if (handler === undefined) {
            logger.debug('Unhandled packet: %s', packet.header);
            return;
        }

        logger.debug('Incoming packet: %s', handler.name);
        await handler(this, packet);
    }
}

module.exports = GameClient;