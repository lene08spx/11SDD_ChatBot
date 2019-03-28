"use strict";
//@ts-check
//
// UserInterface CODE
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// sometimes javascript is full of empty PROMISES. badum-tsss
const readline_1 = __importDefault(require("readline"));
const fuzzball_1 = __importDefault(require("fuzzball"));
// IGNORE DUE TO MISSING DECLARATION FILES
//@ts-ignore
//import GoogleTts = require("google-tts-api");
const Say = require("say");
const TTS_ENABLE = true;
const TTS_SPEED = 1.5;
const TTS_SLEEP_MULTIPLILER = 0.081; // higher for cloud tts
const TTS_LANG = "en-au"; //https://cloud.google.com/speech-to-text/docs/languages
class PBUI {
    constructor() {
        this.ttsEnabled = TTS_ENABLE;
    }
    sleep(ms) { return new Promise(resolve => { setTimeout(resolve, ms); }); }
    async input(question) {
        return new Promise(async (resolve) => {
            if (this.ttsEnabled) {
                Say.speak(question, undefined, TTS_SPEED);
                /*GoogleTts(question, TTS_LANG)
                .then(function (url:string) {
                    ChildProcess.exec('start vlc --rate='+String(TTS_SPEED)+' --qt-start-minimized --qt-notification=0 --qt-minimal-view --play-and-exit '+'"'+url+'"');
                });*/
                //let url = "https://text-to-speech-demo.ng.bluemix.net/api/v1/synthesize?text="+encodeURIComponent(question)+"&voice=en-US_MichaelV2Voice&accept=audio%2Fmp3";
                //ChildProcess.exec('start vlc --rate='+String(TTS_SPEED)+' --qt-start-minimized --qt-notification=0 --qt-minimal-view --play-and-exit '+'"'+url+'"');
                //ChildProcess.exec('"'+process.cwd()+'\\data\\ffplay.exe" -nodisp -autoexit '+'"'+url+'" ');
                await this.sleep((question.replace(/ +/g, ' ').length * TTS_SLEEP_MULTIPLILER * 1000) + 1000);
            }
            let rl = readline_1.default.createInterface(process.stdin, process.stdout);
            rl.setPrompt(question + " : ");
            rl.prompt();
            rl.on("line", userInput => {
                //console.log("IP:",userInput);
                rl.close();
                resolve(userInput.trim().toLowerCase().replace(/[^A-Za-z0-9 ]/g, ''));
            });
            rl.on("end", userInput => {
                rl.close();
            });
        });
    }
    async print(message) {
        console.log(message);
        if (this.ttsEnabled) {
            Say.speak(message, undefined, TTS_SPEED);
            /*GoogleTts(message, TTS_LANG)
            .then(function (url:string) {
                ChildProcess.exec('start vlc --rate='+String(TTS_SPEED)+' --qt-start-minimized --qt-notification=0 --qt-minimal-view --play-and-exit '+'"'+url+'"');
            });*/
            //let url = "https://text-to-speech-demo.ng.bluemix.net/api/v1/synthesize?text="+encodeURIComponent(message)+"&voice=en-US_MichaelV2Voice&accept=audio%2Fmp3";
            //ChildProcess.exec('start vlc --rate='+String(TTS_SPEED)+' --qt-start-minimized --qt-notification=0 --qt-minimal-view --play-and-exit '+'"'+url+'"');
            //ChildProcess.exec('"'+process.cwd()+'\\data\\ffplay.exe" -nodisp -autoexit '+'"'+url+'" ');
            await this.sleep((message.replace(/ +/g, ' ').length * TTS_SLEEP_MULTIPLILER * 1000) + 1000);
        }
    }
    intent(phrase, answers, threshold = 50) {
        if (phrase === "" || phrase.replace(/[^A-Za-z0-9]+/, "") === "")
            return false;
        let fuz = fuzzball_1.default.extract(phrase, answers);
        //console.log(fuz);
        //console.log(phrase, fuz);
        if (fuz[0]) {
            if (fuz[0][1] > threshold)
                return (true);
            else
                return (false);
        }
        return false;
    }
    div(char = "=", length = 32) {
        let s = "";
        for (let i = 0; i < length; i++)
            s += char;
        console.log(s);
    }
}
exports.PBUI = PBUI;
