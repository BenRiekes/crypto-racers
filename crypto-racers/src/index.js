import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './App';

//Coinbase | WalletConnect | Injected
import { ethers } from "ethers";
import { Web3ReactProvider } from '@web3-react/core'; 
import { Web3Provider } from "@ethersproject/providers"; 
import { ChakraProvider } from '@chakra-ui/react';

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling

  return library;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>

    <ChakraProvider>

      <Web3ReactProvider getLibrary = {getLibrary}>
        <App />
      </Web3ReactProvider>

    </ChakraProvider>

  </React.StrictMode>
    
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
