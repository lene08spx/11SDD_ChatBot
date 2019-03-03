"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
const IBPubBot_1 = __importDefault(require("./IBPubBot"));
const PBDatabase_1 = __importDefault(require("./PBDatabase"));
// FUTURE :: IBPubBot("Murray", *window, ?*tts, ?*speechrecog)
new PBDatabase_1.default("./data/ironbarkpub.db", function (db) {
    // CREATE NEW BOTS DATA BASE INIT IMPORTANT
    new IBPubBot_1.default("Murray", "console", db, "au").run();
});
