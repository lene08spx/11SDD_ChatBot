//@ts-check
// Fuzzball :D
// This handles the whole app
import Readline from "readline";
import FuzzBall from "fuzzball";
import IBPubBot from "./IBPubBot";

const bot = new IBPubBot("Murray");
// const bot = new IBPubBot("Murray", *window, ?*tts, ?*speechrecog)
//const botWindow = new IBPubBotInterface.Console();
//
//bot.chat("Hello, I would like to order some drinks.");
bot.events.on("ready", console.log);
bot.events.on("introduce", console.log);
bot.run();

/*
// YAY!!!
let list = ["I am ok", "yes I am","yes","ok"]
let results = FuzzBall.extract("yes I am ok", list);
console.log(results);
// [ 'baconing', 'a mighty bear canoe' ]
*/
