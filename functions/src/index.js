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

    const storage = new ThirdwebStorage(); 

    let metadata = {
        image: fs.readFileSync(starterHelmet),
    }; 

    let uri = await storage.upload(metadata);
    let url = await storage.resolveScheme(uri); 

    return url; 
}


//Sign In
export const thirdwebSignIn = functions.https.onCall(async (data, context) => {

    return new Promise (async (resolve, reject) => {

        //Data pulled from client side
        const payload = data.payload;
        const address = data.address; 
        const domain = "localhost:3000"; 

        //Init thirdweb sdk
        const sdk = ThirdwebSDK.fromPrivateKey (process.env.ADMIN_PRIVATE_KEY, "mumbai", ); 

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

const createUser = (address) => {

    return new Promise (async (resolve, reject) => {

        const newUserRef = admin.firestore().collection("users").doc(address)
            
        newUserRef.set({
            
            username: generateUsername("", 0, 15),
            bio: "No bio yet", 
            pfp: "", 

            wins: 0,
            losses: 0,

            friends: [], 
            incomingReq: [],
            outgoingReq: [],

        }).then ((val) => {
            resolve("Successfully created profile"); 

        }).catch ((error) => {
            resolve("Create Profile Error: " + error);
        })    
    })   
}

