//@ts-check
import IBPubBot from "./IBPubBot";
import PBDatabse from "./PBDatabase";

new PBDatabse("./data/ironbarkpub.db", function onReady(db){
    new IBPubBot("Murray", db).run();
});
