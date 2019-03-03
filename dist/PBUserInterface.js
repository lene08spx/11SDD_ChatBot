"use strict";
//@ts-check
//
// UserInterface CODE
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const fuzzball_1 = __importDefault(require("fuzzball"));
class PBUserInterface {
    constructor(type, enableTTS = false) {
        if (type === "console") {
            this.input = this._con_input;
            this.print = this._con_print;
            this.intent = this._con_intent;
        }
        this.ttsEnabled = enableTTS;
    }
    _con_input(question) {
        return new Promise(resolve => {
            let rl = readline_1.default.createInterface(process.stdin, process.stdout);
            rl.setPrompt(question + " : ");
            rl.prompt();
            rl.on("line", userInput => {
                //console.log("IP:",userInput);
                rl.close();
                resolve(userInput.trim());
            });
            rl.on("end", userInput => {
                rl.close();
                resolve("");
            });
        });
    }
    _con_print(message) {
        return new Promise(resolve => {
            console.log(message);
            resolve();
        });
    }
    _con_intent(phrase, answers, threshold = 50) {
        return new Promise(resolve => {
            let fuz = fuzzball_1.default.extract(phrase, answers);
            if (fuz[0]) {
                if (fuz[0][1] >= threshold)
                    resolve(true);
                else
                    resolve(false);
            }
        });
    }
}
exports.PBUserInterface = PBUserInterface;
exports.default = PBUserInterface;
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
