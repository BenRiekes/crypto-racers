import React, { useEffect, useState } from "react";
// import "./PageStyles.css";
import "../Tailwind.css"
import Icon from "@mdi/react";
import { Button, Card, CardBody, Heading, Image } from "@chakra-ui/react";
import MatchmakingModal from "../components/MatchmakingModal";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../utils/Firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Track } from "../utils/Types";
import { mdiLoading } from "@mdi/js";

export default function MultiplayerMatchmaking() {
    const [tracks, setTracks] = useState<Track[]>([]);

    async function getTracks() {
        const ref = collection(db, "tracks");
        const snapshot = await getDocs(ref);
        const newTracks: Track[] = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const track = {
                name: doc.id,
                description: data.description,
                image: data.image,
                currentPlayers: 0,
                avgWaitTime: 0
            }
            newTracks.push(track);
        });
        setTracks(newTracks);
    }

    useEffect(() => {
        getTracks();
    }, []);

    return (
        <div className="bg-slate-600 w-full h-screen">
            <div className="flex flex-col justify-center items-center align-middle text-center">
                <h1 className="text-stone-50 flex text-2xl font-bold mt-2">Matchmaking</h1>

                <div className="flex justify-center align-middle flex-wrap">
                    {
                        tracks.length === 0 ?
                        <>
                        <Icon path={mdiLoading} color="white" className="animate-spin" size={1}/>
                        <p className="animate-pulse text-white">Loading...</p>
                        </>
                        :
                        tracks.map((track, index) =>
                            <MatchmakingModal key={index} trackName={track.name} description={track.description} image={track.image} />
                        )
                    }
                </div>
            </div>
        </div>
    );
}