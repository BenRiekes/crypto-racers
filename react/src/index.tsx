import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';



//Coinbase | WalletConnect | Injected
import { ethers } from "ethers"; 
import { ChakraProvider } from '@chakra-ui/react';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(

  <React.StrictMode>

    <BrowserRouter>
    

      <ChakraProvider>
        <App />
      </ChakraProvider>

    </BrowserRouter>
    
  </React.StrictMode>
    
);
