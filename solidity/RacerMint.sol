//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17; 

import "./RacerStorage.sol"; 
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract RacerMint is RacerStorage, ERC721URIStorage {

    //State: -----------------------------------------
 
    address public racerStorage;
      
    constructor (address _racerStorage) ERC721("Crypto Racers", "CR") {
        racerStorage = _racerStorage;
    }   

    //Functions: ----------------------------------------

    function getData (uint256 _carID, Car memory) public returns (Car memory) {

        //Calling:
        bytes memory payload = abi.encodeWithSignature("getCar(uint256)", _carID);

        (bool success, bytes memory result) = racerStorage.call(payload);

        //Return data:
        Car memory carRef = abi.decode(result, (Car)); 
        return carRef; 
    }   

}