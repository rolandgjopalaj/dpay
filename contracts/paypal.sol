// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract paypal {

    address public owner;

    constructor(){
        owner = msg.sender;
    }

    struct request {
        address requestor;
        uint256 amount;
        string message;
        string name;
    }

    struct sendReceive {
        string action;
        uint256 amount;
        string message;
        address otherPartyAddress;
        string otherPartyName;
    }

    struct userName {
        string name;
        bool hasName;
    }

    mapping(address => userName) names;
    mapping(address  => request[]) requests;
    mapping(address  => sendReceive[]) history;

    function getMyRequests(address me) public view returns(address[] memory, uint256[] memory, string[] memory, string[] memory){
        

        address[] memory addrs = new address[](requests[me].length);
        uint256[] memory amnt = new uint256[](requests[me].length);
        string[] memory msge = new string[](requests[me].length);
        string[] memory name = new string[](requests[me].length);
        
        for (uint i = 0; i < requests[me].length; i++) {
            request storage myRequests = requests[me][i];
            addrs[i] = myRequests.requestor;
            amnt[i] = myRequests.amount;
            msge[i] = myRequests.message;
            name[i] = myRequests.name;
        }
        
        return (addrs, amnt, msge, name);

    }

    function getMyHistory(address me) public view returns(sendReceive[] memory){
        return history[me];
    }

    function getMyName(address me) public view returns(userName memory){
        return names[me];
    }

    function addName(string memory _name) public {
        userName storage newUserName = names[msg.sender];
        newUserName.name = _name;
        newUserName.hasName = true;
    }

    function createRequest(address user, uint256 _amount, string memory _message) public {
        request memory newRequest;
        newRequest.requestor = msg.sender;
        newRequest.amount = _amount;
        newRequest.message = _message;
        if(names[msg.sender].hasName){
            newRequest.name = names[msg.sender].name;
        }
        requests[user].push(newRequest);

    }

    function payRequest(uint256 _request) public payable {
        require(_request < requests[msg.sender].length, "No Such Request");
        request[] storage myRequests = requests[msg.sender];
        request storage payableRequest = myRequests[_request];
        
        uint256 toPay = payableRequest.amount * 1000000000000000000;
        require(msg.value == (toPay), "Pay Correct Amount");

        payable(payableRequest.requestor).transfer(msg.value);

        addHistory(msg.sender, payableRequest.requestor, payableRequest.amount, payableRequest.message);

        myRequests[_request] = myRequests[myRequests.length-1];
        myRequests.pop();
    }

    function addHistory(address sender, address receiver, uint256 _amount, string memory _message) private {
        sendReceive memory newSend;
        newSend.action = "Send";
        newSend.amount = _amount;
        newSend.message = _message;
        newSend.otherPartyAddress = receiver;
         if(names[receiver].hasName){
            newSend.otherPartyName = names[receiver].name;
        }
        history[sender].push(newSend);

        sendReceive memory newReceive;
        newReceive.action = "Receive";
        newReceive.amount = _amount;
        newReceive.message = _message;
        newReceive.otherPartyAddress = sender;
         if(names[sender].hasName){
            newReceive.otherPartyName = names[sender].name;
        }
        history[receiver].push(newReceive);

    }

}