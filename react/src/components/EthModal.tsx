//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";

//Firebase:
import { auth, db } from "../utils/Firebase"; 
import { User, createUserWithEmailAndPassword, signInWithCustomToken, signOut} from "firebase/auth";

//Web3: 
import { ethers } from "ethers";

//CSS:
import Icon from "@mdi/react";

import { 
    Button, ButtonGroup, useDisclosure, Link, 
    ModalOverlay, Modal, ModalContent, ModalBody, Text, ModalHeader, ModalCloseButton, ModalFooter,
} from '@chakra-ui/react'

import {
    ExternalLinkIcon,
} from "@chakra-ui/icons"

import {
    mdiEthereum,
    mdiWallet,
}  from "@mdi/js"; 

interface Props {
    user: User | undefined;
}

const EthModal = ({ user }: Props) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [balance, setBalance] = useState(""); 

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

    return (

        <>
            <Button 
                size = "lg" style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', gap: '10px' }} 
            
                onClick = {() => {
                onOpen(); 
            }}> 
  
                <Icon path = {mdiEthereum} size = {1.5} />
                <Text>{balance}</Text> 
            
            </Button>


            <Modal isCentered isOpen = {isOpen} onClose = {onClose} size = "lg">
                
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />

                <ModalContent style = {{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start'}}>

                    <ModalHeader>

                        <div style = {{display: 'flex', alignItems: 'flex-start', gap: '10px'}}>
                            
                            <h1 style = {{fontSize: '25px', fontWeight: '600', textAlign: 'left'}}>
                                Your Wallet
                            </h1>

                            <Icon path = {mdiWallet} size = {1.5} />
                        </div>
                        
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody>

                        <div style = {{display: 'flex', alignItems: 'flex-start', gap: '10px'}}>

                            <h2 style = {{fontSize: '20px', fontWeight: '550'}}>
                                You currently have {balance} Goerli ETH in your wallet
                            </h2>    

                        </div>
                        
                    </ModalBody>

                    <ModalFooter >

                        
                        <Link color = '#7a348c' href = 'https://goerlifaucet.com/' isExternal
                            style = {{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '10px'}}>

                            Running Low?  Please Visit This Goerli ETH Faucet To Refill <ExternalLinkIcon mx = "5px" />
                        </Link>
                        
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </>
    );

}

export default EthModal; 
