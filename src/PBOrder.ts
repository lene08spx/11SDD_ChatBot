// (C) 2018 Oliver Lenehan

type PBItemType = "main" | "dessert" | "drink";

const PBMenu: {[key: string]: string} = {
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
    itemName: string;
    itemType: PBItemType;
}

export default PBOrder;
