//React:
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; 

//Components:
import Navbar from "./components/Navbar.jsx";

//Pages: 
import Home from "./pages/Home.tsx"; 
import Profile from "./pages/Profile.tsx"; 

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

      <Navbar />

      <Router>
      
        <Routes>

          <Route path = '/' element = {<Home />} />
          <Route path = '/' element = {<Profile />} />
        </Routes>

      </Router>

      </ThirdwebProvider>

    </>

    

  ) 
}



/*

*/

export default App;
