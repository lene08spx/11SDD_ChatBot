"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-check
const events_1 = require("events");
class IBPubBotEvent extends events_1.EventEmitter {
}
class IBPubBot {
    constructor(name) {
        this.name = name;
        this.events = new IBPubBotEvent();
        this.events.emit("ready", {});
    }
    init() {
        this.introduce();
    }
    introduce() {
        let speechText = "G'Day!, my name is " + this.name;
        let eventData = {
            "speech": speechText
        };
        this.events.emit("introduce", eventData);
    }
    getOrderIntent() {
    }
    getUsersName() {
    }
}
exports.IBPubBot = IBPubBot;
exports.default = IBPubBot;
