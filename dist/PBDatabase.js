"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
class PBDatabase {
    constructor(dbPath, readyCallback) {
        this._db = new sqlite3_1.default.Database(dbPath, (err) => {
            if (err)
                console.log("DB Error:", err);
            readyCallback(this);
        });
    }
    query(sql, ...params) {
        return new Promise(resolve => {
            this._db.all(sql, params, (err, rows) => {
                if (err)
                    console.log(err);
                resolve(rows);
            });
        });
    }
}
exports.PBDatabase = PBDatabase;
exports.default = PBDatabase;
