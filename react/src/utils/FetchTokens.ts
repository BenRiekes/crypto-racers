import { ethers } from "ethers";
import { RacerABI } from "../abi/RacerABI";
import { RacerUtilsABI } from "../abi/RacerUtilsABI";
import { AlchemyProvider } from "@ethersproject/providers";


//Configuratgion: ----------------------------------------------------------------------------------

const network = "goerli";
const provider = new ethers.providers.AlchemyProvider(network, "wK71MQDuuUJDH45J2Sfb1MTIX43q_l14");

const racerAddr = "0x0109582b9202Ea21734D4c47479868faA1B3B581"
const racerUtilsAddr = "0xFE4bAd4D612Dcb8695A08422b81e6E75C74Cf563";

const racerUtilsContract = new ethers.Contract(racerUtilsAddr, RacerUtilsABI, provider);
const racerContract = new ethers.Contract(racerAddr, RacerABI, provider);

//Fetch Data: -----------------------------------------------------------------------------------


export interface TokenTypes {
    tokenID: Number, carID: Number, owner: String, uri: String,
    speed: Number, acceleration: Number,torque: Number, drift: Number, 
    weight: Number,wins: Number, losses: Number, onMarket: Boolean, price: Number, paymentMethod: Number
}


export const fetchUserTokens = async (address: any): Promise<TokenTypes[]> => {

    
    return new Promise (async (resolve, reject) => {

        let tokens: TokenTypes[] = [];
        
        
        const hexToInt = (hexVal: any) => {
            return parseInt(hexVal, 16);
        }

        await racerUtilsContract.functions.walletOfOwner(address).then(async function(idRes) {

            for (let i = 0; i < idRes[0].length; i++) {
                
                let tokenIndex = hexToInt(idRes[0][i]._hex);
                
                await racerContract.functions.getTokenStats(tokenIndex).then(async function(statsRes) {

                    let speed = hexToInt(statsRes[0][0]._hex);
                    let accel = hexToInt(statsRes[0][1]._hex);
                    let torque = hexToInt(statsRes[0][2]._hex);
                    let drift = hexToInt(statsRes[0][3]._hex);
                    let weight = hexToInt(statsRes[0][4]._hex);

                    
                    racerContract.functions.IDToToken(tokenIndex).then(function(infoRes) {

                        tokens.push(

                            {
                                //Identifiers: 
                                tokenID: hexToInt(infoRes.tokenID._hex),
                                carID: hexToInt(infoRes.carID),
                                owner: infoRes.owner,

                                //Game info / Metadata
                                uri: infoRes.uri,

                                speed: speed,
                                acceleration: accel,
                                torque: torque,
                                drift: drift,
                                weight: weight,

                                wins: hexToInt(infoRes.wins._hex),
                                losses: hexToInt(infoRes.losses._hex),

                                //Market
                                onMarket: infoRes.onMarket,
                                price: hexToInt(infoRes.price._hex),
                                paymentMethod: infoRes.paymentMethod
                            }
                        );

                    }).catch ((error) => {
                        console.error("An error occured: " + error); 
                    })

                }).catch ((error) => {
                    console.error("An error occured: " + error);
                })

            }

            resolve(tokens);
            
        }).catch ((error) => {
            console.error("An error occured: " + error); 
        })
            
    })       
}

