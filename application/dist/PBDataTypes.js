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
var PBFuzzy;
(function (PBFuzzy) {
    PBFuzzy.MATCH_YES = ["yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please", "okey dokey"];
    PBFuzzy.MATCH_NO = ["nah", "no thanks", "nope", "nup", "no", "no way"];
})(PBFuzzy = exports.PBFuzzy || (exports.PBFuzzy = {}));
;
class PBOrder {
    constructor() {
        this.userId = "";
        this.date = "";
        this.mains = [];
        this.desserts = [];
        this.drinks = [];
    }
    get total() {
        let total = 0;
        for (let i = 0; i < this.mains.length; i++)
            total += this.mains[i].cost;
        for (let i = 0; i < this.desserts.length; i++)
            total += this.desserts[i].cost;
        for (let i = 0; i < this.drinks.length; i++)
            total += this.drinks[i].cost;
        return total;
    }
}
exports.PBOrder = PBOrder;
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
