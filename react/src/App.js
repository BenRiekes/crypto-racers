import { Button } from "@chakra-ui/react";
import { ChainId, ConnectWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import { useEffect } from "react";
import SignInModal from "./components/SignInModal.tsx";
import { auth } from "./utils/Firebase.ts";


function App() {
  useEffect(() => {
    console.log(process.env.NODE_ENV)
  }, [])

  const auth = auth
  return (
    <div>
      <ThirdwebProvider desiredChainId={ChainId} >
        <h1>hello, world</h1>
        <SignInModal/>
        <ConnectWallet/>
      </ThirdwebProvider>
    </div>
  );
}

export default App;
