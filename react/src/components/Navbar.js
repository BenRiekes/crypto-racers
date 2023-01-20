//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";
import { useResolvedPath, useNavigate, useMatch, Link } from "react-router-dom";

//Firebase:
import { auth, firestore } from "../firebase-config"; 
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/Firebase";  

//Web3: 
import { ConnectWallet, ThirdwebProvider, useSDK } from "@thirdweb-dev/react";
import { useAddress, useDisconnect, useUser, useLogin, useLogout, useMetamask } from '@thirdweb-dev/react';
import { signInWithCustomToken } from "firebase/auth";

export default function Navbar() {

    //Thirdweb:
    const address = useAddress();
    const sdk = useSDK();

    const SignIn = async () => {

        const payload = await sdk?.auth.login("example.com");

        //Make request with payload:
        const thirdwebSignIn = httpsCallable(getFunctions(), "thirdwebSignIn");

        //Pass data to firebase functions:
        thirdwebSignIn ({
            payload: payload,
            address: address

        }).then (val => {
            const { token } = val.data; 

            //After firebase function has completed: 
            signInWithCustomToken(auth, token).then ((userCredential) => {


            })

        }).catch (error => {
            console.log("An error occured: " + error); 
        })
    }

    return (

        <div>
            {address ? (
                <button onClick = {() => SignIn()}>Sign in with Ethereum</button>
            ) : (
                <ConnectWallet />
            )}
        </div>
    )
}