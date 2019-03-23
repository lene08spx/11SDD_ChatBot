//@ts-check
import IBPubBot from "./IBPubBot";
import { PBDatabase } from "./PBDatabase";

new PBDatabase("./data/ironbarkpub.db", async function onReady(db){
    new IBPubBot("Murray", db).run();
});
