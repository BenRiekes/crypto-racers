//Web3:
import { WalletLinkConnector } from  "@web3-react/walletlink-connector"; 
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

//Injected (metamask): 
const injected = new InjectedConnector ({
    supportedChainIds: [80001]
}); 

//Wallet Connect: 
const walletconnect = new WalletConnectConnector ({
    rpcUrl: `https://mainnet.infura.io/v3/5acbf00b69984933a9dff433646e1064`,
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
}); 

//Coinbase:
const walletlink = new WalletLinkConnector ({
    url: `https://mainnet.infura.io/v3/5acbf00b69984933a9dff433646e1064`,
    appName: "Crypto Racing",
    supportedChainIds: [80001],
}); 
  

export const connectors = {
    injected: injected,
    walletConnect: walletconnect,
    coinbaseWallet: walletlink
}; 