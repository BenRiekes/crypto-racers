export const RacerABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "TokenID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "CarID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "Owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "URI",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "Stats",
                "type": "uint256[]"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "Time",
                "type": "uint256"
            }
        ],
        "name": "CarMinted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_uri",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_desc",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_supply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "_paymentMethod",
                "type": "uint8"
            }
        ],
        "name": "createCar",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_desc",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_entryFee",
                "type": "uint256"
            }
        ],
        "name": "createRace",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_minter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_carID",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "_tokenIDs",
                "type": "uint256[]"
            },
            {
                "internalType": "string",
                "name": "_uri",
                "type": "string"
            }
        ],
        "name": "createToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenID",
                "type": "uint256"
            }
        ],
        "name": "delistToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_price",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "_paymentMethod",
                "type": "uint8"
            }
        ],
        "name": "listToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_carID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenID",
                "type": "uint256"
            }
        ],
        "name": "purchaseToken",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "RaceID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "Winner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "Loser",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "WinnerToken",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "LoserToken",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "Prize",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "Time",
                "type": "uint256"
            }
        ],
        "name": "RaceCompleted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_newCaller",
                "type": "address"
            }
        ],
        "name": "setCallers",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_carID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_supply",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_onMarket",
                "type": "bool"
            }
        ],
        "name": "setCar",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_racerToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_racerUtils",
                "type": "address"
            }
        ],
        "name": "setContracts",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_raceID",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_active",
                "type": "bool"
            }
        ],
        "name": "setRaceAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "TokenID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256[]",
                "name": "NewStats",
                "type": "uint256[]"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "AmountPayed",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "Updater",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "Time",
                "type": "uint256"
            }
        ],
        "name": "StatsUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_raceID",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_winner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_loser",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_winnerTokenID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_loserTokenID",
                "type": "uint256"
            }
        ],
        "name": "updateRace",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_cost",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "_newStats",
                "type": "uint256[]"
            }
        ],
        "name": "updateTokenFul",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenID",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "_newStats",
                "type": "uint256[]"
            }
        ],
        "name": "updateTokenReq",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawl",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "cars",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "carID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "desc",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "supply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "onMarket",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "paymentMethod",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "claimedFree",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenID",
                "type": "uint256"
            }
        ],
        "name": "getTokenStats",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "IDToCar",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "carID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "desc",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "supply",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "onMarket",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "paymentMethod",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "IDToRace",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "raceID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "desc",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "entryFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "prize",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "plays",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "IDToToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "carID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "wins",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "losses",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "onMarket",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "paymentMethod",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "IsCaller",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "racerToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "racerUtils",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "races",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "raceID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "desc",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "entryFee",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "prize",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "plays",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "tokens",
        "outputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenID",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "carID",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "wins",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "losses",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "onMarket",
                "type": "bool"
            },
            {
                "internalType": "uint8",
                "name": "paymentMethod",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
