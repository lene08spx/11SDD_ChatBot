"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// (C) 2018 Oliver Lenehan
var PBFuzzy;
(function (PBFuzzy) {
    PBFuzzy.YES = ["yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please"];
    PBFuzzy.NO = ["nah", "no thanks", "nope", "nup", "no", "no way"];
})(PBFuzzy || (PBFuzzy = {}));
;
exports.default = PBFuzzy;
const PBLanguage = {
    "au": {
        "speech": {
            //"intro": "G'Day!, my name is {0}. Welcome to the Ironbark Pub food ordering service.",
            //"useMyNameTTS": "Sorry, to verify your name you must say \"{0}\" before your name.",
            //"useMyNameText": "Sorry, to verify your name you must type \"{0}\" before your name.",
            //"notUnderstood": "Sorry, I didn't understand that.",
            //"noOrder": "That's okay. I can help you anytime.",
            //"goodbye": "Thank You, Have a nice day.",
            //"orderIntent": "Would you like to order some food now?",
            //"askName": "May I ask what is your name?",
            "thankyou": "Thank you",
            //"helloUser": "G'Day {0}!",
            "findingOrders": "Just gonna look up previous orders for ya! Won't be a second.",
        },
        "words": {
            "myName": "My name is",
            "steak": "steak",
            "chips": "Chips",
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
        }
    }
};
