"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PBLanguage = {
    "au": {
        "speech": {
            "intro": "G'Day!, my name is {name}. Welcome to the Ironbark Pub food ordering service."
        },
        "answers": {}
    }
};
/*
    BOT CODE
*/
/*
interface PBEvent {
    speech: string;
}
type PBEventTypes = "ready" | "introduce";
declare interface PBEventEmitter {
    emit(event: PBEventTypes, eventData: PBEvent): boolean;
    on(event: PBEventTypes, listener: (eventData: PBEvent) => void): this;
}
class PBEventEmitter extends EventEmitter {}
*/
class IBPubBot {
    constructor(name, userInterfaceType, language = "au") {
        //private _eventEmitter: PBEventEmitter;
        this._hasRun = false;
        this.name = name;
        this.langCode = language;
        //this._eventEmitter = new PBEventEmitter();
        this._uiType = userInterfaceType;
        //this._ui = new PBUserInterface(this, this._eventEmitter, this._uiType);
        //this._eventEmitter.emit("ready",{"speech":""});
    }
    run() {
        if (this._hasRun)
            throw "Bot Already Running.";
        this._hasRun = true;
        this.introduce(); // await
        // Would you like to order some food?
    }
    introduce() {
        //this._eventEmitter.emit("introduce",{
        //    "speech": (PBLanguage[this.langCode].speech.intro).replace("{name}",this.name)
        //});
    }
    getUsersName() {
    }
}
exports.IBPubBot = IBPubBot;
exports.default = IBPubBot;
/*
    UserInterface CODE
*/
require("readline");
class PBUserInterface {
}
