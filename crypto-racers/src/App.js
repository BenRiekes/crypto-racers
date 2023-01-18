import { Button } from "@chakra-ui/react";
import { ConnectWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import SignInModal from "./components/SignInModal.tsx";


function App() {
  return (
    <div>
      <ThirdwebProvider desiredChainId={80001} >
        <h1>hello, world</h1>
        <SignInModal/>
        <ConnectWallet/>
      </ThirdwebProvider>
    </div>
  );
}

export default App;
