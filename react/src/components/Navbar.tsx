//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";
import { useResolvedPath, useNavigate, useMatch, Link } from "react-router-dom";

//Firebase:
import { auth, db } from "../utils/Firebase.js"; 
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
    Button, ButtonGroup, useDisclosure, 
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
    const [balance, setBalance] = useState("");
    const [user, setUser] = useState(); //typescript type annotation 

    //Thirdweb:
    const sdk = useSDK();
    const address = useAddress();

    //Auth State:
    auth.onAuthStateChanged(user => {

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

        }).then ((val) => {
            const token = val.data; 

            //After firebase function has completed: 
            signInWithCustomToken(auth, token).then ((val) => {
                console.log(val);
 
            })


        }).catch ((error) => {
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

    //Get Balance:
    useEffect(() => {

        
        if (auth.currentUser) {
            
            const network = "goerli";
            const provider = ethers.getDefaultProvider(network);
        
            provider.getBalance(auth.currentUser.uid.toString()).then((balance) => {

                const balanceInEth = ethers.utils.formatEther(balance);
                const concatBalance = balanceInEth.toString().substring(0, 4);

                setBalance(concatBalance); 
            })

        } else {
            setBalance('?');
        }

    }, [user])

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

                <button onClick = {() => {
                    SignIn()
                }}>
                    <Icon path = {mdiWallet} size = {1.5} />
                    <p style = {{padding: '2.5%'}}>Sign In</p>
                </button>
            ); 
        }
    }

    //===================================================================================================

    const { isOpen, onOpen, onClose } = useDisclosure();

    const EthModal = () => {

        return (

            <Modal isCentered isOpen = {isOpen} onClose={onClose}>
                
                
                <ModalContent>

                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                        <Text>Custom backdrop filters!</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>

                </ModalContent>

            </Modal>
        )
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
                
                        
                <button 
                    onClick = {() => {
                       <EthModal />
                    }}
                >
                    <Icon path = {mdiEthereum} size = {1.5} /> 
                    <p style = {{padding: '5%'}}>{balance}</p>
                </button>

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

                    
                <button 
                
                    onClick = {() => {
                        <Link to = "/Profile"></Link> 
                    }}                    
                >
                    <Icon path = {mdiRacingHelmet} size = {1.5} />
                </button>

            </div>
                           
        </nav>
    )
}
