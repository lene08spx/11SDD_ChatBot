"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
const IBPubBot_1 = __importDefault(require("./IBPubBot"));
const PBDatabase_1 = require("./PBDatabase");
new PBDatabase_1.PBDatabase("./data/ironbarkpub.db", function onReady(db) {
    new IBPubBot_1.default("Murray", db).run();
});
