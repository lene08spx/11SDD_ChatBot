// (C) 2018 Oliver Lenehan

type PBItemType = "main" | "dessert" | "drink";

export class PBUser {

    public readonly userID:     string;
    public readonly prettyName: string;

    constructor ( name: string ) {
        this.prettyName = name.split(/ +/g).map(value => {return value[0].toUpperCase()+value.slice(1).toLowerCase()}).join(" ").trim();
        this.userID = this.prettyName.toLowerCase().replace(/ +/g, "_");
    }
};

export namespace PBFuzzy {
    export const MATCH_YES = ["y","yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please", "okey dokey","okay","ok"];
    export const MATCH_NO  = ["n","nah", "no thanks", "nope", "nup", "no", "no way"];
    export const MATCH_QUIT = ["quit","stop","halt","exit","cancel"];
    export const MATCH_MYNAME = ["my name is", "my name", "i am called", "i called", "i am", "je m'appelle", "Mi nombre", "Mi nombre es", "soy", "me nombre", "me"];
    export const MATCH_MENU = ["menu","list","give menu","see menu","have menu","see the menu"];
    export const MATCH_ORDER = ["order","i want","i want to order","please can i have","may i have","i would like","i would like to order","like to order","to order","order a","i'd like to order","have you got","please"];
    export const MATCH_PREVIEW = ["preview","show","cart","view","view cart","review"]
};

export interface PBMenuItem {
    id: number;
    name: string;
    cost: number;
};
export interface PBMenuViewRecord {
    itemID: number;
    itemName: string;
    itemCost: number;
    itemType: PBItemType;
}
export class PBMenu {

    public main: PBMenuItem[] = [];
    public dessert: PBMenuItem[] = [];
    public drink: PBMenuItem[] = [];

    constructor (menuViewRecords: PBMenuViewRecord[]) {
        for (let menuItem of menuViewRecords) {
            this[menuItem.itemType].push({id:menuItem.itemID,name:menuItem.itemName,cost:menuItem.itemCost});
        }
        let t: PBItemType[] = ["main","dessert","drink"];
        for (let x of t) {
            this[x].sort(function(a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
    }

};

export interface PBOrdersViewRecord {
    orderID: number;
    orderDate: string;
    userID: string;
    itemID: number;
    itemName: string;
    itemCost: number;
    itemType: PBItemType;
};
export class PBOrder {

    public orderID: number = 0;
    public userID: string = "";
    public date: string = "";
    public main: PBMenuItem[] = [];
    public dessert: PBMenuItem[] = [];
    public drink: PBMenuItem[] = [];
    
    public sort() {
        let t: PBItemType[] = ["main","dessert","drink"];
        for (let x of t) {
            this[x].sort(function(a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        }
    }

    public get total() {
        let total = 0;
        for (let i=0;i<this.main.length;i++)total+=this.main[i].cost;
        for (let i=0;i<this.dessert.length;i++)total+=this.dessert[i].cost;
        for (let i=0;i<this.drink.length;i++)total+=this.drink[i].cost;
        return total;        
    }

    public get size() {
        return this.main.length+this.dessert.length+this.drink.length;
    }

    public hasItemAlready(menuItem: PBMenuItem) {
        return (this.main.map(v=>v.id).includes(menuItem.id) || this.dessert.map(v=>v.id).includes(menuItem.id) || this.drink.map(v=>v.id).includes(menuItem.id));
    }
};
export class PBOrderArray extends Array<PBOrder> {
    public hasOrderID(orderID: number): boolean {
        return this.map(v=>v.orderID).includes(orderID);
    }
    public getOrder(orderID: number): PBOrder | undefined {
        return this.find(function(v){return v.orderID === orderID});
    }
}
