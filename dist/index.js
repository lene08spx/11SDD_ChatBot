"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IBPubBot_1 = __importDefault(require("./IBPubBot"));
const bot = new IBPubBot_1.default("Murray");
//bot.chat("Hello, I would like to order some drinks.");
bot.events.on("ready", console.log);
bot.events.on("introduce", console.log);
bot.init();
/*
// YAY!!!
let list = ["I am ok", "yes I am","yes","ok"]
let results = FuzzBall.extract("yes I am ok", list);
console.log(results);
// [ 'baconing', 'a mighty bear canoe' ]
*/
