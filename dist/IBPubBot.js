"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PBLang_1 = __importDefault(require("./PBLang"));
const PBUserInterface_1 = __importDefault(require("./PBUserInterface"));
/*
    BOT CODE
*/
class IBPubBot {
    constructor(name, userInterfaceType, language = "au") {
        this._hasRun = false;
        this.name = name;
        this.langCode = language;
        this._ui = new PBUserInterface_1.default(userInterfaceType);
        this._userName = "{Username problem. Please report this error.}";
    }
    async run() {
        if (this._hasRun)
            return;
        this._hasRun = true;
        //this._userName = "";
        //let userAnswer = "";
        //let userIntent = true;
        // Introduce
        await this._ui.print((PBLang_1.default[this.langCode]["speech"]["intro"]).replace("{0}", this.name));
        // Get if user wants to order?
        if (!(await this._getOrderIntent())) {
            // END SESSION
            this._ui.print(PBLang_1.default[this.langCode]["speech"]["goodbye"]);
            return;
        }
        // Get user's name
        this._userName = await this._getUserName();
        console.log("NAME :", this._userName);
        //
        //userIntent = await this._ui.intent(userAnswer,PBLanguage[this.langCode]["answers"]["myName"]);
        //console.log(hi);
        ///await this.introduce();
        //await this.wantsToOrder();
        // Would you like to order some food?
        //userAnswer = await this._ui.input(PBLanguage[this.langCode]["speech"]["foodIntent"]);
        //await this._ui.intent("sure thing",PBLanguage[this.langCode]["answers"]["yes"]);
        //await this._ui.input()
    }
    _getOrderIntent() {
        return new Promise(async (resolve) => {
            let userAnswer = await this._ui.input(PBLang_1.default[this.langCode]["speech"]["orderIntent"]);
            let userIntent = await this._ui.intent(userAnswer, PBLang_1.default[this.langCode]["fuzzy"]["yes"]);
            if (!userIntent) {
                //let userAnswer = await this._ui.input(PBLanguage[this.langCode]["speech"]["orderIntent"]);
                userIntent = await this._ui.intent(userAnswer, PBLang_1.default[this.langCode]["fuzzy"]["no"]);
                if (userIntent) {
                    this._ui.print(PBLang_1.default[this.langCode]["speech"]["noOrder"]);
                    resolve(false);
                }
                else {
                    this._ui.print(PBLang_1.default[this.langCode]["speech"]["notUnderstood"]);
                    if (!(await this._getOrderIntent())) {
                        resolve(false);
                    }
                }
            }
            resolve(true);
        });
    }
    _getUserName() {
        return new Promise(async (resolve) => {
            let userAnswer = await this._ui.input(PBLang_1.default[this.langCode]["speech"]["askName"]);
            while (!userAnswer.toLowerCase().startsWith(PBLang_1.default[this.langCode]["words"]["myName"].toLowerCase())
                || userAnswer.trim().toLowerCase() === PBLang_1.default[this.langCode]["words"]["myName"].toLowerCase()) {
                if (this._ui.ttsEnabled) {
                    this._ui.print(PBLang_1.default[this.langCode]["speech"]["useMyNameTTS"].replace("{0}", PBLang_1.default[this.langCode]["words"]["myName"]));
                }
                else {
                    this._ui.print(PBLang_1.default[this.langCode]["speech"]["useMyNameText"].replace("{0}", PBLang_1.default[this.langCode]["words"]["myName"]));
                }
                userAnswer = await this._ui.input(PBLang_1.default[this.langCode]["speech"]["askName"]);
            }
            ;
            let userNames = userAnswer.toLowerCase().replace(PBLang_1.default[this.langCode]["words"]["myName"].toLowerCase(), "").trim().split(" ");
            let userName = userNames.map(value => { return value[0].toUpperCase() + value.slice(1); }).join(" ");
            resolve(userName);
        });
    }
}
exports.IBPubBot = IBPubBot;
exports.default = IBPubBot;
