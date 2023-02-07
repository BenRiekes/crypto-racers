//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17; 

contract RacerToken {

    //Events: -------------------------

    event Mint (
        address Minter,
        uint256 Amount,
        uint256 Payment,
        uint256 Time
    ); 

    //Modifiers: ------------------------

    modifier onlyOwner (address _caller) {
        require (_caller == owner, "You are not the owner of this contract"); 
        _;
    }

    modifier onlyCaller (address _caller) {
        require (isCaller[_caller] == true, "You are not an authorized called"); 
        _; 
    }

    //State: ---------------------------------

    address public owner; 
    uint256 public price;
    uint256 public supply = balanceOf[address(this)]; 

    constructor (uint256 _price) {
        owner = msg.sender; 
        price = _price; 

        balanceOf[address(this)] = 10 ** 18;  
    }

    mapping (address => uint256) public balanceOf;
    mapping (address => bool) public isCaller; 

    //Functions: ----------------------------

    function mintRacer (uint256 _amount) public payable {
        require (msg.value == _amount * price, "Exact value expected"); 
        require (supply >= _amount, "Insufficient Supply"); 
        
        balanceOf[msg.sender] += _amount;
        balanceOf[address(this)] -= _amount;

        emit Mint (msg.sender, _amount, msg.value, block.timestamp);  
    }

    function transfer (address _to, uint256 _amount) public onlyCaller (msg.sender) {
        require (supply >= _amount, "Insufficient Supply"); 

        balanceOf[_to] += _amount; 
        balanceOf[address(this)] -= _amount; 
    }

    function transferFrom (address _from, address _to, uint256 _amount) public onlyCaller (msg.sender) {
        require(balanceOf[_from] >= _amount, "Insufficient balance"); 

        balanceOf[_from] -= _amount; 
        balanceOf[_to] += _amount; 
    }

    //Setters: ------------------------

    function setPrice (uint256 _newPrice) external onlyOwner (msg.sender) {
        price = _newPrice; 
    }

    function editSupply (uint256 _amount, bool _increase) external onlyOwner (msg.sender) {

        if (_increase == true) {
            balanceOf[address(this)] += _amount; 

        } else {
            balanceOf[address(this)] -= _amount; 
        }
    }

    function editCallers (address[] memory _callers, bool _add) external onlyOwner (msg.sender) { 

        for (uint i = 0; i <= _callers.length; i++) {
            isCaller[_callers[i]] = _add; 
        }
    }

    function transferOwnership (address _newOwner) public onlyOwner (msg.sender) {
        owner = _newOwner; 
    }

    //Getters: -------------------------

    function getSupply () public view returns (uint256) {
        return balanceOf[address(this)]; 
    }

    function getBalance () public view returns (uint256) {
        return address(this).balance; 
    }

    //Withdrawl: ----------------------

    function withdraw () public onlyOwner (msg.sender) {
        payable(msg.sender).transfer(address(this).balance); 
    }
}