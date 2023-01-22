//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";
import { useResolvedPath, useNavigate, useMatch, Link } from "react-router-dom";

//Firebase:
import { auth, db } from "../utils/Firebase.ts"; 
import { createUserWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { httpsCallable, getFunctions } from "firebase/functions"; 

  
//Web3: 
import { ethers } from "ethers"; 
import { ConnectWallet, ThirdwebProvider, useSDK } from "@thirdweb-dev/react";
import { useAddress, useDisconnect, useUser, useLogin, useLogout, useMetamask } from '@thirdweb-dev/react';

//CSS:
import "./ComponentStyles.css";
import Icon from "@mdi/react";
import { Button, ButtonGroup } from '@chakra-ui/react'

import {
    mdiTire,
    mdiEthereum,
    mdiWallet
}  from "@mdi/js"; 


export default function Navbar() {

    //State Vars:
    const [balance, setBalance] = useState(''); 

    //Thirdweb:
    const address = useAddress();
    const sdk = useSDK();

    const SignIn = async () => {

        const payload = await sdk?.auth.login("localhost:3000");

        //Make request with payload:
        const thirdwebSignIn = httpsCallable(getFunctions(), "thirdwebSignIn");

        //Pass data to firebase functions:
        thirdwebSignIn ({
            payload: payload,
            address: address

        }).then ((val: any) => {
            const token = val.data; 

            //After firebase function has completed: 
            signInWithCustomToken(auth, token).then ((val) => {
                console.log(val);
            })

        }).catch ((error: any) => {
            console.log("An error occured: " + error); 
        })
    }

    //Get Balance:
    useEffect(() => {

        if (address) {
            
            const network = "Goerli";
            const provider = ethers.getDefaultProvider(network);
        
            provider.getBalance(address.toString()).then((balance) => {

                const balanceInEth = ethers.utils.formatEther(balance);
                setBalance(balanceInEth.toString().substring(0, 4)); 
            })

        } else {
            setBalance('0');
        }

    }, [])

    

    return (


        <nav className = "nav">

            <ul>
                <button>
                    <Icon path = {mdiTire} size = {1.5} /> 
                    <p style = {{marginLeft: '2.5%'}}>0</p>
                </button>

                

                <button>
                    <Icon path = {mdiEthereum} size = {1.5} /> 
                    <p style = {{marginLeft: '2.5%'}}>{balance}</p>
                </button>
            </ul>

            <ul>  

                {/*Thirdweb SDK Connect Button */}
                {address ? (

                    <button onClick = {() => {
                        SignIn()
                    }}>
                        <Icon path = {mdiWallet} size = {1.5} />
                        <p>Sign In</p>
                    </button>

                ) : (

                    
                    <button>
                        
                        <ConnectWallet
                        auth = {{

                            loginConfig: {
                                redirectTo: "/Home",
                            },

                            loginOptional: false,
                            loginOptions: {
                                nonce: "Crypto Racers!", 
                                chainId: 5
                            }
                        }}
                        
                        accentColor = "#ffff" 
                        colorMode = "dark"
                        />

                    </button>
                   
                       
                )}

                {/* Navigate To Profile */}
                <button
                    onClick = {() => {
                        <Link to = "/Profile"></Link> 
                    }}
                >
                </button>

            </ul>

        </nav>

    )
}
