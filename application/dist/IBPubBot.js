"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PBUI_1 = require("./PBUI");
const PBFoundation_1 = require("./PBFoundation");
/*
    BOT CODE
*/
class IBPubBot {
    constructor(name, database) {
        this._hasRun = false;
        this._menuNames = [];
        this.name = name;
        this._db = database;
        this._ui = new PBUI_1.PBUI();
        this._user = null;
        this._menu = null;
        //this._user.name = "{Username problem. Please report this error.}";
    }
    async run() {
        //================================
        // initialise menu list
        //================================
        let menuQuery = await this._db.query("SELECT * FROM MenuView;");
        this._menu = new PBFoundation_1.PBMenu(menuQuery);
        this._menuNames = menuQuery.map(v => { return v.itemName; });
        //================================
        // check if the bot is already running
        //================================
        if (this._hasRun)
            throw "Bot Already Running";
        this._hasRun = true;
        //================================
        // introduce the assistant
        //================================
        await this._ui.print("G'Day!, my name is {0}. Welcome to the Ironbark Pub food ordering service."
            .replace("{0}", this.name));
        //================================
        // get if the user wants to order
        // if not end the session
        //================================
        if (!(await this._userWantsToOrder())) {
            await this._ui.print("Thank You, Have a nice day.");
            await this._ui.sleep(3000);
            return;
        }
        //================================
        // get the user's name
        //================================
        this._user = await this._getUser();
        if (!this._user) {
            await this._ui.print("Thank You, Have a nice day.");
            await this._ui.sleep(3000);
            return;
        }
        // check if has my name is fuzzy
        // then check each word in input.split() against the name is fuzzy
        //================================
        // get previous orders
        //================================
        this._ui.div();
        await this._ui.print("G'Day {0}!"
            .replace("{0}", this._user.prettyName));
        let prevOrders = await this._getOrders(this._user);
        if (!prevOrders.length) {
            await this._ui.print("It appears this is your first time ordering.");
        }
        else {
            await this._ui.print("Here are your previous orders:");
            await this._printOrders(prevOrders);
        }
        //================================
        // get new orders
        //================================
        // stick in while loop
        let orderToMake = new PBFoundation_1.PBOrder();
        let orderName = "";
        let wantedMenu = false;
        this._ui.div();
        await this._ui.print("You will need 3 items for us to serve your order.");
        // ASK FOR ORDERS
        for (;;) {
            this._ui.div();
            //wantedMenu = true;
            if (!wantedMenu) {
                if (await this._userWantsMenu()) {
                    await this._printMenu();
                    wantedMenu = true;
                    continue;
                }
            }
            wantedMenu = true;
            if (orderToMake.size >= 3) {
                // ready to fulfill
                // you now have 3 orders, would you like to order anything else?
                await this._ui.print("You now have " + String(orderToMake.size) + " items ordered.");
                if (await this._getYesNo("Would you like to order anything else?")) {
                    // dont do anything and allow the user to keep ordering
                }
                else {
                    // prepare to confirm order
                    await this._ui.print("Here is your order: ");
                    await this._printOrders([orderToMake], true);
                    if (await this._getYesNo("Would you like to submit your order now?")) {
                        // exit so that order can go to database
                        await this._ui.print("Your order will be ready to collect in " + String(10 + orderToMake.size) + " minutes.");
                        break;
                    }
                }
            }
            if (orderName = await this._getUserOrderName()) {
                wantedMenu = true;
                //console.log(orderName);
                if (orderName === "@!MENU") {
                    //await this._ui.print(
                    //	"Sorry, I didn't understand that."
                    //);
                    await this._printMenu();
                    continue;
                }
                else if (orderName === "@!PREVIEW") {
                    await this._printOrders([orderToMake], true);
                    continue;
                }
                // test to see if it exists
                let likeItems = await this._db.query("SELECT * FROM MenuView WHERE LOWER(itemName) LIKE LOWER(?)", "%" + orderName + "%");
                if (likeItems.length > 1) {
                    //wantedMenu = false;
                    await this._ui.print("Which would you like to order:");
                    for (let i = 0; i < likeItems.length; i++) {
                        await this._ui.print("Number " + String(i + 1) + ". " + likeItems[i].itemName + ", for $" + String(likeItems[i].itemCost));
                    }
                    await this._ui.print("Enter 0 to cancel:");
                    let chosen = 0;
                    let attempts = 2;
                    let userInp = "";
                    while (attempts > 0) {
                        userInp = await this._ui.input("Enter selection number");
                        if ([...Array(likeItems.length + 1).keys()].slice(1).includes(Number(userInp))) {
                            chosen = Number(userInp);
                            break;
                        }
                        if (Number(userInp) === 0) {
                            break;
                        }
                        attempts--;
                    }
                    if (chosen > 0) {
                        // confirm they want that and add
                        chosen--;
                        let wantsToOrder = await this._getYesNo("Would you like to order " + likeItems[chosen].itemName + ", for $" + String(likeItems[chosen].itemCost) + "?");
                        if (wantsToOrder) {
                            await this._ui.print("Added " + likeItems[chosen].itemName + " to your order.\n");
                            orderToMake[likeItems[chosen].itemType].push({
                                id: likeItems[chosen].itemID,
                                name: likeItems[chosen].itemName,
                                cost: likeItems[chosen].itemCost
                            });
                        }
                    }
                    // otherwise redo the order
                }
                else if (likeItems.length === 1) {
                    //wantedMenu = false;
                    // confirm that they want order and add
                    let wantsToOrder = await this._getYesNo("Would you like to order " + likeItems[0].itemName + ", for $" + String(likeItems[0].itemCost) + "?");
                    if (wantsToOrder) {
                        await this._ui.print("Added " + likeItems[0].itemName + " to your order.\n");
                        orderToMake[likeItems[0].itemType].push({
                            id: likeItems[0].itemID,
                            name: likeItems[0].itemName,
                            cost: likeItems[0].itemCost
                        });
                    }
                    // otherwise redo the order
                } /*else if (orderName === "@!NOT") {
                }*/
                else {
                    await this._ui.print("Sorry, it looks like that's not on the menu.");
                }
            }
            else {
                // code runs here if no order choice was specified
            }
            //console.log("@@@ No. OF ORDERS", orderToMake.size);
            if (wantedMenu && orderToMake.size > 0) {
                // fancy magic to change order(s) plural
                this._ui.div();
                await this._ui.print("You have ordered " + String(orderToMake.size) + ((orderToMake.size - 1) ? " items." : " item."));
                //await this._ui.print("Here is your order so far: ");
                //await this._printOrders([orderToMake],true);
            }
            /// tell the user how many items are required in order to serve
            // if more than 3 ask if they would like anything else
            // then confirm 100%
            // then saveorder outside loop
        }
        orderToMake.userID = this._user.userID;
        orderToMake.date = new Date().toISOString();
        await this._saveOrder(orderToMake);
        await this._ui.print("Thank you for ordering. See you round like a ristole.");
        await this._ui.sleep(3000);
    }
    /////////////////////
    // PUB BOT METHODS //
    /////////////////////
    async _userWantsToOrder() {
        return new Promise(async (resolve) => {
            let thresh = 80;
            let userAnswer = await this._ui.input("Would you like to order some food now?");
            userAnswer = userAnswer.toLowerCase();
            let userIntent = this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_YES, thresh) || this._stringIncludesTextFromArray(userAnswer, PBFoundation_1.PBFuzzy.MATCH_YES, 70);
            if (!userIntent) {
                userIntent = this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_NO, thresh) || this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_QUIT, thresh);
                if (userIntent) {
                    await this._ui.print("That's okay. I can help you anytime.");
                    resolve(false);
                }
                else {
                    await this._ui.print("Sorry, I didn't understand that.");
                    if (!(await this._userWantsToOrder())) {
                        resolve(false);
                    }
                }
            }
            resolve(true);
        });
    }
    async _getUser() {
        return new Promise(async (resolve) => {
            let thresh = 80;
            let userAnswer = (await this._ui.input("May I ask, what is your name?"));
            //            if (this._ui.intent(userAnswer,PBFuzzy.MATCH_QUIT),80) resolve(null);
            //this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_MYNAME);
            //console.log(this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_MYNAME));
            while (!this._stringIncludesTextFromArray(userAnswer, PBFoundation_1.PBFuzzy.MATCH_MYNAME, thresh)
                //|| (!userAnswer.toLowerCase().startsWith("my name is")
                || userAnswer.trim().toLowerCase() === "my name is"
                || !new RegExp(PBFoundation_1.PBFuzzy.MATCH_MYNAME.join("|")).test(userAnswer)) {
                if (this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_NO, thresh)) {
                    await this._ui.print("Sorry, I need to know your name in order to place your orders.\nIf you would like to cancel ordering, type \"cancel\".");
                    userAnswer = (await this._ui.input("May I ask, what is your name?"));
                }
                else if (this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_QUIT, thresh)) {
                    resolve(null);
                    return;
                }
                else {
                    // ask if that is there name
                    /*await this._ui.print(
                        "Sorry, I didn't understand that. \n(To verify your name, type \"My name is\" before your name)"
                    );*/
                    let tempAns = userAnswer;
                    if (tempAns.replace(/[^A-Za-z]+/g, '') === "") {
                        await this._ui.print("Sorry, I didn't understand that.");
                        userAnswer = (await this._ui.input("May I ask, what is your name?"));
                    }
                    else {
                        break;
                    }
                    /*
                    let userValidated = (await this._getYesNo(
                        "Is "+new PBUser(tempAns).prettyName+" your name?"
                    ));
                    if (userValidated) break;
                    else {
                        userAnswer = (await this._ui.input(
                            "May I ask, what is your name?"
                        ));
                    }*/
                }
                //this._ui.print(
                //    "Sorry, to verify your name you must type \"My name is\" before your name.\nIf you would like to cancel ordering, type \"cancel\"."
                //);
                //if (this._ui.intent(userAnswer,PBFuzzy.MATCH_QUIT), 80) resolve(null);
            }
            ;
            // user name pulled from fuzzy test on split
            //let userName = userAnswer.slice(userAnswer.toLowerCase().indexOf("my name is")+10).trim();
            //console.log(userAnswer);
            let userName = this._getNonFuzzyWords(userAnswer, PBFoundation_1.PBFuzzy.MATCH_MYNAME).join(" ");
            if (userName.length === 0) {
                //console.log("%%%%%");
                if (this._getUser() === null)
                    resolve(null);
            }
            let userValidated = (await this._getYesNo("So, your name is \"" + new PBFoundation_1.PBUser(userName).prettyName + "\"?"));
            if (!userValidated) {
                resolve(this._getUser());
            }
            //console.log("@@@",userName);
            resolve(new PBFoundation_1.PBUser(userName));
        });
    }
    _getOrders(user) {
        return new Promise(async (resolve) => {
            let ordersToReturn = new PBFoundation_1.PBOrderArray();
            let prevOrdersQuery = await this._db.query(`SELECT * FROM OrdersView WHERE userID = ?;`, user.userID);
            if (prevOrdersQuery === [])
                resolve([]);
            for (let order of prevOrdersQuery) {
                let foundItem = {
                    "id": order.itemID,
                    "name": order.itemName,
                    "cost": order.itemCost
                };
                if (!ordersToReturn.hasOrderID(order.orderID)) {
                    let foundOrder = new PBFoundation_1.PBOrder();
                    foundOrder.orderID = order.orderID;
                    foundOrder.userID = order.userID;
                    foundOrder.date = order.orderDate;
                    foundOrder[order.itemType].push(foundItem);
                    ordersToReturn.push(foundOrder);
                }
                else {
                    try {
                        //@ts-ignore
                        ordersToReturn.getOrder(order.orderID)[order.itemType].push(foundItem);
                    }
                    catch (error) { }
                }
            }
            resolve(ordersToReturn);
        });
    }
    _fancyTime(date) {
        let hours = date.getHours();
        let hrs = hours;
        let mins = date.getMinutes();
        hours = (hours % 12) ? (hours % 12) : 12;
        return date.toDateString() + " - " + String(hours) + ":" + ('0' + String(mins)).slice(-2) + (hrs >= 12 ? 'pm' : 'am');
    }
    // used to see if the user actually said something then else the bot didnt understand
    _stringIncludesTextFromArray(str, textArray, threshold = 50) {
        for (let i = 0; i < str.split(" ").length; i++) {
            if (this._ui.intent(str.split(" ").slice(0, i + 1).join(" "), textArray, threshold)) {
                return true;
            }
            ;
        }
        return false;
    }
    _getNonFuzzyWords(str, fuzzyArray, threshold = 80) {
        //let thresh = threshold;
        return str.split(" ").filter(v => {
            let res = false;
            for (let fuzzWord of fuzzyArray) {
                for (let f = 0; f < fuzzWord.split(" ").length; f++) {
                    if (this._ui.intent(v, [fuzzWord.split(" ").slice(0, fuzzWord.split(" ").length - f).join(" ")], threshold))
                        res = true;
                    if (this._ui.intent(v, [fuzzWord.split(" ").slice(f).join(" ")], threshold))
                        res = true;
                }
            }
            return !res;
        });
    }
    async _printOrders(orders, previewOrder = false) {
        for (let i = 0; i < orders.length; i++) {
            this._ui.div();
            if (previewOrder)
                await this._ui.print("Order Review");
            else
                await this._ui.print("Order No. " + String(orders[i].orderID));
            if (!previewOrder)
                await this._ui.print(" " + this._fancyTime(new Date(orders[i].date)));
            //else await this._ui.print(" "+this._fancyTime(new Date(orders[i].date)));
            if (this._ui.ttsEnabled)
                await this._ui.sleep(1500);
            this._ui.div("-");
            // PRINT COURSES
            await this._ui.print("Courses:                Cost ($)");
            if (orders[i].main.length > 0)
                await this._ui.print(" Mains:");
            for (let item of orders[i].main) {
                await this._ui.print("   " + item.name + "                        ".slice(item.name.length) + ("$" + String(item.cost)).padStart(5, " "));
            }
            if (orders[i].dessert.length > 0)
                await this._ui.print(" Desserts:");
            for (let item of orders[i].dessert) {
                await this._ui.print("   " + item.name + "                        ".slice(item.name.length) + ("$" + String(item.cost)).padStart(5, " "));
            }
            if (orders[i].drink.length > 0)
                await this._ui.print(" Drinks:");
            for (let item of orders[i].drink) {
                await this._ui.print("   " + item.name + "                        ".slice(item.name.length) + ("$" + String(item.cost)).padStart(5, " "));
            }
            // PRINT TOTAL
            this._ui.div("-");
            await this._ui.print("Total:" + "                " + ("$" + String(orders[i].total)).padStart(10, " "));
        }
    }
    async _printMenu() {
        if (!this._menu)
            return;
        this._ui.div();
        await this._ui.print("Here is the menu: Costs in $AUD");
        this._ui.div("-");
        if (this._menu.main.length > 0)
            await this._ui.print("Mains:");
        for (let item of this._menu.main) {
            await this._ui.print("   " + item.name + "                        ".slice(item.name.length) + ("$" + String(item.cost)).padStart(5, " "));
        }
        if (this._menu.main.length > 0)
            await this._ui.print("Drinks:");
        for (let item of this._menu.drink) {
            await this._ui.print("   " + item.name + "                        ".slice(item.name.length) + ("$" + String(item.cost)).padStart(5, " "));
        }
        if (this._menu.main.length > 0)
            await this._ui.print("Desserts:");
        for (let item of this._menu.dessert) {
            await this._ui.print("   " + item.name + "                        ".slice(item.name.length) + ("$" + String(item.cost)).padStart(5, " "));
        }
    }
    _userWantsMenu() {
        return new Promise(async (resolve) => {
            let thresh = 80;
            let userAnswer = (await this._ui.input("Would you like to see the menu?"));
            let userIntent = (this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_YES, thresh)
                || this._stringIncludesTextFromArray(userAnswer, PBFoundation_1.PBFuzzy.MATCH_YES, 70)
                || this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_MENU, thresh));
            if (!userIntent) {
                userIntent = this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_NO, thresh);
                if (userIntent) {
                    resolve(false);
                }
                else {
                    await this._ui.print("Sorry, I didn't understand that.\n");
                    if (!(await this._userWantsMenu())) {
                        resolve(false);
                    }
                }
            }
            resolve(true);
        });
    }
    async _getUserOrderName() {
        return new Promise(async (resolve) => {
            // CODE FOR JUST THE FOOD NAME AND EXCLUDE PREFIX
            let thresh = 70;
            let userAnswer = (await this._ui.input("Enter the name of the item you want to order. Enter \"menu\" to see the menu. Enter \"review\" to review your order.\n"));
            if (this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_MENU, thresh)) {
                resolve("@!MENU");
            }
            else if (this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_PREVIEW, thresh)) {
                resolve("@!PREVIEW");
            }
            else if (!this._stringIncludesTextFromArray(userAnswer, PBFoundation_1.PBFuzzy.MATCH_ORDER, 50)) {
                resolve(userAnswer);
            }
            else {
                let userOrderName = this._getNonFuzzyWords(userAnswer, PBFoundation_1.PBFuzzy.MATCH_ORDER).join(" ").toLowerCase();
                if (userOrderName === "" && userAnswer === "") {
                    // nothing
                    resolve("");
                }
                else if (userOrderName === "") {
                    resolve("@!PREVIEW");
                }
                else {
                    resolve(userOrderName);
                }
            }
            /*
            // CODE IF ORDER PREFIX REQUIRED
            let thresh = 70;
            let attempts = 1;
            let userAnswer = (await this._ui.input(
                "What item you like to order?"
            ));
            //this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_MYNAME);
            //console.log(this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_MYNAME));
            while (
                !this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_ORDER,50)&&
                 !new RegExp(PBFuzzy.MATCH_ORDER.join("|")).test(userAnswer)&&
                 (attempts > 0)
            ){
                // if ask menu then return empty string
                if (this._ui.intent(userAnswer,PBFuzzy.MATCH_MENU,thresh)) {
                    resolve("@!MENU");
                    break;
                } else if (this._ui.intent(userAnswer,PBFuzzy.MATCH_ORDER,thresh)) {
                    break;
                } else {
                    await this._ui.print(
                        "Sorry, I didn't understand that. (Try using full sentences and correct spelling)\n"
                    );
                    attempts--;
                    userAnswer = (await this._ui.input(
                        "What would you like to order?"
                    ));
                }
            }
            //console.log(this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_ORDER).join(" ").toLowerCase());
            if (attempts === 0 && !this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_ORDER).length) {
                await this._ui.print("Sorry, I didn't understand that. (Try using full sentences and correct spelling.)\n");
                resolve("@!NOT");
            }
            if (attempts === 0 && (!this._stringIncludesTextFromArray(userAnswer,PBFuzzy.MATCH_ORDER,50) || !new RegExp(PBFuzzy.MATCH_ORDER.join("|")).test(userAnswer))) {
                await this._ui.print("Sorry, I didn't understand that. (Try using full sentences and correct spelling.)\n");
                resolve("@!NOT");
            }

            // user name pulled from fuzzy test on split
            //////NOT IN USE//let userName = userAnswer.slice(userAnswer.toLowerCase().indexOf("my name is")+10).trim();
            let userOrderName = this._getNonFuzzyWords(userAnswer,PBFuzzy.MATCH_ORDER).join(" ").toLowerCase();
            //console.log("@@@",userName);
            resolve(userOrderName);*/
        });
    }
    _getYesNo(question, threshold = 60) {
        return new Promise(async (resolve) => {
            let tries = 2;
            let userAnswer = "";
            let userIntent = false;
            while (tries > 0) {
                userAnswer = await this._ui.input(question);
                userIntent = this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_YES, threshold) || this._stringIncludesTextFromArray(userAnswer, PBFoundation_1.PBFuzzy.MATCH_YES, 70);
                if (!userIntent) {
                    userIntent = this._ui.intent(userAnswer, PBFoundation_1.PBFuzzy.MATCH_NO, threshold);
                    if (userIntent) {
                        resolve(false);
                        break;
                    }
                    else {
                        await this._ui.print("Sorry, I didn't understand that.");
                        tries--;
                    }
                }
                else {
                    resolve(true);
                    break;
                }
            }
            resolve(false);
        });
    }
    _getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
    async _saveOrder(order) {
        await this._db.query("INSERT INTO Orders (userID, orderDate) VALUES (?, ?)", order.userID, order.date);
        let lastOrderID = (await this._db.query("SELECT last_insert_rowid() AS last_rowid;"))[0]["last_rowid"];
        for (let i = 0; i < order.main.length; i++) {
            await this._db.query("INSERT INTO OrderItems (itemID, orderID) VALUES (?, ?)", order.main[i].id, lastOrderID);
        }
        for (let i = 0; i < order.dessert.length; i++) {
            await this._db.query("INSERT INTO OrderItems (itemID, orderID) VALUES (?, ?)", order.dessert[i].id, lastOrderID);
        }
        for (let i = 0; i < order.drink.length; i++) {
            await this._db.query("INSERT INTO OrderItems (itemID, orderID) VALUES (?, ?)", order.drink[i].id, lastOrderID);
        }
    }
}
exports.IBPubBot = IBPubBot;
exports.default = IBPubBot;
