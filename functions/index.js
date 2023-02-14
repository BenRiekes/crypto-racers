//Set Up:
import functions from "firebase-functions";
import admin from "firebase-admin";

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

    const newUserRef = admin.firestore().collection("users").doc(address);

    const username = generateUsername("", 0, 15);
        
    newUserRef.set({
        
        username: username,
        bio: "No bio yet", 
        pfp: starterPfp[pfpIndex],
        background: starterBackground[backgroundIndex], 

        wins: 0,
        losses: 0,
        
        friends: [], 
        incomingReq: [],
        outgoingReq: [],

    })

    // update displayName
    await admin.auth().updateUser(address, {
        displayName: username
    });

    return;
}

// ------------------
// Matchmaking Functions

// NOTE: The displayName values of any activeRace is only current as of doc creation time.
// If you are accessing the data in the future, you should check the uid against the users collection to get the current displayName.
// export const matchmakingRunner = functions.pubsub.schedule('1 * * * *').onRun(async (context) => {
export const matchmakingRunner = functions.https.onRequest(async (req, res) => {
    const matches = [];
    let matchesDebug = [];
    
    // Query for docs that have a lastUpdate value older than 1 minute. Delete them.
    const oldMatchesQuery = await admin.firestore().collection('matchmaking').where('lastUpdate', '<', Date.now() - 60000).get();
    const oldMatches = oldMatchesQuery.docs.map((doc) => doc.data());
    for (let i = 0; i < oldMatches.length; i++) {
        const match = oldMatches[i];
        functions.logger.debug(`Deleting old matchmaking doc for ${match.user}`);
        matchesDebug.push(`Deleting old matchmaking doc for ${match.user}`);
        await admin.firestore().collection('matchmaking').doc(match.user).delete();
    }
    
    // query matchmaking for pending matches. find two users who have the same desiredRace and desiredBettingPool. add to activeRaces and delete from matchmaking.
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
                // Update both match docs to "matched" status
                await admin.firestore().collection('matchmaking').doc(matchUid).update({
                    status: "matched",
                    match: otherMatchUid,
                    matchDisplayName: otherMatch.userDisplayName,
                    matchCar: otherMatch.userCar,
                });
                await admin.firestore().collection('matchmaking').doc(otherMatchUid).update({
                    status: "matched",
                    match: matchUid,
                    matchDisplayName: match.userDisplayName,
                    matchCar: match.userCar,
                });
                matchesDebug.push(msg);
                const matchData = {
                    player1Address: matchUid,
                    player2Address: otherMatchUid,
                    player1DisplayName: match.userDisplayName,
                    player1Car: match.userCar,
                    player2Car: otherMatch.userCar,
                    player2DisplayName: otherMatch.userDisplayName,
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
                    playerAddresses: [
                        matchUid,
                        otherMatchUid
                    ],
                    players: [
                        {
                            address: matchUid,
                            lastUpdate: Date.now(),
                            speed: 0,
                            position: 0,
                            isReady: false
                        },
                        {
                            address: otherMatchUid,
                            lastUpdate: Date.now(),
                            speed: 0,
                            position: 0,
                            isReady: false
                        }
                    ]
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
        await admin.firestore().collection('activeRaces').add(match);
        await admin.firestore().collection('matchmaking').doc(match.player1Address).delete();
        await admin.firestore().collection('matchmaking').doc(match.player2Address).delete();
    }

    if (matches.length === 0) matchesDebug = ["No matches found."];
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

    const query = await admin.firestore().collection('activeRaces').where('playerAddresses', 'array-contains', user).get();
    if (query.docs.length === 0) {
        admin.firestore().doc(`matchmaking/${user}`).update({
            lastUpdate: Date.now()
        })
        return "NoMatchFound";
    }

    const pendingMatch = query.docs[0].id;
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

    const userDoc = await admin.firestore().doc(`users/${user}`).get();
    const userDisplayName = userDoc.data().username;

    const userCar = data.userCar;
    const desiredRace = data.desiredRace;
    const desiredBetPool = data.desiredBetPool;
    
    const newMatchmakingData = {
        user: user,
        userCar: userCar,
        userDisplayName: userDisplayName,
        desiredRace: desiredRace,
        desiredBetPool: desiredBetPool,
        status: "pending",
        timeJoined: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdate: Date.now()
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

export const matchReadyUp = functions.https.onCall(async (data, context) => {
    checkContext(context);
    const user = context.auth.uid;
    const isReady = data.isReady;
    if (isReady == null || isReady == undefined) return "ParameterError";
    const query = await admin.firestore().collection('activeRaces').where('playerAddresses', 'array-contains', user).get();
    if (query.docs.length === 0) {
        return "NoMatchFound";
    }

    const pendingMatch = query.docs[0].data();
    const playerIndex = pendingMatch.playerAddresses["0"] === user ? 0 : 1;
    if (playerIndex === -1) return "PlayerNotFound";
    let newValues = {};
    if (playerIndex === 1) {
        newValues = {
            0: {
                address: pendingMatch.players["0"].address,
                lastUpdate: pendingMatch.players["0"].lastUpdate,
                speed: 0,
                position: 0,
                isReady: pendingMatch.players["0"].isReady
            },
            1: {
                address: user,
                lastUpdate: Date.now(),
                speed: 0,
                position: 0,
                isReady: isReady
            },
        }
    } else {
        newValues = {
            0: {
                address: user,
                lastUpdate: Date.now(),
                speed: 0,
                position: 0,
                isReady: isReady
            },
            1: {
                address: pendingMatch.players["1"].address,
                lastUpdate: pendingMatch.players["1"].lastUpdate,
                speed: 0,
                position: 0,
                isReady: pendingMatch.players["1"].isReady
            },
        }
    }
    let status = "prematch"
    if (newValues["0"].isReady && newValues["1"].isReady) {
        status = "active";
    }

    await admin.firestore().collection('activeRaces').doc(query.docs[0].id).set({
        players: newValues,
        status: status
    }, { merge: true });

    return "success";
});

export const matchCancel = functions.https.onCall(async (data, context) => {
    checkContext(context);
    const user = context.auth.uid;
    const query = await admin.firestore().collection('activeRaces').where('playerAddresses', 'array-contains', user).get();
    if (query.docs.length === 0) {
        return "NoMatchFound";
    }

    const pendingMatch = query.docs[0].data();
    const playerIndex = pendingMatch.playerAddresses["0"] === user ? 0 : 1;
    if (playerIndex === -1) return "PlayerNotFound";
    if (query.docs[0].data().status != "prematch") return "MatchInProgress";
    
    let doc = query.docs[0].data();
    doc.status = `player${playerIndex}Quit`;
    await admin.firestore().collection('activeRaces').doc(query.docs[0].id).delete();
    await admin.firestore().collection('completedRaces').doc(query.docs[0].id).set(doc);
    return "success";
});

// ------------------
// Race functions

async function decrypt(cipherText) {
   
}

function checkContext(context) {
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called while authenticated.'
        );
    }    
}

async function validateAuthorizationHeaders(authorization) {
    console.log("Authorization: ", authorization);
    if (!authorization) {
        functions.logger.error("No authorization header found.");
        functions.logger.error("Needs Bearer <token> or __session cookie.")
        return [false, null];
    }

    // idToken = authorization.split('Bearer ')[1];
    // if (!idToken) { 
    //     functions.logger.error("No idToken found.");
    //     return [false, null];
    // }

    try {   
        const decodedToken = await admin.auth().verifyIdToken(authorization);
        functions.logger.log("Token verified.");
        return [true, decodedToken.uid];
    } catch (error) {
        functions.logger.error("Error verifying token.");
        functions.logger.error(error);
        return [false, null];
    }
}

export const raceStatusUpdate = functions.https.onRequest(async (req, res) => {
    console.log(req.body);
    const [authorized, uid] = await validateAuthorizationHeaders(req.body['Authorization']);
    const inputHashedData = req.body['x'];

    console.log(authorized, uid);

    if(!authorized || !uid) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called while authenticated.'
        );
    }

    if (!inputHashedData) {
        throw new functions.https.HttpsError(
            'argument-error',
            'InputHashedData not found.'
        );
    }
    const query = await admin.firestore().collection('activeRaces').where('players', 'array-contains', uid).get();
    if (query.docs.length === 0) {
        return "NoRaceFound";
    }
    if (query.docs.length > 1) {
        throw new functions.https.HttpsError(
            'internal',
            'Multiple races found for user.'
        );
    }

    const playerNumber = query.docs[0].data().players.indexOf(uid);


    //1231238:345:30
    // split inputHashedData into 3 parts
    // sources from unity:
    //Epoch.current():trackController.GetPosition():playerControl.GetSpeed()
    //  a series of math operations are performed on the data before it is hashed
    //  the data is then hashed using sha256
    //  we have to undo those steps to get this value,
    // which results in the above format. Then we split it into 3 parts.

    // const decryptedData = await decrypt(inputHashedData);
    const decryptedData = inputHashedData;
    const splitData = decryptedData.split(":");


    
    // if the first index (epoch time) is too far behind the current timestamp, the update
    // is invalid and we should ignore it.

    const queryData = query.docs[0].data();
    if (queryData.status != 'active') {
        throw new functions.https.HttpsError(
            'internal',
            `Race is not in progress. Current status: ${queryData.status}.`
        );
    }

    const speed = parseInt(splitData[0]);
    const position = parseInt(splitData[1]);
    const epochTime = parseInt(splitData[2]);
    const isFinished = splitData[3] === "true";
    
    const currentTime = Date.now();
    const timeDifference = queryData.players[uid].lastUpdate - epochTime;
    // if (timeDifference > 10000) {
    //     throw new functions.https.HttpsError(
    //         'internal',
    //         `Something didn't seem right 💩.`
    //     );
    // }

    // if speed or position has increased impossibly high, ignore
    const speedDelta = speed - queryData.players[uid].speed;
    const positionDelta = position - queryData.players[uid].position;
    if (speedDelta > 100 || positionDelta > 100) {
        throw new functions.https.HttpsError(   
            'internal',
            `Something didn't seem right 👺.`
        );
    }

    const raceDataUpdate = {
        [`players.${uid}.speed`]: speed,
        [`players.${uid}.position`]: position,
        [`players.${uid}.lastUpdate`]: Date.now(),
    };

    if (isFinished) {
    }

    await admin.firestore().collection('activeRaces').doc(query.docs[0].id).update(raceDataUpdate);
});

export const raceFinished = functions.https.onRequest(async (req, res) => {
    const [authorized, uid] = await validateAuthorizationHeaders(req.body['Authorization']);
    const inputHashedData = req.body['x'];

    if(!authorized || !uid) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called while authenticated.'
        );
    }

    if (!inputHashedData) {
        throw new functions.https.HttpsError(
            'argument-error',
            'InputHashedData not found.'
        );
    }

    const query = await admin.firestore().collection('activeRaces').where('players', 'array-contains', uid).get();
    if (query.docs.length === 0) {
        return "NoRaceFound";
    }
    const data = query.docs[0].data();
    if (data.status != 'active' && data.status != 'awaitingOtherResult') {
        throw new functions.https.HttpsError(
            'internal',
            `Race is not in progress. Current status: ${data.status}.`
        );
    }

    const args = inputHashedData.split(":");
    const time = args[0];

    switch (data.status) {
        case 'active':
            await admin.firestore().collection('activeRaces').doc(query.docs[0].id).update({
                status: 'awaitingOtherResult',
                player1Time: time,
            });
        case 'awaitingOtherResult':
            const winner = data.player1Time < time ? data.players[0] : data.players[1];
            const loser = data.player1Time < time ? data.players[1] : data.players[0];
            await admin.firestore().collection('activeRaces').doc(query.docs[0].id).update({
                status: 'finished',
                player2Time: time,
                winner: winner,
                loser: loser
            });
    }

    return "success";
});

// ------------------

if (IS_EMULATOR) {
    functions.logger.debug("Running in emulator mode.");

    setInterval(async () => {
        admin.firestore().doc("debug/debug").set({time: admin.firestore.FieldValue.serverTimestamp()}, {merge: true});
    }, 5000);
}
