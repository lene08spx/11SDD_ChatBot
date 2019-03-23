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
    PBFuzzy.MATCH_YES = ["yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please", "okey dokey"];
    PBFuzzy.MATCH_NO = ["nah", "no thanks", "nope", "nup", "no", "no way"];
    PBFuzzy.MATCH_QUIT = ["quit", "stop", "halt", "exit", "end", "cancel"];
    PBFuzzy.MATCH_MYNAME = ["my name is", "my name", "i am called", "i called", "je m'appelle", "i am"];
})(PBFuzzy = exports.PBFuzzy || (exports.PBFuzzy = {}));
;
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
/*
class PBOrder {

    public menuItems: menuItem[] = [];
    public static PBMenu = PBMenu;

    private _addItem(itemType: PBItemType) {
        let item: menuItem = {
            "itemName": "",
            "itemType": itemType
        }
        this.menuItems.push(item);
    }
    public addMain() {}
    public addDessert() {}
    public addDrink() {}

    private _getItems(itemType: PBItemType) {
        let items: menuItem[] = [];
        for (let i=0; i<this.menuItems.length; i++) {
            if (this.menuItems[i].itemType === itemType) {
                items.push(this.menuItems[i]);
            }
        }
        return items;
    }
    public getMain() { this._getItems("main"); }
    public getDessert() { this._getItems("dessert"); }
    public getDrink() { this._getItems("drink"); }
}

interface menuItem {
    itemId: string;
}

export default PBOrder;
*/ 
