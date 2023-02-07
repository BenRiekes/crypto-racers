//React:
import React, { createContext } from "react";
import { Route, Routes } from "react-router-dom"; 

//Components:
import Navbar from "./components/Navbar";

//Pages: 
import Home from "./pages/Home"; 
import Profile from "./pages/Profile"; 

//Web3
import { ChainId, ConnectWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import MultiplayerMatchmaking from "./pages/MultiplayerMatchmaking";
import { RaceContext } from "./utils/RaceData";
import Match from "./pages/Match";

function App() {

  return (

    <>
      
      <ThirdwebProvider

        authConfig = {{
          authUrl: `/api/auth`,
          domain: "example.com",
          loginRedirect: ``
        }}

        desiredChainId = {5}
      >
        <Navbar/>
        
        <div>
          <RaceContext.Provider value={null}>
            <Routes>
              <Route path = "/" element = {<Home />} />
              <Route path = "/Profile" element = {<Profile />} />
              <Route path="/matchmaking" element={<MultiplayerMatchmaking/>} />
              <Route path="/match" element={<Match/>} />
            </Routes>
          </RaceContext.Provider>
        </div>
        
        
      </ThirdwebProvider>

    </>

    

  ) 
}


export default App;
