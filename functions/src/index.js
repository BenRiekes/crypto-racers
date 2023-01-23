//Set Up:
import functions from "firebase-functions";
import admin from "firebase-admin";
import fs from 'fs'; 

import dotenv from "dotenv";
dotenv.config(); 

//Web2: 
import { generateUsername } from "unique-username-generator"; 

//Web3:
import { ThirdwebSDK } from "@thirdweb-dev/sdk"; 
import { ThirdwebStorage } from "@thirdweb-dev/storage";

//Init:
admin.initializeApp();

//Helpers:
function generatePFP() {
    
    let randomNum  = Math.floor(Math.random() * (6 - 1 + 1)) + 1; 
    let starterHelmet; 

    switch (randomNum) {
        case 1:
            //Blue:
            starterHelmet = "http://127.0.0.1:9199/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FBlueHelmet.png?alt=media&token=a5a34d87-63bc-4de7-a0ab-89808e990898";
            break;
        case 2: 
            //Black:
            starterHelmet = "http://127.0.0.1:9199/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FBlackHelmet.png?alt=media&token=87254cfc-ed10-45df-94a0-9650bce36e23";
            break;
        case 3:
            //Gray: 
            starterHelmet = "http://127.0.0.1:9199/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FGrayHelmet.png?alt=media&token=0c103ae4-62d1-4135-9c48-1f9e3eb60d12";
            break;
        case 4: 
            //Green:
            starterHelmet = "http://127.0.0.1:9199/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FGreenHelmet.png?alt=media&token=8ef3a9a5-fb9e-4465-afa9-bfdde1cc7907";
            break;
        case 5:
            //Red:
            starterHelmet = "http://127.0.0.1:9199/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FRedHelmet.png?alt=media&token=95e83465-d0ae-463e-887c-0bdaa28755d8"; 
            break;
        case 6: 
            //Yellow
            starterHelmet = "http://127.0.0.1:9199/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FYellowHelmet.png?alt=media&token=0ec6f58e-3665-4bde-980f-46411f3b83c2"; 
            break;
        default:
            console.log("An error occured: " + randomNum + "is not valid"); 
            return; 
    }

    
    return starterHelmet; 
}


//Sign In
export const thirdwebSignIn = functions.https.onCall(async (data, context) => {

    return new Promise (async (resolve, reject) => {

        //Data pulled from client side
        const payload = data.payload;
        const address = data.address; 
        const domain = "localhost:3000"; 

        //Init thirdweb sdk
        const sdk = ThirdwebSDK.fromPrivateKey (process.env.ADMIN_PRIVATE_KEY, "goerli", ); 

        console.log(sdk); 

        //Verify data with sdk
        try {
            sdk.auth.verify(domain, payload);

        } catch (error) {
            console.log("An error occured " + error); 
            return; 
        }

        //Check if user has a profile: If not sign up
        admin.firestore().collection("users").doc(address).get()
        .then ((val) => {

            if (!val.data()) {

                createUser(address);
            } 

        }).catch ((error) => {
            resolve("An Error Occured: " + error); 
        })

        //Generate JWT Token:
        const token = await admin.auth().createCustomToken(address)
        resolve(token);
    })
})

const createUser = async (address) => {

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

