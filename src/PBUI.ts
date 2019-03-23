//@ts-check
//
// UserInterface CODE
//

import Readline from "readline";
import Fuzzball from "fuzzball";

const TTS_ENABLE = false;

export class PBUI {

    public readonly ttsEnabled: boolean = TTS_ENABLE;
    private _pinnedMessages: string[] = [];

    public input(question: string) {
        return new Promise<string>( resolve => {
            if (this.ttsEnabled) {

            }
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
        });
    }

    public print(message: string): void {
        if (this.ttsEnabled) {

        }
        console.log(message);
    }

    public intent(phrase: string, answers: Array<string>, threshold: number = 50): boolean {
        let fuz = Fuzzball.extract(phrase, answers);
        if (fuz[0]) {
            if (fuz[0][1] >= threshold) return(true);
            else return(false);
        }
        return false;
    }
    
    public div(): void {
        console.log("================================");
    }

    /*
    public pin(message: string): Promise<void> {
        return new Promise<void>( resolve => {
            console.log("PINNED",message);
            resolve();
        });
    }*/
}


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
