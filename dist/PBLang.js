"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
const PBLanguage = {
    "au": {
        "speech": {
            "intro": "G'Day!, my name is {0}. Welcome to the Ironbark Pub food ordering service.",
            "useMyNameTTS": "Sorry, to verify your name you must say \"{0}\" before your name.",
            "useMyNameText": "Sorry, to verify your name you must type \"{0}\" before your name.",
            "notUnderstood": "Sorry, I didn't understand that.",
            "noOrder": "That's okay. I can help you anytime.",
            "goodbye": "Thank You, Have a nice day.",
            "orderIntent": "Would you like to order some food now?",
            "askName": "May I ask what is your name?",
            "thankyou": "Thank you",
            "helloUser": "G'Day {0}!",
            "findingOrders": "Just gonna look up previous orders for ya! Won't be a second.",
            "firstOrder": "It appears this is your first time ordering, {0}",
            "ordersFound": "G'Day {0}. Here are you previous orders:"
        },
        "fuzzy": {
            "yes": ["yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please"],
            "no": ["nah", "no thanks", "nope", "nup", "no", "no way"],
        },
        "words": {
            "myName": "My name is",
            "steak": "steak"
        }
    }
};
exports.default = PBLanguage;
