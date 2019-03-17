// @ts-check
import PBDatabase       from "./PBDatabase";
import PBFuzzy          from "./PBFuzzy";
import PBUserInterface  from "./PBUserInterface";
import PBUser           from "./PBUser";
import PBOrder          from "./PBOrder";

/*
    BOT CODE
*/

export class IBPubBot {

    public readonly name: string;
    private _db: PBDatabase;
    private _hasRun: boolean = false;
    private _ui: PBUserInterface;
    private _user: PBUser | null;

    constructor ( name: string, database: PBDatabase ) {
        this.name = name;
        this._db = database;
        this._ui = new PBUserInterface();
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

        //================================
        // get previous orders
        //================================
        this._ui.div();
        this._ui.print(
            "G'Day {0}!"
            .replace("{0}",this._user.prettyName)
        );
        let prevOrders = await this._getPreviousOrders(this._user.userID);
        if (!prevOrders.length) {
            this._ui.print(
                "It appears this is your first time ordering."
            );
        } else {
            this._ui.print(
                "Here are you previous orders:"
            );
            for (let i=0; i<prevOrders.length; i++) {
                let b = prevOrders[i].date.split(/\D+/).map(v=>{return Number(v)});
                let orderDate = new Date(Date.UTC(b[0],--b[1],b[2],b[3],b[4],b[5],b[6]))
                this._ui.div();
                this._ui.print("Order No. "+String(i));
                this._ui.print(" "+orderDate.toDateString()+" - "+this._timeAMPM(orderDate));
                if (prevOrders[i].main) {
                    this._ui.print(" Mains:                     Cost");
                    for (let item of prevOrders[i].main) {
                        this._ui.print("   "+PBOrder.PBMenu[item[0]]+"                           ".slice(PBOrder.PBMenu[item[0]].length)+String(item[1]));
                    }
                }
                if (prevOrders[i].desert) {
                    this._ui.print(" Desserts:                  Cost");
                    for (let item of prevOrders[i].desert) {
                        this._ui.print("   "+PBOrder.PBMenu[item[0]]+"                           ".slice(PBOrder.PBMenu[item[0]].length)+String(item[1]));
                    }
                }
                if (prevOrders[i].drink) {
                    this._ui.print(" Drinks:                    Cost");
                    for (let item of prevOrders[i].drink) {
                        this._ui.print("   "+PBOrder.PBMenu[item[0]]+"                           ".slice(PBOrder.PBMenu[item[0]].length)+String(item[1]));
                    }
                }
                this._ui.print(" Total: $"+String(prevOrders[i].total));
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
            let userIntent = await this._ui.intent(userAnswer,PBFuzzy.YES);
            if (!userIntent) {
                userIntent = await this._ui.intent(userAnswer,PBFuzzy.NO);
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

    private _getUser (): Promise<PBUser> {
        return new Promise(async resolve => {
            let userAnswer = await this._ui.input(
                "May I ask what is your name?"
            );
            while (
                !userAnswer.toLowerCase().startsWith("my name is")
                || userAnswer.trim().toLowerCase() === "my name is"
            ){
                if (this._ui.ttsEnabled) {
                    this._ui.print(
                        "Sorry, to verify your name you must say \"My name is\" before your name."
                    );
                } else {
                    this._ui.print(
                        "Sorry, to verify your name you must type \"My name is\" before your name."
                    );
                }
                userAnswer = await this._ui.input(
                    "May I ask what is your name?"
                );
            };
            let userName = userAnswer.slice(userAnswer.toLowerCase().indexOf("my name is")+10).trim();
            resolve(new PBUser(userName));
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
            SELECT Users.userId, UserOrders.orderId, Menu.itemType, Menu.itemId, Menu.itemCost, UserOrders.orderDate
            FROM Users, UserOrders, Orders, Menu
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

    private _timeAMPM (date: Date): string {
        let hours = date.getHours();
        let mins = date.getMinutes();
        hours = hours % 12;
        hours = hours ? hours : 12;
        return String(hours)+":"+('0'+String(mins)).slice(-2)+(hours>=12?'pm':'am');
    }

}
export default IBPubBot;
