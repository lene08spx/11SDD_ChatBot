// @ts-check
import { EventEmitter } from "events";

/*
    LANG
*/

/**
 * `au` Australian
 */
type PBLangTypes = "au";
const PBLanguage = {
    "au": {
        "speech": {
            "intro": "G'Day!, my name is {name}. Welcome to the Ironbark Pub food ordering service."
        },
        "answers": {

        }
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
export class IBPubBot {

    public readonly name: string;
    public readonly langCode: PBLangTypes;
    //private _eventEmitter: PBEventEmitter;
    private _hasRun: boolean = false;
    //private _ui: PBUserInterface;
    private _uiType: PBUITypes;

    constructor ( name: string, userInterfaceType: PBUITypes, language: PBLangTypes = "au" ) {
        this.name = name;
        this.langCode = language;
        //this._eventEmitter = new PBEventEmitter();
        this._uiType = userInterfaceType;
        //this._ui = new PBUserInterface(this, this._eventEmitter, this._uiType);
        
        //this._eventEmitter.emit("ready",{"speech":""});
    }

    public run (): void {
        if (this._hasRun) throw "Bot Already Running.";
        this._hasRun = true;
        this.introduce(); // await
        // Would you like to order some food?
    }

    private introduce (): void {
        //this._eventEmitter.emit("introduce",{
        //    "speech": (PBLanguage[this.langCode].speech.intro).replace("{name}",this.name)
        //});
    }

    private getUsersName (): void {

    }

}
export default IBPubBot;





/*
    UserInterface CODE
*/
import "readline"
declare type PBUITypes = "console";// | "graphical";
declare interface PBUserInterface {
    input(question: string): Promise<string>;
    print(message: string): Promise<string>;
}
class PBUserInterface {

    //public readonly interfaceType: PBUITypes;
    //private _bot: IBPubBot;
    //private _botEventEmitter: PBEventEmitter;
/*
    constructor (bot: IBPubBot, events: PBEventEmitter, type: PBUITypes) {
        this.interfaceType = type;
        this._bot = bot;
        this._botEventEmitter = events;
        this.initEvents();
        // Set implementation specific functions
        if (this.interfaceType === "console") {
            this.input = this.console_input;
        }
    }

    private initEvents(): void {
        this._botEventEmitter.on("introduce",(eventData)=>{
            console.log(eventData);
        });
    }

    public console_input(question: string) {
        return new Promise<string>(function (reject, resolve) {
            //resolve("");
        });
    }
*/
}
