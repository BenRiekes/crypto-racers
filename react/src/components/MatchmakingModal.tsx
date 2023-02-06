import { Card, CardBody, Heading, Modal, Image, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Button, useToast, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { mdiChevronDoubleDown, mdiLoading, mdiSkull } from "@mdi/js";
import Icon from "@mdi/react";
import { collection, getDocs } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import React, { useEffect, useState } from "react";
import { db, functions } from "../utils/Firebase";
import type { BettingPoolCardProps } from "../utils/Types";

interface MatchmakingModalProps {
    trackName: string;
    description: string;
    image: string;
}

export default function MatchmakingModal({ trackName, description, image }: MatchmakingModalProps) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [matchmakingActive, setMatchmakingActive] = useState(false);
    const [currentPlayers, setCurrentPlayers] = useState(0);
    const [avgWaitTime, setAvgWaitTime] = useState(0);
    const [timer, setTimer] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [matchmakingCheckInterval, setMatchmakingCheckInterval] = useState<NodeJS.Timeout | null>(null);
    const [selectedBettingPool, setSelectedBettingPool] = useState<string | null>(null);
    const [bettingPools, setBettingPools] = useState<BettingPoolCardProps[]>([]);

    // ------------------------------
    // Functions

    async function getTrackBettingPools() {
        const docRef = collection(db, `tracks/${trackName}/betPools`);
        const docSnap = await getDocs(docRef);
        if (docSnap.empty) {
            console.error("No matching documents.");
            setIsError(true);
            return;
        }

        const bettingPools: BettingPoolCardProps[] = [];
        docSnap.forEach(doc => {
            const data = doc.data();
            bettingPools.push({
                trackName: trackName,
                bettingPoolName: data.name,
                bettingPoolEntryFee: data.entryFee,
                bettingPoolBet: data.bet,
                onClick: () => {
                    setSelectedBettingPool(doc.id);
                }
            });
        });

        setBettingPools(bettingPools);
        setIsLoading(false);
    }

    async function addToMatchmaking() {
        if (!selectedBettingPool) return;
        setIsLoading(true);
        

        const joinMatchmakingFunction = httpsCallable(functions, 'joinMatchmaking');
        joinMatchmakingFunction({ 
            userCar: "0x123123123",
            desiredRace: trackName,
            desiredBetPool: selectedBettingPool,
        })
        .then((result) => {
            if (result === undefined) {
                fail("No result returned");
            }
            setIsLoading(false);
            setMatchmakingActive(true);
            setMatchmakingCheckInterval(setInterval(() => {
                checkMatchmakingStatus();
            }, 2500));
        })
        .catch((err: any) => {
            fail(err);
        })
    }

    async function checkMatchmakingStatus() {
        const checkMatchmakingStatusFunction = httpsCallable(functions, 'checkMatchmakingStatus');
        checkMatchmakingStatusFunction()
        .then((result) => {
            console.log(result);
            // if (result === undefined) {
            //     fail("No result returned");
            // }
            // if (result.data === null) {
            //     setMatchmakingActive(false);
            //     return;
            // }
            // setCurrentPlayers(result.data.currentPlayers);
            // setAvgWaitTime(result.data.avgWaitTime);
            // setMatchmakingActive(true);
        })
        .catch((err: any) => {
            fail(err);
        })
    }

    async function dropFromMatchmaking() {
        if (!window.confirm("Are you sure you want to cancel matchmaking?")) return;
        setIsLoading(true);
        setMatchmakingActive(false);
        const dropFromMatchmakingFunction = httpsCallable(functions, 'dropFromMatchmaking');
        dropFromMatchmakingFunction()
        .then(() => {
            setIsLoading(false);
            setIsError(false);
        })
        .catch((err: any) => {
            window.alert("Something went wrong. Please reload the page and try again.");
            fail(err);
        });
    }

    function fail(reason: any) {
        console.error(`Error:\n${reason}`);
        setIsError(true);
        setIsLoading(false);
        setMatchmakingActive(false);
        clearInterval(matchmakingCheckInterval as NodeJS.Timeout);
        setMatchmakingCheckInterval(null);
        return;
    }

    function formatTimer() {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // ------------------------------
    // useEffects

    useEffect(() => { // []
        getTrackBettingPools();
    }, [])

    useEffect(() => { // [matchmakingActive, isOpen]
        if (!isOpen || !matchmakingActive) {
            setTimer(0);
            clearInterval(timerInterval as NodeJS.Timeout);
            setTimerInterval(null);
            return;
        }

        if (!isOpen) return;

        setTimerInterval(setInterval(() => {
            setTimer(timer => timer + 1);
        }, 1000));

    }, [matchmakingActive, isOpen])

    useEffect(() => { // [isError]
        console.log(isError)
        if (!isError) return;
        toast({
            title: "Error 😭",
            description: "An error occurred. Please try again later or contact support.",
            status: "error",
            duration: 5000,
            isClosable: true,
            variant: 'left-accent',
        })
        // setIsError(false);
    }, [isError])

    // ------------------------------
    // Subcomponents

    function LoadingOrError() {
        if (!isLoading && !isError) return null;
        if (isError) {
            return (
                <>
                    <Icon path={mdiSkull} size={1} />
                    <p>Something went wrong. Please try again later or contact support.</p>
                    <Button onClick={() => {
                        setIsError(false);
                        setIsLoading(true);
                        getTrackBettingPools();
                    }}>Reload Betting Pools</Button>
                </>
            )
        }
        return (
            <>
                <Icon path={mdiLoading} className="animate-spin" size={1} />
                <p className="animate-pulse">Loading...</p>
            </>

        )
    }

    function BettingPoolCard({ trackName, bettingPoolName, bettingPoolEntryFee, bettingPoolBet, onClick }: BettingPoolCardProps) {
        return (
            <>
                <Card 
                    onClick={() => { if(!matchmakingActive) setSelectedBettingPool(bettingPoolName) }}
                    className="m-3 hover-container cursor-pointer" 
                    maxW="md"
                    bgColor={selectedBettingPool === bettingPoolName ? "green.500" : "white"}
                >
                    <Heading ml={"2"}>{bettingPoolName}</Heading>
                    <CardBody>
                        <p>Entry Fee: <span className="font-bold">{bettingPoolEntryFee} RACER</span></p>
                        <p>Bet: <span className="font-bold">{bettingPoolBet} RACER</span></p>
                    </CardBody>
                </Card>
            </>
        )
    }

    // ------------------------------
    // Render

    return (
        <>
            <Card onClick={onOpen} className="cursor-pointer m-3 hover-container" maxW="md">
                <Heading>{trackName}</Heading>
                <CardBody>
                    <Image src={image} alt={trackName} />
                    <p>{description}</p>
                    <p>Current Players: <span className="font-bold">{currentPlayers}</span></p>
                    <p>Average Wait Time: <span className="font-bold">{avgWaitTime}</span></p>
                </CardBody>
            </Card>


            <Modal isOpen={isOpen} onClose={onClose} size="full">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader className="align-middle">{trackName} <Image className="w-32" src={image} alt={trackName} /></ModalHeader>
                    <ModalCloseButton isDisabled={matchmakingActive} />
                    <ModalBody>

                        <LoadingOrError />

                        <Menu>
                            <MenuButton as={Button} rightIcon={<Icon path={mdiChevronDoubleDown} size={1} />}>
                                Car
                            </MenuButton>
                            <MenuList>
                                <MenuItem>Car 1</MenuItem>
                                <MenuItem>Car 2</MenuItem>
                                <MenuItem>Car 3</MenuItem>
                            </MenuList>
                        </Menu>

                        {(matchmakingActive) ? (
                            <>
                                <BettingPoolCard {...bettingPools.find(bettingPool => bettingPool.bettingPoolName === selectedBettingPool) as BettingPoolCardProps} />
                                <p>Searching for a match...</p>
                                <p>Wait time: {formatTimer()}</p>
                                <Button onClick={dropFromMatchmaking}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                {isLoading || isError ? null :
                                <>
                                {bettingPools.map((bettingPool, index) => (
                                    <BettingPoolCard key={index} {...bettingPool} onClick={() => setSelectedBettingPool("a")} />
                                ))}
                                {
                                    selectedBettingPool === null ? (
                                        <p className="text-red-500">Please select a betting pool.</p>
                                    ) : <Button disabled={selectedBettingPool === null} onClick={addToMatchmaking}>Find Match</Button>
                                }
                                </>
                                }
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}