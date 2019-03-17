// (C) 2018 Oliver Lenehan
class PBUser {

    public readonly userID:     string;
    public readonly prettyName: string;

    constructor ( name: string ) {
        this.prettyName = name.split(" ").map(value => {return value[0].toUpperCase()+value.slice(1).toLowerCase()}).join(" ").trim();
        this.userID = this.prettyName.toLowerCase().replace(/ /g, "_");
    }
}
export default PBUser;
