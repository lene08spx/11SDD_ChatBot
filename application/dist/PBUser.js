"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// (C) 2018 Oliver Lenehan
class PBUser {
    constructor(name) {
        this.prettyName = name.split(" ").map(value => { return value[0].toUpperCase() + value.slice(1).toLowerCase(); }).join(" ").trim();
        this.userID = this.prettyName.toLowerCase().replace(/ /g, "_");
    }
}
exports.default = PBUser;
