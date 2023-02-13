//React:
import React from "react"; 
import { useState, useRef, useEffect } from "react";

//Firebase:
import { auth, db } from "../utils/Firebase"; 
import { User, createUserWithEmailAndPassword, signInWithCustomToken, signOut} from "firebase/auth";

//Web3: 
import { ethers } from "ethers";
import { RacerTokenABI } from "../abi/RacerTokenABI";

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

    const [basePrice, setBasePrice] = useState(""); 
    const [balance, setBalance] = useState("");  

    //Web3: --------------------------------------------------------------

    const network = "goerli";
    const provider = ethers.getDefaultProvider(network);

    const racerTokenAddr = "0x83B81aeC03B8473D0E7458A71036E96247d5b9AA";
    const racerTokenContract = new ethers.Contract(racerTokenAddr, RacerTokenABI, provider);
    //----------------------------------------------------------------------

    //Get Balance:
    useEffect (() => {

        if (auth.currentUser) {
 
            //Get Price:
            racerTokenContract.functions.price().then(function(priceRes) {

               let weiPrice = (parseInt(priceRes[0]._hex, 16));
               let ethPrice = weiPrice * 10 ** -18;

               setBasePrice(ethPrice.toString()); 
            })
            
            //Get Balance:
            racerTokenContract.functions.balanceOf(auth.currentUser.uid).then(function(balRes) {
                setBalance(balRes.toString()); 
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