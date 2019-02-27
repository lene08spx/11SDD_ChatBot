//@ts-check
//
// UserInterface CODE
//

import * as PB from "./PBTypes";
import PBLanguage from "./PBLang";

import Readline from "readline";
import Fuzzball from "fuzzball";

export declare interface PBUserInterface {    
    input(question: string): Promise<string>;
    print(message: string): Promise<void>;
    intent(phrase: string, answers: Array<string>, threshold?: number): Promise<boolean>;
}
export class PBUserInterface {

    public readonly ttsEnabled: boolean;

    constructor (type: PB.PBUITypes, enableTTS: boolean = false) {
        if (type === "console") {
            this.input = this._con_input;
            this.print = this._con_print;
            this.intent = this._con_intent;
        }
        this.ttsEnabled = enableTTS;
    }

    private _con_input(question: string) {
        return new Promise<string>( resolve => {
            let rl = Readline.createInterface(process.stdin, process.stdout);
            rl.setPrompt(question+" : ");
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
        })
    }

    private _con_print(message: string): Promise<void> {
        return new Promise<void>( resolve => {
            console.log(message);
            resolve();
        });
    }

    private _con_intent(phrase: string, answers: Array<string>, threshold: number = 50): Promise<boolean> {
        return new Promise<boolean>( resolve => {
            let fuz = Fuzzball.extract(phrase, answers);
            if (fuz[0]) {
                if (fuz[0][1] >= threshold) resolve(true);
                else resolve(false);
            }
        });
    }
}
export default PBUserInterface;


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
