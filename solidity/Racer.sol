//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17; 


contract Racer {  

    //Events: -------------------------------------
    event CarMinted (uint256 TokenID, uint256 CarID, address Owner, 
        string URI, uint256[] Stats, uint256 Time
    );

    event StatsUpdated (uint256 TokenID, uint256[] NewStats,uint256 AmountPayed,
        address Updater, uint256 Time
    );

    event RaceCompleted (uint256 RaceID, address Winner, address Loser, 
        uint256 WinnerToken, uint256 LoserToken, uint256 Prize, uint256 Time
    );


    //Access Control: ----------------------------

    modifier onlyCaller (address _caller) {
        require (IsCaller[_caller] == true || _caller == racerUtils || _caller == owner, "Access denied"); 
        _; 
    }

    modifier tokenOwner (address _caller, uint256 _tokenID) {
        require (IDToToken[_tokenID].tokenID == _tokenID, "Token does not exist");
        require (IDToToken[_tokenID].owner == _caller, "You do not own this token");
        _;
    }

    //Struct Data: --------------------------------
    struct Car {
        uint256 carID; 
        string name; string desc; string uri;
        uint256[] tokens; uint256 supply; uint256 price;

        bool onMarket; uint8 paymentMethod;   
    }

    struct Token { // 0 = speed | 1 = accel | 2 = torque | 3 = drift | 4 = weight
        address owner; 
        uint256 tokenID; uint256 carID; string uri;
        uint256[] stats; uint256 wins; uint256 losses; uint256 price; 

        bool onMarket; uint8 paymentMethod;  
    }

    struct Race {
        uint256 raceID; 
        string name; string desc; 
        uint256 entryFee; uint256 prize; uint256 plays; bool active;  
    }

    //State data: -----------------------------------------

    constructor () {
        owner = msg.sender; 
    }

    Car[] public cars;
    Token[] public tokens;
    Race[] public races;  

    //Struct pointers
    mapping (uint256 => Car) public IDToCar; 
    mapping (uint256 => Token) public IDToToken;
    mapping (uint256 => Race) public IDToRace;

    //Key Val Conditional
    mapping (address => bool) public IsCaller;  
    mapping (address => bool) public claimedFree;

    address public owner; 
    address public racerUtils;
    address public racerToken;  

    //Callable functions: ------------------------------------------------------------------------

    //Mint
    function mint (uint256 _carID, uint256 _amount) external payable {

        require (IDToCar[_carID].carID > 0 && IDToCar[_carID].carID == _carID, "Car does not exist"); 
        require (IDToCar[_carID].supply >= _amount, "Not enough supply");
        require (IDToCar[_carID].onMarket == true, "Car is not for sale");  

        address minter = msg.sender; 

        if (IDToCar[_carID].paymentMethod == 1 && claimedFree[minter] == true) {
            require (msg.value == IDToCar[_carID].price * _amount, "Insufficient Matic"); 
        } 

        //Assign param nums:
        uint256[] memory paramNums = new uint256[](3);
        paramNums[0] = _carID; 
        paramNums[1] = IDToCar[_carID].price; 

        if (claimedFree[minter] == false) {
            paramNums[2] = 1;
        } else {
            paramNums[2] = _amount;
        }
        
        (bool mintCar, ) = racerUtils.call (
            abi.encodeWithSignature (
                "mintCar(address,uint256[],uint8,string,bool)",
                minter, paramNums, IDToCar[_carID].paymentMethod, IDToCar[_carID].uri, claimedFree[minter]
            )
        );
        require (mintCar, "Mint execution failed"); 
        
        claimedFree[minter] = true;  
    } 

    //Marketplace: ------------------------------------------------------------------------

    //List: ------------------------------------------------------------------------
    function listToken (uint256 _tokenID, uint256 _price, uint8 _paymentMethod) external tokenOwner (msg.sender, _tokenID) {
        require (_price > 0, "Invalid price"); 
        require (IDToToken[_tokenID].onMarket == false, "Token is already listed"); 
        require (_paymentMethod == 0 || _paymentMethod == 1, "Invalid payment option");

        IDToToken[_tokenID].price = _price;
        IDToToken[_tokenID].paymentMethod = _paymentMethod; 
        IDToToken[_tokenID].onMarket = true; 
    }


    //Delist: ------------------------------------------------------------------------
    function delistToken (uint256 _tokenID) external tokenOwner (msg.sender, _tokenID) {
        require (IDToToken[_tokenID].onMarket == true, "Token is not currently listed"); 
        IDToToken[_tokenID].onMarket = false; 
    }

    //Purchase: ------------------------------------------------------------------------
    function purchaseToken (uint256 _tokenID) external payable {
        require (IDToToken[_tokenID].tokenID == _tokenID, "Token does not exist");
        require (IDToToken[_tokenID].onMarket == true, "Token is not currently listed");
        require (IDToToken[_tokenID].owner != msg.sender, "Can not buy your own token");

        address buyer = msg.sender;  

        if (IDToToken[_tokenID].paymentMethod == 1) {
            require (msg.value == IDToToken[_tokenID].price, "Exact amount expected"); 
            payable(IDToToken[_tokenID].owner).transfer(msg.value); 
        }
        
        (bool tokenPurchased, ) = racerUtils.call(
            abi.encodeWithSignature(
                "purchaseToken(address,address,uint256,uint256,uint8)",
                IDToToken[_tokenID].owner, buyer, _tokenID, IDToToken[_tokenID].price, IDToToken[_tokenID].paymentMethod 
            )
        );
        require (tokenPurchased, "Insufficient Racer");
        

        IDToToken[_tokenID].owner = buyer; 
        IDToToken[_tokenID].onMarket = false; 
    }

    //------------------------------------------------------------------------

    //Token Stats:
    function updateTokenReq (uint256 _tokenID, uint256[] memory _newStats) external tokenOwner (msg.sender, _tokenID) {
 
        require (IDToToken[_tokenID].stats.length == _newStats.length, "Insufficient Param");
        address updater = msg.sender; 
        
        (bool updateTokenStats, ) = racerUtils.call(
            abi.encodeWithSignature(
                "updateTokenStats(address,uint256,uint256[],uint256[])",
                updater, _tokenID, IDToToken[_tokenID].stats, _newStats
            )
        );
        require (updateTokenStats, "Insufficient Racer");
    }

    function updateTokenFul (uint256 _tokenID, uint256 _cost, uint256[] memory _newStats) external onlyCaller (msg.sender) {

        IDToToken[_tokenID].stats = _newStats; 
        emit StatsUpdated (_tokenID, _newStats, _cost, IDToToken[_tokenID].owner, block.timestamp); 
    } 

    //------------------------------------------------------------------------

    //Race Data:
    function updateRace (uint256 _raceID, address _winner, address _loser, uint256 _winnerTokenID, uint256 _loserTokenID
    ) external onlyCaller (msg.sender) {

        require (IDToRace[_raceID].raceID == _raceID, "Race does not exist");
        require (IDToToken[_winnerTokenID].owner == _winner && IDToToken[_loserTokenID].owner == _loser, "Racers do not own these tokens"); 
        require (IDToToken[_winnerTokenID].tokenID == _winnerTokenID && IDToToken[_loserTokenID].tokenID == _loserTokenID, "Tokens do not exist"); 
      
        //Transfer Racer:
        (bool tokenTransfer, ) = racerToken.call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                _loser, _winner, IDToRace[_raceID].prize  
            )
        );
        require (tokenTransfer, "Transfer Error");

        //Struct Data update:
        IDToToken[_winnerTokenID].wins = IDToToken[_winnerTokenID].wins + 1;
        IDToToken[_loserTokenID].losses = IDToToken[_loserTokenID].losses + 1;
        IDToRace[_raceID].plays =  IDToRace[_raceID].plays + 1; 

        emit RaceCompleted (_raceID, _winner, _loser, _winnerTokenID, _loserTokenID, IDToRace[_raceID].prize, block.timestamp); 
    }

    //Create functions: ---------------------------------------------------------------------------

    function createCar (
        string memory _uri, string memory _name, string memory _desc, 
        uint256 _supply, uint256 _price, uint8 _paymentMethod
        
    ) external onlyCaller (msg.sender) {

        require (bytes(_name).length <= 50, "Name cannot exceed 50 bytes.");
        require (bytes(_desc).length <= 280, "Description cannot exceed 280 bytes.");
        require (_paymentMethod == 0 || _paymentMethod == 1, "Not a valid payment method"); 
        
        uint256 carID = cars.length + 1; 

        IDToCar[carID].carID = carID;
        IDToCar[carID].name = _name;
        IDToCar[carID].desc = _desc; 
        IDToCar[carID].uri = _uri; 
        IDToCar[carID].supply = _supply; 
        IDToCar[carID].onMarket = true; 
        IDToCar[carID].price = _price; 
        IDToCar[carID].paymentMethod = _paymentMethod; 

        cars.push(IDToCar[carID]);
    }

    //-------------------------------------------------

    function createRace (string memory _name, string memory _desc, uint256 _entryFee) external onlyCaller (msg.sender) {

        require (bytes(_name).length <= 50, "Name cannot exceed 50 bytes.");
        require (bytes(_desc).length <= 280, "Description cannot exceed 280 bytes.");

        uint256 id = races.length + 1; 

        IDToRace[id].raceID = id;
        IDToRace[id].name = _name;
        IDToRace[id].desc = _desc;
        IDToRace[id].entryFee = _entryFee; 
        IDToRace[id].prize = _entryFee * 2; 
        IDToRace[id].active = true;

        races.push(IDToRace[id]);  
    }

    //-------------------------------------------------

    uint256[] starterStats = [1, 1, 1, 1, 1];

    function createToken (address _minter, uint256 _carID, uint256[] calldata _tokenIDs, string memory _uri) external onlyCaller (msg.sender) {

        for (uint i = 0; i < _tokenIDs.length; i++) {

            uint256 id = _tokenIDs[i]; 

            //Token
            IDToToken[id].tokenID = _tokenIDs[i];
            IDToToken[id].carID = _carID; 

            IDToToken[id].owner = _minter; 
            IDToToken[id].uri = _uri; 
            IDToToken[id].stats = starterStats;

            //Car:
            IDToCar[_carID].tokens.push(id);
            IDToCar[_carID].supply = IDToCar[_carID].supply - 1;

            //State: 
            tokens.push(IDToToken[id]);


            emit CarMinted (id, _carID, _minter, _uri, starterStats, block.timestamp); 
        }
    }
    
    //Getter Functions: -----------------------------------------------------------------------------

    function getTokenStats (uint256 _tokenID) public view returns (uint256[] memory) {
        return IDToToken[_tokenID].stats; 
    }

    //Setter Functions: -----------------------------------------------------------------------------

    function setContracts (address _racerToken, address _racerUtils) external onlyCaller (msg.sender) {
        racerToken = _racerToken;  
        racerUtils = _racerUtils; 
    }

    function setCallers (address _newCaller) external onlyCaller (msg.sender) {
        IsCaller[_newCaller] = true; 
    }

    function setRaceAccess (uint256 _raceID, bool _active) external onlyCaller (msg.sender) {
        require (IDToRace[_raceID].raceID == _raceID, "Race Does not exist"); 
        IDToRace[_raceID].active = _active; 
    }

    function setCar (uint256 _carID, uint256 _supply, bool _onMarket) external onlyCaller (msg.sender) { 
        IDToCar[_carID].supply = _supply;
        IDToCar[_carID].onMarket = _onMarket; 
    }

    function withdrawl () external onlyCaller (msg.sender) { 
        payable(msg.sender).transfer(address(this).balance);
    }
}