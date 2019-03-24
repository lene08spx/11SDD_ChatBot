"use strict";
// (C) 2018 Oliver Lenehan
Object.defineProperty(exports, "__esModule", { value: true });
class PBUser {
    constructor(name) {
        this.prettyName = name.split(/ +/g).map(value => { return value[0].toUpperCase() + value.slice(1).toLowerCase(); }).join(" ").trim();
        this.userID = this.prettyName.toLowerCase().replace(/ +/g, "_");
    }
}
exports.PBUser = PBUser;
;
var PBFuzzy;
(function (PBFuzzy) {
    PBFuzzy.MATCH_YES = ["y", "yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please", "okey dokey", "okay", "ok"];
    PBFuzzy.MATCH_NO = ["n", "nah", "no thanks", "nope", "nup", "no", "no way"];
    PBFuzzy.MATCH_QUIT = ["quit", "stop", "halt", "exit", "cancel"];
    PBFuzzy.MATCH_MYNAME = ["my name is", "my name", "i am called", "i called", "i am", "je m'appelle", "Mi nombre", "Mi nombre es", "soy", "me nombre", "me"];
    PBFuzzy.MATCH_MENU = ["menu", "list", "give menu", "see menu", "have menu", "see the menu"];
    PBFuzzy.MATCH_ORDER = ["order", "i want", "i want to order", "please can i have", "may i have", "i would like", "i would like to order", "like to order", "to order", "order a", "i'd like to order", "have you got", "please"];
    PBFuzzy.MATCH_PREVIEW = ["preview", "show", "cart", "view", "view cart", "review"];
})(PBFuzzy = exports.PBFuzzy || (exports.PBFuzzy = {}));
;
;
class PBMenu {
    constructor(menuViewRecords) {
        this.main = [];
        this.dessert = [];
        this.drink = [];
        for (let menuItem of menuViewRecords) {
            this[menuItem.itemType].push({ id: menuItem.itemID, name: menuItem.itemName, cost: menuItem.itemCost });
        }
        let t = ["main", "dessert", "drink"];
        for (let x of t) {
            this[x].sort(function (a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
    }
}
exports.PBMenu = PBMenu;
;
;
class PBOrder {
    constructor() {
        this.orderID = 0;
        this.userID = "";
        this.date = "";
        this.main = [];
        this.dessert = [];
        this.drink = [];
    }
    get total() {
        let total = 0;
        for (let i = 0; i < this.main.length; i++)
            total += this.main[i].cost;
        for (let i = 0; i < this.dessert.length; i++)
            total += this.dessert[i].cost;
        for (let i = 0; i < this.drink.length; i++)
            total += this.drink[i].cost;
        return total;
    }
    get size() {
        return this.main.length + this.dessert.length + this.drink.length;
    }
}
exports.PBOrder = PBOrder;
;
class PBOrderArray extends Array {
    hasOrderID(orderID) {
        return this.map(v => v.orderID).includes(orderID);
    }
    getOrder(orderID) {
        return this.find(function (v) { return v.orderID === orderID; });
    }
}
exports.PBOrderArray = PBOrderArray;
