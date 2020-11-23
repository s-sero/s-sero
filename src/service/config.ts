export const levelPrice:number = 5;
export const useCoin:string = "SERO";
export const address:string = "3ytHqPtQduynzGBT2iBL2R5t9gsdnPyRJ6DKg5M6Ui4cRwoCEXF3nGaJWo2HQC9PhE6ER4fXkjjZgDV3vrNCvSEG"

export const abi:any = [
    {
        "constant": false,
        "inputs": [],
        "name": "withdrawShare",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "LAST_LEVEL",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "idToAddress",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "info",
        "outputs": [
            {
                "components": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "referrer",
                        "type": "uint256"
                    },
                    {
                        "name": "partnersCount",
                        "type": "uint256"
                    },
                    {
                        "name": "x3Income",
                        "type": "uint256"
                    },
                    {
                        "name": "x6Income",
                        "type": "uint256"
                    },
                    {
                        "name": "activeS3Levels",
                        "type": "bool[]"
                    },
                    {
                        "name": "activeS6Levels",
                        "type": "bool[]"
                    },
                    {
                        "name": "dayReward",
                        "type": "uint256"
                    },
                    {
                        "name": "lastWithdrawTime",
                        "type": "uint256"
                    },
                    {
                        "name": "shareIncome",
                        "type": "uint256"
                    },
                    {
                        "name": "investAmount",
                        "type": "uint256"
                    }
                ],
                "name": "",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "user",
                "type": "address"
            }
        ],
        "name": "isUserExists",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "reInvest",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "detail",
        "outputs": [
            {
                "components": [
                    {
                        "name": "lastUserId",
                        "type": "uint256"
                    },
                    {
                        "name": "total",
                        "type": "uint256"
                    },
                    {
                        "name": "balance",
                        "type": "uint256"
                    },
                    {
                        "name": "cy",
                        "type": "string"
                    },
                    {
                        "name": "dayIndex",
                        "type": "uint256"
                    },
                    {
                        "name": "sharePool",
                        "type": "uint256"
                    },
                    {
                        "name": "totalShare",
                        "type": "uint256"
                    },
                    {
                        "name": "levelCountArr",
                        "type": "uint256[]"
                    }
                ],
                "name": "",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "ONEDAY",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "referrerAddress",
                "type": "address"
            }
        ],
        "name": "registrationExt",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "userAddress",
                "type": "address"
            },
            {
                "name": "level",
                "type": "uint8"
            }
        ],
        "name": "usersX3Matrix",
        "outputs": [
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "address[]"
            },
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "uint8[]"
            },
            {
                "name": "",
                "type": "uint8[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "x",
                "type": "bytes32"
            }
        ],
        "name": "bytes32ToString",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "userAddress",
                "type": "address"
            },
            {
                "name": "level",
                "type": "uint8"
            }
        ],
        "name": "usersX6Matrix",
        "outputs": [
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "address[]"
            },
            {
                "name": "",
                "type": "address[]"
            },
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "address"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "uint256"
            },
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "uint8[]"
            },
            {
                "name": "",
                "type": "uint8[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "levelCountArr",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "users",
        "outputs": [
            {
                "name": "id",
                "type": "uint256"
            },
            {
                "name": "referrer",
                "type": "address"
            },
            {
                "name": "partnersCount",
                "type": "uint256"
            },
            {
                "name": "x3Income",
                "type": "uint256"
            },
            {
                "name": "x6Income",
                "type": "uint256"
            },
            {
                "name": "lastWithdrawTime",
                "type": "uint256"
            },
            {
                "name": "shareIncome",
                "type": "uint256"
            },
            {
                "name": "investAmount",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "matrix",
                "type": "uint8"
            },
            {
                "name": "level",
                "type": "uint8"
            }
        ],
        "name": "buyNewLevel",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "userAddress",
                "type": "address"
            },
            {
                "name": "level",
                "type": "uint8"
            }
        ],
        "name": "findFreeX6Referrer",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "name": "levelPrice",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "userAddress",
                "type": "address"
            },
            {
                "name": "level",
                "type": "uint8"
            }
        ],
        "name": "findFreeX3Referrer",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "ownerAddress",
                "type": "address"
            },
            {
                "name": "addr1",
                "type": "address"
            },
            {
                "name": "addr2",
                "type": "address"
            },
            {
                "name": "addr3",
                "type": "address"
            },
            {
                "name": "addr4",
                "type": "address"
            },
            {
                "name": "addr5",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
];
