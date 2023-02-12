//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17; 

contract RacerToken {

    //Events: -------------------------
    event Mint (address Minter, uint256 Amount, uint256 Payment, uint256 Time);
    
    event Transfer (address Reciever, uint256 Amount, uint256 Time);
    event TransferFrom (address Sender, address Reciever, uint256 Amount, uint256 Time);   

    //Modifiers: ------------------------
    modifier onlyCaller (address _caller) {
        require (isCaller[_caller] == true, "You are not an authorized called"); 
        _; 
    }

    //State: ---------------------------------
    constructor (uint256 _price, address _racer) {
        owner = msg.sender;
        racer = _racer;  
        price = _price; 

        isCaller[_racer] = true; 
        isCaller[msg.sender] = true; 
        isCaller[address(this)] = true; 

        balanceOf[address(this)] = 10 ** 18;  
    }

    address public owner; 
    address public racer;
    address public racerUtils; 
    uint256 public price;

    mapping (address => uint256) public balanceOf;
    mapping (address => bool) public isCaller; 

    //Functions: ----------------------------

    function mintRacer (uint256 _amount) public payable {
        require (msg.value == _amount * price, "Exact value expected"); 
        require (getSupply() >= _amount, "Insufficient Supply"); 
        
        balanceOf[msg.sender] += _amount;
        balanceOf[address(this)] -= _amount;

        emit Mint (msg.sender, _amount, msg.value, block.timestamp);  
    }

    //-------------------------------------------

    function transfer (address _to, uint256 _amount) external onlyCaller (msg.sender) {
        require (getSupply() >= _amount, "Insufficient Supply"); 

        balanceOf[_to] += _amount; 
        balanceOf[address(this)] -= _amount; 

        emit Transfer (_to, _amount, block.timestamp); 
    }

    function transferFrom (address _from, address _to, uint256 _amount) external onlyCaller (msg.sender) {
        require(getUserBalance(_from) >= _amount, "Insufficient balance"); 

        balanceOf[_from] -= _amount; 
        balanceOf[_to] += _amount;

        emit TransferFrom (_from, _to, _amount, block.timestamp);  
    }

    //Getters: -------------------------

    function getSupply () public view returns (uint256) {
        return balanceOf[address(this)]; 
    }

    function getUserBalance (address _user) public view returns (uint256) {
        return balanceOf[_user]; 
    }

    //Setters: ------------------------

    function editSupply (uint256 _amount, bool _increase) external onlyCaller (msg.sender) {

        if (_increase == true) {
            balanceOf[address(this)] += _amount; 

        } else {
            balanceOf[address(this)] -= _amount; 
        }
    }

    function setPrice (uint256 _newPrice) external onlyCaller (msg.sender) {
        price = _newPrice; 
    }

    function setCallers (address _newCaller) public onlyCaller (msg.sender) { 
        isCaller[_newCaller] = true; 
    }

    function setContracts (address _racer, address _racerUtils) external onlyCaller (msg.sender) {
        racer = _racer;
        racerUtils = _racerUtils;

        setCallers(_racer);
        setCallers(_racerUtils);  
    }

    function transferOwnership (address _newOwner) external onlyCaller (msg.sender) {
        owner = _newOwner; 
    }

    
}