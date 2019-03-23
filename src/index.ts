//@ts-check
import IBPubBot from "./IBPubBot";
import { PBDatabase } from "./PBDatabase";

new PBDatabase("./data/ironbarkpub.db", function onReady(db){
    new IBPubBot("Murray", db).run();
});
