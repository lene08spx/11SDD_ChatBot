//@ts-check
const PBLanguage = {
    "au": {
        "speech": {
            "intro": "G'Day!, my name is {0}. Welcome to the Ironbark Pub food ordering service.",
            "useMyNameTTS": "Sorry, to verify your name you must say \"{0}\" before your name.",
            "useMyNameText": "Sorry, to verify your name you must type \"{0}\" before your name.",
            "notUnderstood": "Sorry, I didn't understand that.",
            "noOrder": "That's okay. I can help you anytime.",
            "goodbye": "Thank You, Have a nice day.",
            "orderIntent": "Would you like to order some food now?",
            "askName": "May I ask what is your name?"
        },
        "fuzzy": {
            "yes": ["yes please", "for sure", "sure", "sounds good", "yes", "yep", "bloody oath", "yea", "yes please"],
            "no": ["nah", "no thanks", "nope", "nup", "no", "no way"],
            //"myName": ["my name is"]
        },
        "words": {
            "myName": "My name is",
            "steak": "steak"
        }
    }
};
export default PBLanguage;