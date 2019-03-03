// @ts-check
import * as PB from "./PBTypes";
import PBDatabase from "./PBDatabase";
import PBLanguage from "./PBLang";
import PBUserInterface from "./PBUserInterface";

/*
    BOT CODE
*/

export class IBPubBot {

    public readonly langCode: PB.PBLangTypes;
    public readonly name: string;
    private _db: PBDatabase;
    private _hasRun: boolean = false;
    private _ui: PBUserInterface;
    private _userName: string;

    constructor ( name: string, userInterfaceType: PB.PBUITypes, database: PBDatabase, language: PB.PBLangTypes = "au" ) {
        this.name = name;
        this.langCode = language;
        this._db = database;
        this._ui = new PBUserInterface(userInterfaceType);
        this._userName = "{Username problem. Please report this error.}";
    }
    
    public async run (): Promise<void> {
        if (this._hasRun) return;
        this._hasRun = true;
        //this._userName = "";
        //let userAnswer = "";
        //let userIntent = true;

        // Introduce the Assistant
        await this._ui.print((PBLanguage[this.langCode]["speech"]["intro"]).replace("{0}",this.name));

        // Get if the user wants to order.
        if (!(await this._getOrderIntent())) {
            // END SESSION
            this._ui.print(PBLanguage[this.langCode]["speech"]["goodbye"]);
            return;
        }

        // Get user's name
        this._userName = await this._getUserName();

        // Get Previous Orders
        this._ui.print(PBLanguage[this.langCode]["speech"]["helloUser"].replace("{0}",this._userName));
        let prevOrders = await this._getPreviousOrders(this._userName);
        if (prevOrders === []) {
            this._ui.print(PBLanguage[this.langCode]["speech"]["firstOrder"]);
        } else {
            this._ui.print(PBLanguage[this.langCode]["speech"]["ordersFound"]);
        }
        console.log(prevOrders);

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
            let userName = userNames.map(value => {return value[0].toUpperCase()+value.slice(1)}).join(" ").trim();
            resolve(userName);
        });
    }

    private _getPreviousOrders (userName: string) {
        return new Promise<{
                "date": string,
                "userId": string,
                "desert": [[string, number]],
                "drink": [[string, number]],
                "main": [[string, number]],
                "total": number
            }[]>(async resolve => {

            userName = userName.toLowerCase();
            
            let prevOrders = await this._db.query(`
            SELECT Users.userId, UserOrders.orderId, Menu.itemType, Menu.itemId, Menu.itemCost, UserOrders.orderDate FROM Users, UserOrders, Orders, Menu
            WHERE (Users.userId = UserOrders.userId
            AND UserOrders.orderId = Orders.orderId
            AND Menu.itemId = Orders.itemId)
            AND Users.userId = ?;
            `, userName);

            if (prevOrders === []) resolve([]);
            
            let returnOrder: any = {};
            let orderItem: any = {};
            for (orderItem of prevOrders) {
                if (!returnOrder[String(orderItem["orderId"])]) {
                    returnOrder[String(orderItem["orderId"])] = {
                        "date": orderItem["orderDate"],
                        "userId": orderItem["userId"],
                        "dessert": [],
                        "drink": [],
                        "main": [],
                        "total": 0,
                        "orderId": 0
                    };
                    let item = [orderItem["itemId"], orderItem["itemCost"]];
                    returnOrder[String(orderItem["orderId"])][orderItem["itemType"]].push(item);
                } else {
                    let item = [orderItem["itemId"], orderItem["itemCost"]];
                    returnOrder[String(orderItem["orderId"])][orderItem["itemType"]].push(item);
                }
            }
            let ro = [];
            for (let order of Object.keys(returnOrder)) {
                let total = 0;
                for (let item of returnOrder[order]["drink"]) {
                    total += item[1];
                }
                for (let item of returnOrder[order]["dessert"]) {
                    total += item[1];
                }
                for (let item of returnOrder[order]["main"]) {
                    total += item[1];
                }
                returnOrder[order]["total"] = total;
                returnOrder[order]["orderId"] = Number(order);
                ro.push(returnOrder[order]);
            }
            resolve(ro);
        });
    }
}
export default IBPubBot;
