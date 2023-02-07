import React, { useContext, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { RaceContext } from "../utils/RaceData";

export default function Match() {

    const raceData = useContext(RaceContext);
    const { unityProvider } = useUnityContext({
        loaderUrl: "/CR-WebGL/Build/CR-WebGL.loader.js",
        dataUrl: "/CR-WebGL/Build/CR-WebGL.data",
        frameworkUrl: "/CR-WebGL/Build/CR-WebGL.framework.js",
        codeUrl: "/CR-WebGL/Build/CR-WebGL.wasm",
    });
    
    useEffect(() => {
        console.log(raceData);
    }, [])

    return (
        <div className="h-screen w-screen bg-slate-600 flex justify-center items-center">
            <Unity style={{width: "900px", height: "600px"}} unityProvider={unityProvider} />
        </div>
    )
}