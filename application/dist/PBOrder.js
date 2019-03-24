"use strict";
// (C) 2018 Oliver Lenehan
Object.defineProperty(exports, "__esModule", { value: true });
const PBMenu = {
    "steak": "Beef Steak",
    "chips": "Hot Chips",
    "fishfingers": "Fish Fingers",
    "batteredfish": "Battered Fish and Chips",
    "schnitzel": "Chicken Schnitzel",
    "water": "Bottle of Water",
    "lemonade": "Lemonade",
    "cocacola": "Coca Cola",
    "orangejuice": "Orange Juice",
    "applejuice": "Apple Juice",
    "icecream": "Bowl of Ice Cream",
    "milkshake": "Milkshake",
    "stickydate": "Sticky Date Pudding",
    "fruitsaladicecream": "Fruit Salad Ice Cream"
};
class PBOrder {
    constructor() {
        this.menuItems = [];
    }
    _addItem(itemType) {
        let item = {
            "itemName": "",
            "itemType": itemType
        };
        this.menuItems.push(item);
    }
    addMain() { }
    addDessert() { }
    addDrink() { }
    _getItems(itemType) {
        let items = [];
        for (let i = 0; i < this.menuItems.length; i++) {
            if (this.menuItems[i].itemType === itemType) {
                items.push(this.menuItems[i]);
            }
        }
        return items;
    }
    getMain() { this._getItems("main"); }
    getDessert() { this._getItems("dessert"); }
    getDrink() { this._getItems("drink"); }
}
PBOrder.PBMenu = PBMenu;
exports.default = PBOrder;
