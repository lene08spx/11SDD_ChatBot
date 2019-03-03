//@ts-check
import IBPubBot from "./IBPubBot";
import PBDatabse from "./PBDatabase";
// FUTURE :: IBPubBot("Murray", *window, ?*tts, ?*speechrecog)
new PBDatabse("./data/ironbarkpub.db", function (db){
    // CREATE NEW BOTS DATA BASE INIT IMPORTANT
    new IBPubBot("Murray","console",db,"au").run();
});
