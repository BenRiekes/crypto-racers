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
    Button, useDisclosure, 
    Slider, NumberInput, NumberInputField, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, SliderTrack, SliderThumb,
    ModalOverlay, Modal, ModalContent, ModalBody, Text, ModalHeader, ModalCloseButton, ModalFooter, Flex, SliderFilledTrack
} from '@chakra-ui/react'

import {
    ExternalLinkIcon,
} from "@chakra-ui/icons"

import {
    mdiTire,
    mdiWallet,
    mdiEthereum
}  from "@mdi/js"; 

interface Props {
    user: User | undefined;
}




const RacerModal = ({ user }: Props) => {

    //Style component states: 
    const [value, setValue] = React.useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const handleChange = (value: any) => setValue(value)

    const [balance, setBalance] = useState("");  

    const contractAddress = "0xee204766a00C117eb17fbDc2a66ba9E25FF80e40";
    const balanceOfABI = [{"inputs": [{"internalType": "address","name": "account","type": "address"}],
        "name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view","type": "function"
    }]; 


    //Get Balance:
    useEffect (() => {

        if (auth.currentUser) {
            
            const network = "goerli";
            const provider = ethers.getDefaultProvider(network);
            const contract = new ethers.Contract(contractAddress, balanceOfABI, provider);

            contract.functions.balanceOf(auth.currentUser.uid).then(function(result) {
                setBalance(result.toString()); 
            });
        }

    }, [user]); 

    return (

        <>
            <Button 
                size = "lg" style = {{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', gap: '10px' }} 
            
                onClick = {() => {
                onOpen(); 
            }}> 
  
                <Icon path = {mdiTire} size = {1.5} />
                <Text>{balance}</Text> 
            
            </Button>


            <Modal isCentered isOpen = {isOpen} onClose = {onClose} size = "xl">
                
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(10px) hue-rotate(90deg)'
                />

                <ModalContent>

                    <ModalHeader>

                        <div style = {{display: 'flex', alignItems: 'flex-start', gap: '10px'}}>
                            
                            <h1 style = {{fontSize: '25px', fontWeight: '600', textAlign: 'left', color: 'black'}}>
                               Balance: {balance} RACER 
                            </h1>

                            <Icon path = {mdiTire} size = {1.5} color = 'black' />
                        </div>
                        
                    </ModalHeader>

                    <ModalCloseButton />

                    <ModalBody style = {{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>

                        

                        <Button leftIcon = {<Icon path = {mdiTire} size = {1.5} color = 'black' />}>
                            <p style = {{color: 'black'}}>15</p> 
                        </Button>

                        <Button leftIcon = {<Icon path = {mdiTire} size = {1.5} color = 'black' />}>
                            <p style = {{color: 'black'}}>30</p>  
                        </Button>

                        <Button leftIcon = {<Icon path = {mdiTire} size = {1.5} color = 'black' />}>
                            <p style = {{color: 'black'}}>50</p> 
                        </Button>

                        <Button leftIcon = {<Icon path = {mdiTire} size = {1.5} color = 'black' />}>
                            <p style = {{color: 'black'}}>75</p> 
                        </Button>

                        <Button leftIcon = {<Icon path = {mdiTire} size = {1.5} color = 'black' />}>
                            <p style = {{color: 'black'}}>100</p>  
                        </Button>

                    </ModalBody>

                    <ModalFooter style = {{display: 'flex', alignItems: 'flex-start', gap: '10px'}}>
 
                        <NumberInput maxW ='100px' mr ='2rem' value = {value} onChange = {handleChange} style = {{color: 'black'}}>
                            <NumberInputField />

                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>

                        </NumberInput>

                        <Slider flex='1'focusThumbOnChange = {false} value = {value} onChange = {handleChange}>

                            <SliderTrack>
                                <SliderFilledTrack/>
                            </SliderTrack>

                            <SliderThumb fontSize='sm' boxSize='32px' children={value} />
                        </Slider>

                        
                        
                    </ModalFooter>

                    <Button style = {{margin: '2.5%', backgroundColor: '#7a348c'}}>        
                        Purchase 
                    </Button>

                </ModalContent>
            </Modal>
        </>
    );

}

export default RacerModal; 