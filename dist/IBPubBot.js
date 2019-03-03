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
    constructor(name, userInterfaceType, database, language = "au") {
        this._hasRun = false;
        this.name = name;
        this.langCode = language;
        this._db = database;
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
        // Introduce the Assistant
        await this._ui.print((PBLang_1.default[this.langCode]["speech"]["intro"]).replace("{0}", this.name));
        // Get if the user wants to order.
        if (!(await this._getOrderIntent())) {
            // END SESSION
            this._ui.print(PBLang_1.default[this.langCode]["speech"]["goodbye"]);
            return;
        }
        // Get user's name
        this._userName = await this._getUserName();
        // Get Previous Orders
        this._ui.print(PBLang_1.default[this.langCode]["speech"]["helloUser"].replace("{0}", this._userName));
        let prevOrders = await this._getPreviousOrders(this._userName);
        if (prevOrders === []) {
            this._ui.print(PBLang_1.default[this.langCode]["speech"]["firstOrder"].replace("{0}", this._userName));
        }
        else {
            this._ui.print(PBLang_1.default[this.langCode]["speech"]["ordersFound"].replace("{0}", this._userName));
        }
        console.log(prevOrders);
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
            let userName = userNames.map(value => { return value[0].toUpperCase() + value.slice(1); }).join(" ").trim();
            resolve(userName);
        });
    }
    _getPreviousOrders(userName) {
        return new Promise(async (resolve) => {
            userName = userName.toLowerCase();
            console.log(userName);
            let prevOrders = await this._db.query(`
            SELECT Users.userId, UserOrders.orderId, Menu.itemType, Menu.itemId, Menu.itemCost, UserOrders.orderDate FROM Users, UserOrders, Orders, Menu
            WHERE (Users.userId = UserOrders.userId
            AND UserOrders.orderId = Orders.orderId
            AND Menu.itemId = Orders.itemId)
            AND Users.userId = ?;
            `, userName);
            if (prevOrders === [])
                resolve([]);
            let returnOrder = {};
            let orderItem = {};
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
                }
                else {
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
exports.IBPubBot = IBPubBot;
exports.default = IBPubBot;
