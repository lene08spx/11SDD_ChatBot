// @ts-check
import * as PB from "./PBTypes";
import PBLanguage from "./PBLang";
import PBUserInterface from "./PBUserInterface";

/*
    BOT CODE
*/

export class IBPubBot {

    public readonly langCode: PB.PBLangTypes;
    public readonly name: string;
    private _hasRun: boolean = false;
    private _ui: PBUserInterface;
    private _userName: string;

    constructor ( name: string, userInterfaceType: PB.PBUITypes, language: PB.PBLangTypes = "au" ) {
        this.name = name;
        this.langCode = language;
        this._ui = new PBUserInterface(userInterfaceType);
        this._userName = "{Username problem. Please report this error.}";
    }
    
    public async run (): Promise<void> {
        if (this._hasRun) return;
        this._hasRun = true;
        //this._userName = "";
        //let userAnswer = "";
        //let userIntent = true;

        // Introduce
        await this._ui.print((PBLanguage[this.langCode]["speech"]["intro"]).replace("{0}",this.name));

        // Get if user wants to order?
        if (!(await this._getOrderIntent())) {
            // END SESSION
            this._ui.print(PBLanguage[this.langCode]["speech"]["goodbye"]);
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

    private _getOrderIntent (): Promise<boolean> {
        return new Promise(async resolve => {
            let userAnswer = await this._ui.input(PBLanguage[this.langCode]["speech"]["orderIntent"]);
            let userIntent = await this._ui.intent(userAnswer,PBLanguage[this.langCode]["fuzzy"]["yes"]);
            if (!userIntent) {
                //let userAnswer = await this._ui.input(PBLanguage[this.langCode]["speech"]["orderIntent"]);
                userIntent = await this._ui.intent(userAnswer,PBLanguage[this.langCode]["fuzzy"]["no"]);
                if (userIntent) {
                    this._ui.print(PBLanguage[this.langCode]["speech"]["noOrder"]);
                    resolve(false);
                } else {
                    this._ui.print(PBLanguage[this.langCode]["speech"]["notUnderstood"]);
                    if (!(await this._getOrderIntent())) {
                        resolve(false);
                    }
                }
            }
            resolve(true);
        });
    }

    private _getUserName (): Promise<string> {
        return new Promise(async resolve => {
            let userAnswer = await this._ui.input(PBLanguage[this.langCode]["speech"]["askName"]);
            while (
                !userAnswer.toLowerCase().startsWith(PBLanguage[this.langCode]["words"]["myName"].toLowerCase())
                || userAnswer.trim().toLowerCase() === PBLanguage[this.langCode]["words"]["myName"].toLowerCase())
            {
                if (this._ui.ttsEnabled) {
                    this._ui.print(PBLanguage[this.langCode]["speech"]["useMyNameTTS"].replace("{0}",PBLanguage[this.langCode]["words"]["myName"]));
                } else {
                    this._ui.print(PBLanguage[this.langCode]["speech"]["useMyNameText"].replace("{0}",PBLanguage[this.langCode]["words"]["myName"]));
                }
                userAnswer = await this._ui.input(PBLanguage[this.langCode]["speech"]["askName"]);
            };
            let userNames = userAnswer.toLowerCase().replace(PBLanguage[this.langCode]["words"]["myName"].toLowerCase(), "").trim().split(" ");
            let userName = userNames.map(value => {return value[0].toUpperCase()+value.slice(1)}).join(" ");
            resolve(userName);
        });
    }
}
export default IBPubBot;
