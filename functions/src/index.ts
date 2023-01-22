//Set Up:
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require('fs'); 
require('dotenv').config(); 


//Web2: 
const generateUsername = require("unique-username-generato"); 

//Web3:
const ThirdwebSDK = require("@thirdweb-dev/sdk"); 
const ThridwebStorage = require("@thirdweb-dev/storage");

//Init:
admin.initializeApp();

//Helpers:
async function generatePFP() {
    
    let randomNum  = Math.floor(Math.random() * (6 - 1 + 1)) + 1; 
    let starterHelmet; 

    switch (randomNum) {
        case 1:
            starterHelmet = "crypto-racers/assets/BlackHelmet.png";
            break;
        case 2: 
            starterHelmet = "crypto-racers/assets/BlueHelmet.png";
            break;
        case 3:
            starterHelmet = "crypto-racers/assets/GrayHelmet.png";
            break;
        case 4: 
            starterHelmet = "crypto-racers/assets/GreenHelmet.png";
            break;
        case 5:
            starterHelmet = "crypto-racers/assets/RedHelmet.png"; 
            break;
        case 6: 
            starterHelmet = "crypto-racers/assets/YellowHelmet.png"; 
            break;
        default:
            console.log("An error occured: " + randomNum + "is not valid"); 
            return; 
    }

    //Thirdweb IPFS Upload: 

    const storage = new ThridwebStorage(); 

    let metadata = {
        image: fs.readFileAsync(starterHelmet),
    }; 

    let uri = await storage.upload(metadata);

    let url = await storage.resolveScheme(uri); 

    return url; 
}


//Sign In
exports.thirdwebSignIn = functions.https.onCall(async (data: any, context: any) => {

    //Data pulled from client side
    const payload = data.payload;
    const address = data.address; 
    const domain = "example.com"; 

    //Init thirdweb sdk
    const sdk = ThirdwebSDK.fromPrivateKey (

        process.env.ADMIN_PRIVATE_KEY!,
        "Goerli",
    ); 

    //Verify data with sdk
    try {
        sdk.auth.verify(domain, payload);

    } catch (error) {
        console.log("An error occured " + error); 
        return; 
    }

    //Generate JWT Token:
    const token = await admin.auth.createCustomToken(address)
    .then (val => {

        admin.firestore().collection("users").doc(address).get()
        .then (val => {

            if (!val.data()) {

                const newUserRef = admin.firestore().collection("users").doc(address)
                
                newUserRef.set({
                    
                    username: generateUsername("", 0, 15),
                    bio: "No bio yet", 
                    pfp: generatePFP(), 

                    wins: 0,
                    losses: 0,

                    friends: [], 
                    incomingReq: [],
                    outgoingReq: [],
                })
            }
            
        }).catch (error: any => {
            functions.logger.error(error); 
            reject ("An error occurec"); 
        })

    }).catch (error: any => {
        functions.logger.error(error);
        reject ("An error occured"); 
    })
    

    return {token}; 
})

<<<<<<< HEAD
=======
// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.a = functions.https.onCall(async (data, context: functions.https.CallableContext) => {
  res.send("Hello from Firebase!");
});
>>>>>>> 7f0766e4f7a5450cacd453d021f28126159c634d
