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
    export const MATCH_YES = ["yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please", "okey dokey"];
    export const MATCH_NO  = ["nah", "no thanks", "nope", "nup", "no", "no way"];
    export const MATCH_QUIT = ["quit","stop","halt","exit","end","cancel"];
    export const MATCH_MYNAME = ["my name is", "my name", "i am called", "i called", "je m'appelle", "i am"];
};

export interface PBMenuItem {
    id: number;
    name: string;
    cost: number;
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
    
    public get total() {
        let total = 0;
        for (let i=0;i<this.main.length;i++)total+=this.main[i].cost;
        for (let i=0;i<this.dessert.length;i++)total+=this.dessert[i].cost;
        for (let i=0;i<this.drink.length;i++)total+=this.drink[i].cost;
        return total;        
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