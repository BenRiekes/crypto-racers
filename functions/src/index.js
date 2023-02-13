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


const createUser = async (address) => {

    const starterPfp = [
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FBlackHelmet.png?alt=media&token=98c8b32e-a5d9-4135-9e0f-9634e6fbaa3a",
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FBlueHelmet.png?alt=media&token=1c6af10f-e023-4d83-b92a-7425dff961b1",
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FGrayHelmet.png?alt=media&token=71e6a245-482b-4b8f-a0c5-60b807c3ac92",
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FGreenHelmet.png?alt=media&token=3d498018-163b-4323-bf6a-8fd844559dbb",
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FRedHelmet.png?alt=media&token=f9de6242-9f27-4670-b215-7a38da2cf724",
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterHelmets%2FYellowHelmet.png?alt=media&token=56cf618a-e138-425e-b6f5-39cea483a481",
    ];

    const starterBackground = [
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fmoonlight-preview-big.png?alt=media&token=f8c70bdd-707a-4113-9ac7-80f6ff2e1a5b",
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fneon-preiview-big.png?alt=media&token=e0e8f0d6-0c64-41a7-977f-3a3f5f9e359a",
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fsky-lines-preview-big.png?alt=media&token=4ec6bc01-d72d-4ff8-b8f3-312d22548242",
        "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fsynthwave-preview-big.png?alt=media&token=b46a93f4-d4b3-4b0e-93d5-98184058dd04",
    ];

    const pfpIndex  = Math.floor(Math.random() * (6 - 1 + 1)) + 1; 
    const backgroundIndex = Math.floor(Math.random() * (4 - 1 + 1)) + 1; 

    const newUserRef = admin.firestore().collection("users").doc(address)

    newUserRef.set({

        username: generateUsername("", 0, 15),
        bio: "No bio yet", 
        pfp: starterPfp[pfpIndex],
        background: starterBackground[backgroundIndex], 

        wins: 0,
        losses: 0,

        friends: [], 
        incomingReq: [],
        outgoingReq: [],

    })

    return;
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
});
