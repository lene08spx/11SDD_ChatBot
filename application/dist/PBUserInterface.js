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
    constructor() {
        this.ttsEnabled = false;
        this._pinnedMessages = [];
        /*
        public pin(message: string): Promise<void> {
            return new Promise<void>( resolve => {
                console.log("PINNED",message);
                resolve();
            });
        }*/
    }
    input(question) {
        return new Promise(resolve => {
            if (this.ttsEnabled) {
            }
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
    print(message) {
        if (this.ttsEnabled) {
        }
        console.log(message);
    }
    intent(phrase, answers, threshold = 50) {
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
    div() {
        console.log("================================");
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
