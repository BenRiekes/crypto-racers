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

const IS_EMULATOR = process.env.FUNCTIONS_EMULATOR === "true" || process.env.FUNCTIONS_EMULATOR === true;
const BET_POOLS = {
    "Weenie Hut Jr.": {
        race: "midnight",
        entryFee: 1,
        betAmount: 5,
    },
    "Weenie Hut Sr.": {
        race: "midnight",
        entryFee: 2,
        betAmount: 10,
    }
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

// ------------------
// Matchmaking Functions

// export const matchmakingRunner = functions.pubsub.schedule('1 * * * *').onRun(async (context) => {
export const matchmakingRunner = functions.https.onRequest(async (req, res) => {
    // query matchmaking for pending matches. find two users who have the same desiredRace and desiredBettingPool. add to activeRaces and delete from matchmaking.
    // try to prioritize users who have been waiting the longest.
    const query = await admin.firestore().collection('matchmaking').where('status', '==', 'pending').get();
    if (query.docs.length === 0) { 
        functions.logger.debug("No pending matches found."); 
        if (IS_EMULATOR) res.send("No pending matches found.");
        return;
    };
    const pendingMatches = query.docs.map((doc) => doc.data());
    
    // sort pending matches by time joined
    pendingMatches.sort((a, b) => {
        return a.timeJoined - b.timeJoined;
    });
    
    // find matches
    const matches = [];
    let matchesDebug = [];
    
    for (let i = 0; i < pendingMatches.length; i++) {
        const match = pendingMatches[i];
        const matchUid = match.user;
        const matchRace = match.desiredRace;
        const matchBetPool = match.desiredBetPool;
        const matchEntryFee = BET_POOLS[matchBetPool].entryFee;
        const matchBetAmount = BET_POOLS[matchBetPool].betAmount;
    
        for (let j = i + 1; j < pendingMatches.length; j++) {
            const otherMatch = pendingMatches[j];
            const otherMatchUid = otherMatch.user;
            const otherMatchRace = otherMatch.desiredRace;
            const otherMatchBetPool = otherMatch.desiredBetPool;
    
            if (matchRace === otherMatchRace && matchBetPool === otherMatchBetPool) {
                const msg = `Match found between ${matchUid} and ${otherMatchUid}`;
                functions.logger.debug(msg);
                matchesDebug.push(msg);
                const matchData = {
                    player1: matchUid,
                    player2: otherMatchUid,
                    player1Car: match.userCar,
                    player2Car: otherMatch.userCar,
                    status: "pending",
                    timeMatchmade: admin.firestore.FieldValue.serverTimestamp(),
                    timeRaceStarted: -1,
                    timeRaceEnded: -1,
                    race: matchRace,
                    betPool: matchBetPool,
                    entryFee: matchEntryFee,
                    betAmount: matchBetAmount,
                    winner: "",
                    loser: "",
                    players: [matchUid, otherMatchUid]
                }
                matches.push(matchData);
                pendingMatches.splice(j, 1);
                break;
            }
        }
    }
    
    // add data from matches array to activeRaces collection. delete matchmaking doc.
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const newRace = await admin.firestore().collection('activeRaces').add(match);
        await admin.firestore().collection('matchmaking').doc(match.player1).delete();
        await admin.firestore().collection('matchmaking').doc(match.player2).delete();
    }

    if (matches.length === 0) matchesDebug = "No matches found.";
    functions.logger.debug(`${matches.length} matches found.`);

    if (IS_EMULATOR) res.send(matchesDebug);
    return;
});

export const checkMatchmakingStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called while authenticated.'
        );
    }

    const user = context.auth.uid;

    const query = await admin.firestore().collection('activeRaces').where('players', 'array-contains', user).get();
    if (query.docs.length === 0) return "NoMatchFound";

    const pendingMatch = query.docs[0].data();
    return pendingMatch;
})

export const joinMatchmaking = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called while authenticated.'
        );
    }

    const user = context.auth.uid;
    const userCar = data.userCar;
    const desiredRace = data.desiredRace;
    const desiredBetPool = data.desiredBetPool;
    
    const newMatchmakingData = {
        user: user,
        userCar: userCar,
        desiredRace: desiredRace,
        desiredBetPool: desiredBetPool,
        status: "pending",
        timeJoined: admin.firestore.FieldValue.serverTimestamp(),
    }

    const newMatchmaking = await admin.firestore().doc(`matchmaking/${user}`).set(newMatchmakingData);
    return newMatchmaking.id;
});

export const dropFromMatchmaking = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called while authenticated.'
        );

    }

    const user = context.auth.uid;

    // query matchmaking for user matching uid and delete doc
    const query = await admin.firestore().collection('matchmaking').where('user', '==', user).get();
    query.forEach((doc) => {
        doc.ref.delete();
    });

    return "success";
});

// ------------------
// Race functions

export const raceStatusUpdate = functions.https.onRequest(async (req,res) => {
    
});

export const raceFinished = functions.https.onRequest(async (req, res) => {
    // 
});

// ------------------

if (IS_EMULATOR) {
    functions.logger.debug("Running in emulator mode.");

    setInterval(async () => {
        admin.firestore().doc("debug/debug").set({time: admin.firestore.FieldValue.serverTimestamp()}, {merge: true});
    }, 5000);
}
