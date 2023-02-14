import { Card, CardBody, Heading, Modal, Image, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure, Button, useToast, Menu, MenuButton, MenuList, MenuItem, Breadcrumb, BreadcrumbItem, BreadcrumbLink, background, Badge } from "@chakra-ui/react";
import { mdiAccount, mdiAccountCircle, mdiAccountCircleOutline, mdiChevronDoubleDown, mdiLoading, mdiSkull } from "@mdi/js";
import Icon from "@mdi/react";
import { Unsubscribe } from "firebase/auth";
import { collection, doc, DocumentData, DocumentSnapshot, FirestoreError, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, functions } from "../utils/Firebase";
import { BettingPoolCardProps, RaceData } from "../utils/Types";

interface MatchmakingModalProps {
    trackName: string;
    description: string;
    image: string;
}

interface TrackParticipantData {
    address: string;
    displayName: string;
    car: string;
    ready: boolean;
}

export default function MatchmakingModal({ trackName, description, image }: MatchmakingModalProps) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const racerContext = useContext(RaceContext);

    const [blockModalClose, setBlockModalClose] = useState(false);

    const [userCar, setUserCar] = useState("");

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

    const [matchmakingDocUnsub, setMatchmakingDocUnsub] = useState<Unsubscribe | null>(null);
    const [matchmakingDocData, setMatchmakingDocData] = useState<DocumentData | null>(null);
    const [opponentAddress, setOpponentAddress] = useState<string | null>(null);
    const [opponentCar, setOpponentCar] = useState<string | null>(null);
    const [opponentDisplayName, setOpponentDisplayName] = useState<string | null>(null);
    
    const [isMatched, setIsPrematch] = useState(false);
    const [matchedRaceData, setMatchedRaceData] = useState<RaceData | null>(null);
    const [matchedRaceUnsub, setMatchedRaceUnsub] = useState<Unsubscribe | null>(null);
    const [playerNumber, setPlayerNumber] = useState(0);
    const [matchDocId, setMatchDocId] = useState<string | null>(null);
    const [snap, setSnap] = useState<DocumentSnapshot | null>(null);
    // const [setRContext] = useState(racerContext);

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
            console.log(result);
            if (result === undefined) {
                fail("No result returned");
            }
            setIsLoading(false);
            setMatchmakingActive(true);
            console.log("*")
            // listen to matchmaking doc
            const matchmakingDocRef = doc(db, `matchmaking/${auth.currentUser?.uid}`);
            const matchmakingDocUnsub = onSnapshot(matchmakingDocRef, (doc) => {
                if (doc.exists()) {
                    setMatchmakingDocData(doc.data());
                }
            });
            setMatchmakingDocUnsub(matchmakingDocUnsub);
        })
        .catch((err: any) => {
            fail(err);
        })
    }

    function checkMatchmakingStatus() {
        if (!matchmakingActive) return;
        if (isMatched) return;
        const checkMatchmakingStatusFunction = httpsCallable(functions, 'checkMatchmakingStatus');
        checkMatchmakingStatusFunction()
        .then((result) => {
            console.log(result);
            const data = result.data;
            if (result === undefined) {
                fail("No result returned");
            }
            if (typeof(data) === "string" && !(data == "NoMatchFound")) {
                console.log(`Matchmaking success: ${data}`);
                // setMatchmakingActive(false);
                clearInterval(matchmakingCheckInterval as NodeJS.Timeout);
                clearInterval(timerInterval as NodeJS.Timeout);
                // setMatchmakingCheckInterval(null);
                setIsPrematch(true);
                setMatchDocId(data);

                const matchedRaceDocRef = doc(db, `activeRaces/${data}`);
                const matchedRaceUnsub = onSnapshot(matchedRaceDocRef, (doc) => {
                    setSnap(doc);
                });

                // data is the doc id for race
                // add a firestore listener

                // setMatchedRaceData(data as RaceData);
            }
        })
        .catch((err: any) => {
            fail(err);
        })
    }

    async function dropFromMatchmaking() {
        if (!window.confirm("Are you sure you want to cancel matchmaking?")) return;
        setIsLoading(true);
        console.log("A");
        setMatchmakingActive(false);
        const dropFromMatchmakingFunction = httpsCallable(functions, 'dropFromMatchmaking');
        dropFromMatchmakingFunction()
        .then(() => {
            if (matchmakingDocUnsub) (matchmakingDocUnsub as Unsubscribe)();
            reset(true);
        })
        .catch((err: any) => {
            window.alert("Something went wrong. Please reload the page and try again.");
            fail(err);
        });
    }

    function reset(loading: boolean) {
        setIsLoading(loading);
        setIsError(false);
        setMatchmakingActive(false);
        setCurrentPlayers(0);
        setAvgWaitTime(0);
        setTimer(0);
        setSelectedBettingPool(null);
        clearInterval(timerInterval as NodeJS.Timeout);
        clearInterval(matchmakingCheckInterval as NodeJS.Timeout);
        // setTimerInterval(null);
        // setMatchmakingCheckInterval(null);
        setMatchedRaceData(null);
        setIsPrematch(false);
        setBlockModalClose(false);
        
        if (matchedRaceUnsub) matchedRaceUnsub();
        setMatchedRaceUnsub(null);

        getTrackBettingPools();
    }

    function fail(reason: any) {
        console.error(`Error:\n${reason}`);
        setIsError(true);
        setIsLoading(false);
        setMatchmakingActive(false);
        setMatchmakingDocData(null);
        clearInterval(matchmakingCheckInterval as NodeJS.Timeout);
        clearInterval(timerInterval as NodeJS.Timeout);
        // setTimerInterval(null);
        // setMatchmakingCheckInterval(null);
        setBlockModalClose(false);

        if (matchedRaceUnsub) matchedRaceUnsub();
        setMatchedRaceUnsub(null);

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
        console.log("isMatched", isMatched);
    }, [])
    const navigate = useNavigate();
    useEffect(() => {
        if (snap && snap.exists()) {
            console.log(snap.data());
            const data = snap.data() as RaceData;
            setMatchedRaceData(data);
            // if both players are ready, navigate to prematch
            console.log(data.players);
            if (data.players["0"].isReady && data.players["1"].isReady) {
                setReadyButtonLoading(true);
                setQuitButtonLoading(true);
                setTimeout(() => { navigate(`/match`) }, 2500);
            }
        }
    }, [snap]);

    useEffect(() => { // [matchmakingActive, isOpen]
        console.log(matchmakingActive, isOpen)
        if (!isOpen || !matchmakingActive) {
            setTimer(0);
            clearInterval(timerInterval as NodeJS.Timeout);
            clearInterval(matchmakingCheckInterval as NodeJS.Timeout);
            // setTimerInterval(null);
            setBlockModalClose(false);
            return;
        }
    
        if (matchmakingActive) {
            setMatchmakingCheckInterval(setInterval(() => {
                checkMatchmakingStatus();
            }, 2500));
        }

        if (!isOpen) return;

        setBlockModalClose(true);

        setTimerInterval(setInterval(() => {
            setTimer(timer => timer + 1);
        }, 1000));

    }, [matchmakingActive, isOpen])

    useEffect(() => {
        if (!isMatched) return;
        console.log(1);
        
        clearInterval(matchmakingCheckInterval as NodeJS.Timeout);
    }, [isMatched])

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
    }, [isError]);

    useEffect(() => { // [matchedRaceData]
        clearInterval(matchmakingCheckInterval as NodeJS.Timeout);
        clearInterval(timerInterval as NodeJS.Timeout);
        // setMatchmakingCheckInterval(null);
        // setTimerInterval(null);
        if (!matchedRaceData) return;
        setOpponentAddress(matchedRaceData.playerAddresses[playerNumber]);
        setOpponentDisplayName(playerNumber === 1 ? matchedRaceData.player2DisplayName : matchedRaceData.player1DisplayName);
        setOpponentCar(playerNumber === 1 ? matchedRaceData.player2Car : matchedRaceData.player1Car);
    }, [matchedRaceData]);

    useEffect(() => { // [matchmakingDocData]
        if (!matchmakingDocData && isMatched) {
            toast({
                title: "Match cancelled",
                description: "The other player cancelled the match.",
                status: "info",
                duration: 5000,
                isClosable: true,
                variant: 'left-accent',
            })
            reset(true);
            return;
        }
        loadParticipantDatas();
    }, [matchmakingDocData]);

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
                        reset(true);
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

    const [trackParticipantDatas, setTrackParticipantDatas] = useState<TrackParticipantData[]>([]);

    function truncateAddress(address: string): string {
        return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
    }

    function loadParticipantDatas() {
        const number = matchedRaceData?.playerAddresses[0] === auth.currentUser?.uid ? 0 : 1;

        // grab from current user
        const playerOne: TrackParticipantData = {
            address: auth.currentUser?.uid || "",
            displayName: auth.currentUser?.displayName || truncateAddress(auth.currentUser?.uid || ""),
            car: userCar,
            ready: matchedRaceData?.players[number].isReady || false,
        };

        // grab data from matchData
        // look at matchData.players, if 0th index is user, then current user is player 1
        // else current user is player 2
        setPlayerNumber(number);
        const opponentIndex = matchedRaceData?.playerAddresses[0] === auth.currentUser?.uid ? 1 : 0;
        const opponentAddress = matchedRaceData?.playerAddresses[opponentIndex];
        let opponentDisplayName: string;
        let opponentCar: string;
        let opponentIsReady: boolean;
        if (opponentIndex === 0) {
            opponentDisplayName = matchedRaceData?.player1DisplayName || truncateAddress(opponentAddress || "");
            opponentCar = matchedRaceData?.player1Car || "";
            opponentIsReady = matchedRaceData?.players[0].isReady || false;
        } else {
            opponentDisplayName = matchedRaceData?.player2DisplayName || truncateAddress(opponentAddress || "");
            opponentCar = matchedRaceData?.player2Car || "";
            opponentIsReady = matchedRaceData?.players[1].isReady || false; 
        }

        const playerTwo: TrackParticipantData = {
            address: opponentAddress || "",
            displayName: opponentDisplayName,
            car: opponentCar,
            ready: opponentIsReady || false,
        };

        setTrackParticipantDatas([playerOne, playerTwo]);
    }

    function TrackParticipantData() {
        if (!matchedRaceData) return null;
        return (
        <>
            <div className="flex flex-row w-1/2 ">
                {Object.values(matchedRaceData?.players).map((participantData, index) => {
                    console.log(`Index ${index}`)
                    console.log(`participantData: ${participantData.isReady}`)
                    return (
                        <div className="flex basis-1/2 flex-col" key={index}>
                            <div className="flex">
                                <Icon path={mdiAccountCircleOutline} size={1} />
                                <p>{truncateAddress(participantData.address)}</p>
                                <Badge ml={2} colorScheme={participantData.isReady ? "green" : "red"}>
                                    {participantData.isReady ? "Ready" : "Not Ready"}
                                </Badge>
                            </div>
                            {
                                index === 0 ?
                                (
                                    <>
                                    <p>{matchedRaceData.player1Car}</p>
                                    </>
                                ) :
                                (
                                    <>
                                    <p>{matchedRaceData.player2Car}</p>
                                    </>
                                )
                            }
                        </div>
                    )
                })
                }
            </div>
        </>
        )

    }

    const [isReady, setIsReady] = useState(false);
    const [readyButtonLoading, setReadyButtonLoading] = useState(false);

    function ReadyButton() {
        async function setReady() {
            const matchReadyUp = httpsCallable(functions, "matchReadyUp");
            setReadyButtonLoading(true);
            const result = await matchReadyUp({ isReady: !isReady })
            .catch((error) => {
                console.log(error);
                setReadyButtonLoading(false);
            });
            console.log(result);
            setIsReady(!isReady)
            setReadyButtonLoading(false);
        }
        return (
            <Button
                colorScheme={isReady ? "red" : "green"} 
                isLoading={readyButtonLoading}
                onClick={setReady}
            >
                {isReady ? "Unready" : "Ready"}
            </Button>
        )
    }

    const [quitButtonLoading, setQuitButtonLoading] = useState(false);

    function QuitMatchedButton() {
        async function quit() {
            if (!window.confirm("Are you sure you want to quit the match?")) return;
            const cancelFunc = httpsCallable(functions, "matchCancel");
            setQuitButtonLoading(true);
            const result = await cancelFunc()
            .catch((error) => {
                console.log(error);
                setQuitButtonLoading(false);
                return;
            });
            console.log(result);
            setQuitButtonLoading(false);
            if (matchedRaceUnsub) (matchedRaceUnsub as Unsubscribe)();
            reset(true);
        }

        return (
            <Button
                colorScheme="red"
                isLoading={quitButtonLoading}
                onClick={quit}
                ml={2}
            >
                Quit Match
            </Button>
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
                    <ModalHeader className="align-middle">
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='#'>
                                    Matchmaking
                                </BreadcrumbLink> 
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='#'>
                                    {trackName}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                        {trackName} 
                        <Image className="w-32" src={image} alt={trackName} />
                    </ModalHeader>
                    <ModalCloseButton isDisabled={blockModalClose} />
                    <ModalBody>

                        <LoadingOrError />

                        {isMatched ? (
                        <>
                        <TrackParticipantData />
                        <ReadyButton />
                        <QuitMatchedButton />
                        </>
                        ) : (
                        <>

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
                                    <BettingPoolCard key={index} {...bettingPool} />
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
                        </>
                        )
                        }

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}