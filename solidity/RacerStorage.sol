//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17; 



contract RacerStorage {  

    //Struct Data: --------------------------------

    struct Car {
        uint256 carID;

        string name;
        string desc;
        string[] uris;

        uint256[] tokens;
        uint256 supply;
        uint256 price;

        bool onMarket;
        uint8 paymentMethod;   
    }


    struct Token {
        address payable owner; 
        uint256 tokenID;
        uint256 carID; 
        string uri;

        // 0 = speed | 1 = accel | 2 = torque | 3 = drift | 4 = weight
        uint256[] stats;
        uint256 wins;
        uint256 losses;  

        uint256 price; 
        bool onMarket; 
        uint8 paymentMethod;  
    }

    //Arrays / Mappings: -----------------------------------------

    Car[] public cars;
    Token[] public tokens; 

    mapping (uint256 => Car) public IDToCar; 
    mapping (uint256 => Token) public IDToToken;
    mapping (address => bool) public claimedFree;  

    //Setter functions: ----------------------------------------

    //Set Car: 
    function setCar (string[] memory _uris, string[] memory _nameDesc, uint256 _price, uint8 _paymentMethod) public {

        uint256 carID = cars.length + 1; 

        IDToCar[carID].carID = carID;
        IDToCar[carID].name = _nameDesc[0];
        IDToCar[carID].desc = _nameDesc[1]; 

        IDToCar[carID].uris = _uris; 
        IDToCar[carID].supply = _uris.length; 

        IDToCar[carID].onMarket = true; 
        IDToCar[carID].price = _price; 

        IDToCar[carID].paymentMethod = _paymentMethod; 

        cars.push(IDToCar[carID]); 
    }

    //Set Token:
    uint256[] starterStats = [1, 1, 1, 1, 1]; 

    function setToken (uint256 _tokenID, uint256 _carID, address _owner, string memory _uri) public {

        //Token Struct Assign
        IDToToken[_tokenID].owner = payable(_owner);
        IDToToken[_tokenID].tokenID = _tokenID;
        IDToToken[_tokenID].carID = _carID;
        IDToToken[_tokenID].uri = _uri;
        IDToToken[_tokenID].stats = starterStats; 

        //Car Struct Assign
        IDToCar[_carID].tokens.push(_tokenID);
        IDToCar[_carID].supply = IDToCar[_carID].supply - 1; 

        //Push to state
        tokens.push(IDToToken[_tokenID]);     
    }

    //Getter functions: -------------------------------------

    function getCar (uint256 _carID) external view returns (Car memory) {
              
        return IDToCar[_carID]; 
    }
}