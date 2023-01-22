import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from '@chakra-ui/react';

export default function SignInModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const address = useAddress();

    return (
        <>
            <Button onClick={onOpen}>Sign In</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign In</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <p>Sign in with your wallet</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button>Sign in</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}