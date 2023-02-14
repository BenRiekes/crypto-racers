import { useToast } from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Unity, useUnityContext } from "react-unity-webgl";
import { auth } from "../utils/Firebase";

export default function Match() {
    const toast = useToast();
    const navigate = useNavigate();
    const { unityProvider, sendMessage, addEventListener } = useUnityContext({
        loaderUrl: "/CR-WebGL/Build/CR-WebGL.loader.js",
        dataUrl: "/CR-WebGL/Build/CR-WebGL.data",
        frameworkUrl: "/CR-WebGL/Build/CR-WebGL.framework.js",
        codeUrl: "/CR-WebGL/Build/CR-WebGL.wasm",
    });

    const [raceTime, setRaceTime] = useState(0);
    const [raceFinished, setRaceFinished] = useState(false);

    const handleRaceFinished = useCallback(() => {
        setTimeout(() => {
            navigate("/postmatch");
        }, 2500);
    }, []);
    
    useEffect(() => {
        // console.log(raceData);
        // if (!raceData) {
        //     toast({
        //         title: "Error 😭",
        //         description: "Couldn't find your match. Please try again later or contact support.",
        //         status: "error",
        //         variant: "left-accent",
        //         duration: 9000,
        //         isClosable: true,
        //     });
        // }

    }, []);

    useEffect(() => {
        addEventListener("RaceFinished", handleRaceFinished);
    }, [addEventListener]);

    useEffect(() => {
        async function sendMessages() {
            let authToken = await auth.currentUser?.getIdToken();
            sendMessage("Web3Manager", "SetToken", ["0xa64e726fA379fB5575700D8266E90a3eb0B5DBF9", "1", "0x90dC3e116a0751d29B2b31Bf711FEF52863C9e86"]);
            sendMessage("Networking", "SetToken", authToken);
            sendMessage("Player", "SendSheet", 0);
        }
        sendMessages();
    }, [sendMessage]);

    return (
        <div className="h-screen w-screen bg-slate-600 flex justify-center items-center">
            <Unity style={{width: "900px", height: "600px"}} unityProvider={unityProvider} />
        </div>
    )
}