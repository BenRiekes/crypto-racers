//React:
import React from "react";
import { Route, Routes } from "react-router-dom"; 

//Components:
import Navbar from "./components/Navbar";

//Pages: 
import Home from "./pages/Home"; 
import Profile from "./pages/Profile"; 

//Web3
import { ChainId, ConnectWallet, ThirdwebProvider } from "@thirdweb-dev/react";




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

          <Routes>
          
            <Route path = "/" element = {<Home />} />
            <Route path = "/Profile" element = {<Profile />} />
          </Routes>
        </div>
        
        
      </ThirdwebProvider>

    </>

    

  ) 
}


export default App;
