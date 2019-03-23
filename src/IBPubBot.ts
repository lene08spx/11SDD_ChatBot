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
        if (this._user === undefined) {
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
        this._ui.print(
            "G'Day {0}!"
            .replace("{0}",this._user.prettyName)
        );
        let prevOrders = await this._getOrders(this._user);
        if (!prevOrders.length) {
            this._ui.print(
                "It appears this is your first time ordering."
            );
        } else {
            this._ui.print(
                "Here are you previous orders:"
            );
            for (let i=0; i<prevOrders.length; i++) {
                this._ui.div();
                this._ui.print("Order No. "+String(prevOrders[i].orderID));
                this._ui.print(" "+this._fancyTime(new Date(prevOrders[i].date)));

                this._ui.print("Courses:                Cost ($)");
                this._ui.print(" Mains:");
                for (let item of prevOrders[i].main) {
                    this._ui.print("   "+item.name+"                        ".slice(item.name.length)+String(item.cost).padStart(5," "));
                }
                this._ui.print(" Desserts:");
                for (let item of prevOrders[i].dessert) {
                    this._ui.print("   "+item.name+"                        ".slice(item.name.length)+String(item.cost).padStart(5," "));
                }
                this._ui.print(" Drinks:");
                for (let item of prevOrders[i].drink) {
                    this._ui.print("   "+item.name+"                        ".slice(item.name.length)+String(item.cost).padStart(5," "));
                }
                this._ui.print("Total: $"+String(prevOrders[i].total));
                this._ui.print("");
            }
        }

        //================================
        // get new orders
        //================================
        this._ui.div();

    }

    private _userWantsToOrder (): Promise<boolean> {
        return new Promise(async resolve => {
            let userAnswer = await this._ui.input(
                "Would you like to order some food now?"
            );
            let userIntent = this._ui.intent(userAnswer,PBFuzzy.MATCH_YES);
            if (!userIntent) {
                userIntent = this._ui.intent(userAnswer,PBFuzzy.MATCH_NO);
                if (userIntent) {
                    this._ui.print(
                        "That's okay. I can help you anytime."
                    );
                    resolve(false);
                } else {
                    this._ui.print(
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

    private _getUser (): Promise<PBUser> | undefined {
        try{
        return new Promise(async resolve => {
            let breakout = false;
            let userAnswer = await this._ui.input(
                "May I ask what is your name?"
            );
            //this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_MYNAME);
            //console.log(this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_MYNAME));
            while (
                !userAnswer.toLowerCase().startsWith("my name is")
                || userAnswer.trim().toLowerCase() === "my name is"
                || !new RegExp(PBFuzzy.MATCH_MYNAME.join("|")).test(userAnswer)
                || !this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_MYNAME)
            ){
                if (this._ui.intent(userAnswer,PBFuzzy.MATCH_NO)) {
                    this._ui.print(
                        "Sorry, I need to know your name in order to place your orders.\nIf you would like to cancel ordering, type \"cancel\"."
                    );
                } else if (this._ui.intent(userAnswer,PBFuzzy.MATCH_QUIT)) {
                    throw "quit_plz";
                } else {
                    this._ui.print(
                        "Sorry, I didn't understand that."
                    );
                }
                //this._ui.print(
                //    "Sorry, to verify your name you must type \"My name is\" before your name.\nIf you would like to cancel ordering, type \"cancel\"."
                //);
                userAnswer = await this._ui.input(
                    "May I ask what is your name?"
                );
            };
            // user name pulled from fuzzy test on split
            //let userName = userAnswer.slice(userAnswer.toLowerCase().indexOf("my name is")+10).trim();
            let userName = this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_MYNAME).join(" ");
            resolve(new PBUser(userName));
        });
        }catch(err){if(err==="quit_plz")return undefined};
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
    private _stringIncludesTextFromArray(str: string, textArray: string[]) {
        for (let i=0;i<str.split(" ").length;i++) {
            if (this._ui.intent(str.split(" ").slice(0,i+1).join(" "), textArray)) return true;
        }
        return false;
    }

    private _getNonFuzzyWords(str: string, fuzzyArray: string[]) {
        return str.split(" ").filter(v=>{
            let res = false;
            for (let fuzzWord of fuzzyArray) {
                for (let f=0;f<fuzzWord.split(" ").length;f++) {
                    if(this._ui.intent(v,[fuzzWord.split(" ").slice(0,fuzzWord.split(" ").length-f).join(" ")],80)) res = true;
                    if(this._ui.intent(v,[fuzzWord.split(" ").slice(f).join(" ")],80)) res = true;
                }
            }
            return !res;
        });
    }
}
export default IBPubBot;
