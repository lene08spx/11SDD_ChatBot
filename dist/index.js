"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IBPubBot_1 = __importDefault(require("./IBPubBot"));
new IBPubBot_1.default("Murray", "console", "au").run();
// const bot = new IBPubBot("Murray", *window, ?*tts, ?*speechrecog)
//const botWindow = new IBPubBotInterface.Console();
//
//bot.chat("Hello, I would like to order some drinks.");
/*
// YAY!!!
let list = ["I am ok", "yes I am","yes","ok"]
let results = FuzzBall.extract("yes I am ok", list);
console.log(results);
// [ 'baconing', 'a mighty bear canoe' ]
*/
/*
function getInput(question: string): Promise<string> {
    return new Promise<string>( resolve => {
        let rl = Readline.createInterface(process.stdin, process.stdout);
        rl.setPrompt(question);
        rl.prompt();
        rl.on("line", userInput => {
            console.log("IP:",userInput);
            rl.close();
            resolve(userInput);
        });
    })
}*/ 
