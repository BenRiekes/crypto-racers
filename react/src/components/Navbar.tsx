//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";
import { useResolvedPath, useNavigate, useMatch, Link } from "react-router-dom";
import EthModal from "./EthModal"; 

//Firebase:
import { auth, db } from "../utils/Firebase"; 
import { User, createUserWithEmailAndPassword, signInWithCustomToken, signOut} from "firebase/auth";
import { httpsCallable, getFunctions } from "firebase/functions"; 


//Web3: 
import { ethers } from "ethers"; 
import { ConnectWallet, ThirdwebProvider, useSDK } from "@thirdweb-dev/react";
import { useAddress, useDisconnect, useUser, useLogin, useLogout, useMetamask } from '@thirdweb-dev/react';

//CSS:
import "./ComponentStyles.css";
import Icon from "@mdi/react";

import { 
    Button, ButtonGroup, useDisclosure, Avatar,
    ModalOverlay, Modal, ModalContent, ModalBody, Text, ModalHeader, ModalCloseButton, ModalFooter,
} from '@chakra-ui/react'

import {
    mdiTire,
    mdiEthereum,
    mdiWallet,
    mdiRacingHelmet,
    mdiLocationExit
}  from "@mdi/js"; 


export default function Navbar() {

    
    //State Vars:
    const [user, setUser] = useState<User | undefined>(); //typescript type annotation


    //Thirdweb:
    const sdk = useSDK();
    const address = useAddress();

    //Auth State:
    auth.onAuthStateChanged((user: any) => {

        setUser(user);
    }); 


    //===================================================================================================

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

    const LogOut = async () => {

        signOut(auth).then(() => {
            window.location.reload(); 

        }).catch((error) => {
            console.log("An error occured " + error); 
        })
    }

    //===================================================================================================

    

    //===================================================================================================

    const ActionButton = () => {

        if (user) {

            return (

                <button onClick = {() => {
                    LogOut();
                }}>
                    <Icon path = {mdiLocationExit} size = {1.5} />
                    <p style = {{padding: '2.5%'}}>Sign Out</p>
                </button>
            )

        } else  {
           
            return (

                <Button 
                    style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', gap: '10px' }}
                
                    onClick = {() => {
                    SignIn()
                }}>
                    <Icon path = {mdiWallet} size = {1.5} />
                    Sign In
                </Button>
            ); 
        }
    }


    //===================================================================================================


    return (


        <nav className = "nav">

            
            <div className = "nav-section">

                <p>Crypto-Racers!</p>

                <button>
                    <Icon path = {mdiTire} size = {1.5} /> 
                    <p style = {{padding: '5%'}}>0</p>
                </button>
                
                <EthModal user = {user}/>

            </div>
                    
            <div className = "nav-section">

                
                {address ? (

                    <ActionButton/>
                    
                ) : (

                    
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
                    
                    accentColor = "#2d2d2d" 
                    colorMode = "dark"
                    />   
                )}

                    
                <Button 
                
                    onClick = {() => {
                        <Link to = "/Profile"></Link> 
                    }}                    
                >
                    <Icon path = {mdiRacingHelmet} size = {1.5} />
                </Button>

            </div>
                           
        </nav>
    )
}
