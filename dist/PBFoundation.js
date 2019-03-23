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
    PBFuzzy.MATCH_YES = ["y", "yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please", "okey dokey"];
    PBFuzzy.MATCH_NO = ["n", "nah", "no thanks", "nope", "nup", "no", "no way"];
    PBFuzzy.MATCH_QUIT = ["quit", "stop", "halt", "exit", "cancel"];
    PBFuzzy.MATCH_MYNAME = ["my name is", "my name", "i am called", "i called", "i am", "je m'appelle", "Mi nombre", "Mi nombre es", "soy"];
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
