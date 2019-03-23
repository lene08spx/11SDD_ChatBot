// @ts-check
import { PBDatabase } from "./PBDatabase";
import { PBUI }       from "./PBUI";
import { PBUser, PBFuzzy, PBOrder, PBMenuItem, PBOrdersViewRecord, PBOrderArray } from "./PBFoundation";

/*
    BOT CODE
*/

export class IBPubBot {

    public readonly name: string;
    private _db: PBDatabase;
    private _hasRun: boolean = false;
    private _ui: PBUI;
    private _user: PBUser | null | undefined;

    constructor ( name: string, database: PBDatabase ) {
        this.name = name;
        this._db = database;
        this._ui = new PBUI();
        this._user = null;
        //this._user.name = "{Username problem. Please report this error.}";
    }

    public async run (): Promise<void> {
        //================================
        // check if the bot is already running
        //================================
        if (this._hasRun) throw "Bot Already Running";
        this._hasRun = true;

        //================================
        // introduce the assistant
        //================================
        await this._ui.print(
            "G'Day!, my name is {0}. Welcome to the Ironbark Pub food ordering service."
            .replace("{0}",this.name)
        );

        //================================
        // get if the user wants to order
        // if not end the session
        //================================
        if (!(await this._userWantsToOrder())) {
            await this._ui.print(
                "Thank You, Have a nice day."
            );
            return;
        }

        //================================
        // get the user's name
        //================================
        this._user = await this._getUser();
        if (!this._user) {
            await this._ui.print(
                "Thank You, Have a nice day."
            );
            return;
        }
        // check if has my name is fuzzy
        // then check each word in input.split() against the name is fuzzy

        //================================
        // get previous orders
        //================================
        this._ui.div();
        await this._ui.print(
            "G'Day {0}!"
            .replace("{0}",this._user.prettyName)
        );
        let prevOrders = await this._getOrders(this._user);
        if (!prevOrders.length) {
            await this._ui.print(
                "It appears this is your first time ordering."
            );
        } else {
            await this._ui.print(
                "Here are your previous orders:"
            );
            await this._printOrder(prevOrders);
        }

        //================================
        // get new orders
        //================================
        this._ui.div();
    }

    private async _userWantsToOrder (): Promise<boolean> {
        return new Promise(async resolve => {
            let thresh = 80;
            let userAnswer = await this._ui.input(
                "Would you like to order some food now?"
            );
            userAnswer = userAnswer.toLowerCase();
            let userIntent = this._ui.intent(userAnswer,PBFuzzy.MATCH_YES,thresh) || this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_YES,70);
            if (!userIntent) {
                userIntent = this._ui.intent(userAnswer,PBFuzzy.MATCH_NO,thresh) || this._ui.intent(userAnswer,PBFuzzy.MATCH_QUIT,thresh);
                if (userIntent) {
                   await this._ui.print(
                        "That's okay. I can help you anytime."
                    );
                    resolve(false);
                } else {
                   await this._ui.print(
                        "Sorry, I didn't understand that."
                    );
                    if (!(await this._userWantsToOrder())) {
                        resolve(false);
                    }
                }
            }
            resolve(true);
        });
    }

    private async _getUser (): Promise<PBUser | null> {
        return new Promise<PBUser | null>(async resolve => {
            let thresh = 80;
            let userAnswer = (await this._ui.input(
                "May I ask, what is your name?"
            ));
//            if (this._ui.intent(userAnswer,PBFuzzy.MATCH_QUIT),80) resolve(null);
            //this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_MYNAME);
            //console.log(this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_MYNAME));
            while (
                !this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_MYNAME,thresh)
                || (!userAnswer.toLowerCase().startsWith("my name is")
                && userAnswer.trim().toLowerCase() === "my name is"
                && !new RegExp(PBFuzzy.MATCH_MYNAME.join("|")).test(userAnswer))
            ){
                if (this._ui.intent(userAnswer,PBFuzzy.MATCH_NO, thresh)) {
                   await this._ui.print(
                        "Sorry, I need to know your name in order to place your orders.\nIf you would like to cancel ordering, type \"cancel\"."
                    );
                    userAnswer = (await this._ui.input(
                        "May I ask, what is your name?"
                    ));
                } else if (this._ui.intent(userAnswer,PBFuzzy.MATCH_QUIT, thresh)) {
                    resolve(null);
                    break;
                } else {
                   await this._ui.print(
                        "Sorry, I didn't understand that."
                    );
                    userAnswer = (await this._ui.input(
                        "May I ask, what is your name?"
                    ));
                }
                //this._ui.print(
                //    "Sorry, to verify your name you must type \"My name is\" before your name.\nIf you would like to cancel ordering, type \"cancel\"."
                //);
                //if (this._ui.intent(userAnswer,PBFuzzy.MATCH_QUIT), 80) resolve(null);
            };
            // user name pulled from fuzzy test on split
            //let userName = userAnswer.slice(userAnswer.toLowerCase().indexOf("my name is")+10).trim();
            let userName = this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_MYNAME).join(" ");
            //console.log("@@@",userName);
            resolve(new PBUser(userName));
        });
    }

    private _getOrders (user: PBUser) {
        return new Promise<PBOrder[]>(async resolve => {

            let ordersToReturn: PBOrderArray = new PBOrderArray();
            let prevOrdersQuery: PBOrdersViewRecord[] = await this._db.query(`SELECT * FROM OrdersView WHERE userID = ?;`, user.userID);

            if (prevOrdersQuery === []) resolve([]);

            for (let order of prevOrdersQuery) {
                let foundItem: PBMenuItem = {
                    "id": order.itemID,
                    "name": order.itemName,
                    "cost": order.itemCost
                };
                if (!ordersToReturn.hasOrderID(order.orderID)) {
                    let foundOrder = new PBOrder();
                    foundOrder.orderID = order.orderID;
                    foundOrder.userID = order.userID;
                    foundOrder.date = order.orderDate;
                    foundOrder[order.itemType].push(foundItem);
                    ordersToReturn.push(foundOrder);
                } else {
                    try {
                        //@ts-ignore
                        ordersToReturn.getOrder(order.orderID)[order.itemType].push(foundItem);
                    } catch (error) {}
                }
            }
            resolve(ordersToReturn);
        });
    }

    private _fancyTime (date: Date): string {
        let hours = date.getHours();
        let hrs = hours;
        let mins = date.getMinutes();
        hours = (hours % 12) ? (hours % 12) : 12;
        return date.toDateString()+" - "+String(hours)+":"+('0'+String(mins)).slice(-2)+(hrs>=12?'pm':'am');
    }

    // used to see if the user actually said something then else the bot didnt understand
    private _stringIncludesTextFromArray(str: string, textArray: string[], threshold = 50) {
        for (let i=0;i<str.split(" ").length;i++) {
            if (this._ui.intent(str.split(" ").slice(0,i+1).join(" "), textArray,threshold)) return true;
        }
        return false;
    }

    private _getNonFuzzyWords(str: string, fuzzyArray: string[]) {
        let thresh = 80;
        return str.split(" ").filter(v=>{
            let res = false;
            for (let fuzzWord of fuzzyArray) {
                for (let f=0;f<fuzzWord.split(" ").length;f++) {
                    if(this._ui.intent(v,[fuzzWord.split(" ").slice(0,fuzzWord.split(" ").length-f).join(" ")],thresh)) res = true;
                    if(this._ui.intent(v,[fuzzWord.split(" ").slice(f).join(" ")],thresh)) res = true;
                }
            }
            return !res;
        });
    }

    private async _printOrder(orders: PBOrder[], previewOrder=false) {
        for (let i=0; i<orders.length; i++) {
            this._ui.div();
            if (previewOrder) await this._ui.print("Order Preview");
            else await this._ui.print("Order No. "+String(orders[i].orderID));
            await this._ui.print(" "+this._fancyTime(new Date(orders[i].date)));
            this._ui.div("-");
            // PRINT COURSES
            await this._ui.print("Courses:                Cost ($)");
            if(orders[i].main.length>0)await this._ui.print(" Mains:");
            for (let item of orders[i].main) {
                await this._ui.print("   "+item.name+"                        ".slice(item.name.length)+String(item.cost).padStart(5," "));
            }
            if(orders[i].dessert.length>0)await this._ui.print(" Desserts:");
            for (let item of orders[i].dessert) {
                await this._ui.print("   "+item.name+"                        ".slice(item.name.length)+String(item.cost).padStart(5," "));
            }
            if(orders[i].drink.length>0)await this._ui.print(" Drinks:");
            for (let item of orders[i].drink) {
                await this._ui.print("   "+item.name+"                        ".slice(item.name.length)+String(item.cost).padStart(5," "));
            }
            // PRINT TOTAL
            this._ui.div("-");
            await this._ui.print("Total:"+"                "+("$"+String(orders[i].total)).padStart(10," "));
        }
    }
}
export default IBPubBot;
