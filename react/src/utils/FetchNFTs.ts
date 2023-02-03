import env from "react-dotenv";

const endpoint = env.ALCHEMY_ENDPOINT_URL;

const FetchAddressNFTs = async (address: any, contractAddress: any) => {

   
    let retryAttempts = 1; 

    if (retryAttempts === 5) {
        return; 
    }

    if (address) {

        let data; 

        try {

            if (contractAddress !== 0) {
                data = await fetch (`${endpoint}/getNFTs?owner=${address}&contractAddresses%5B%5D=${contractAddress}`).then (data => data.json()); 

            } else {
                data = await fetch(`${endpoint}/getNFTs?owner=${address}`).then(data => data.json()); 
            }

        } catch (error) {
            retryAttempts++; 
            FetchAddressNFTs(address, contractAddress); 
        }

        return data; 
    }
}

const FetchMetaData = async (NFTS: any) => {

    const NFTMetadata = await Promise.allSettled (NFTS.map(async (NFT: any) => {

        const metadata = await fetch(`${endpoint}/getNFTMetadata?contractAddress=${NFT.contract.address}&tokenId=${NFT.id.tokenId}`,)
        .then(data => data.json()); 

        let imageUrl; 

        if (metadata.media[0].gateway) {
            imageUrl = metadata.media[0].gateway;

        } else {
            //Firebase Storage - change later:
           imageUrl = "https://firebasestorage.googleapis.com/v0/b/crypto-racers.appspot.com/o/StarterBackgrounds%2Fmoonlight-preview-big.png?alt=media&token=f8c70bdd-707a-4113-9ac7-80f6ff2e1a5b";
        }

        //Return Metadata:
        return {
            id: NFT.id.tokenId,
            contractAddress: NFT.contract.address,
            image: imageUrl,
            title: metadata.metadata.name,
            description: metadata.metadata.description,
            attributes: metadata.metadata.attributes
        }

    }))

    return NFTMetadata; 
}

const fetchNFTs = async (address: any, contractAddress: any) => {

    const data = await FetchAddressNFTs(address, contractAddress);
    
    if (data.ownedNfts.length) {

        const NFTs = await FetchMetaData(data.ownedNfts); 

        let fullfilledNFTs = NFTs.filter(NFT => NFT.status === "fulfilled");

        console.log(fullfilledNFTs);

        return fullfilledNFTs; 

    } else {
        console.log("error"); 
        return null;
    }
}

export {fetchNFTs};