//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17; 

import "./RacerStorage.sol"; 

contract RacerCreate is RacerStorage {

    //Constructor: --------------------

    address public racerStorage; 

    constructor (address _racerStorage) {
        racerStorage = _racerStorage; 
    }

    //Create functions: ---------------

    //Create Car:
    function createCar (string[] memory _uris, string[] memory _nameDesc, uint256 _price, uint8 _paymentMethod) public {

        //Requires: 
        require (bytes(_nameDesc[0]).length <= 50, "Name cannot exceed 50 bytes.");
        require (bytes(_nameDesc[1]).length <= 280, "Description cannot exceed 280 bytes.");

        //Payment Reqs:
        require (_price > 0, "Price must be > 0"); 
        require (_paymentMethod == 0 || _paymentMethod == 1, "Not a valid payment method"); 
        
        racerStorage.call (
            abi.encodeWithSignature("setCar(string[],string[],uint256,uint8)",
                _uris, _nameDesc, _price, _paymentMethod
            )
        );
    }
}
