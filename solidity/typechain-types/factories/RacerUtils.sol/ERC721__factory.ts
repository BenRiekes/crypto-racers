/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { ERC721, ERC721Interface } from "../../RacerUtils.sol/ERC721";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002894380380620028948339818101604052810190620000379190620001f6565b8160009081620000489190620004c6565b5080600190816200005a9190620004c6565b505050620005ad565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620000cc8262000081565b810181811067ffffffffffffffff82111715620000ee57620000ed62000092565b5b80604052505050565b60006200010362000063565b9050620001118282620000c1565b919050565b600067ffffffffffffffff82111562000134576200013362000092565b5b6200013f8262000081565b9050602081019050919050565b60005b838110156200016c5780820151818401526020810190506200014f565b60008484015250505050565b60006200018f620001898462000116565b620000f7565b905082815260208101848484011115620001ae57620001ad6200007c565b5b620001bb8482856200014c565b509392505050565b600082601f830112620001db57620001da62000077565b5b8151620001ed84826020860162000178565b91505092915050565b6000806040838503121562000210576200020f6200006d565b5b600083015167ffffffffffffffff81111562000231576200023062000072565b5b6200023f85828601620001c3565b925050602083015167ffffffffffffffff81111562000263576200026262000072565b5b6200027185828601620001c3565b9150509250929050565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620002ce57607f821691505b602082108103620002e457620002e362000286565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200034e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200030f565b6200035a86836200030f565b95508019841693508086168417925050509392505050565b6000819050919050565b6000819050919050565b6000620003a7620003a16200039b8462000372565b6200037c565b62000372565b9050919050565b6000819050919050565b620003c38362000386565b620003db620003d282620003ae565b8484546200031c565b825550505050565b600090565b620003f2620003e3565b620003ff818484620003b8565b505050565b5b8181101562000427576200041b600082620003e8565b60018101905062000405565b5050565b601f82111562000476576200044081620002ea565b6200044b84620002ff565b810160208510156200045b578190505b620004736200046a85620002ff565b83018262000404565b50505b505050565b600082821c905092915050565b60006200049b600019846008026200047b565b1980831691505092915050565b6000620004b6838362000488565b9150826002028217905092915050565b620004d1826200027b565b67ffffffffffffffff811115620004ed57620004ec62000092565b5b620004f98254620002b5565b620005068282856200042b565b600060209050601f8311600181146200053e576000841562000529578287015190505b620005358582620004a8565b865550620005a5565b601f1984166200054e86620002ea565b60005b82811015620005785784890151825560018201915060208501945060208101905062000551565b8683101562000598578489015162000594601f89168262000488565b8355505b6001600288020188555050505b505050505050565b6122d780620005bd6000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb46514610224578063b88d4fde14610240578063c87b56dd1461025c578063e985e9c51461028c576100cf565b80636352211e146101a657806370a08231146101d657806395d89b4114610206576100cf565b806301ffc9a7146100d457806306fdde0314610104578063081812fc14610122578063095ea7b31461015257806323b872dd1461016e57806342842e0e1461018a575b600080fd5b6100ee60048036038101906100e99190611614565b6102bc565b6040516100fb919061165c565b60405180910390f35b61010c61039e565b6040516101199190611707565b60405180910390f35b61013c6004803603810190610137919061175f565b610430565b60405161014991906117cd565b60405180910390f35b61016c60048036038101906101679190611814565b610476565b005b61018860048036038101906101839190611854565b61058d565b005b6101a4600480360381019061019f9190611854565b6105ed565b005b6101c060048036038101906101bb919061175f565b61060d565b6040516101cd91906117cd565b60405180910390f35b6101f060048036038101906101eb91906118a7565b610693565b6040516101fd91906118e3565b60405180910390f35b61020e61074a565b60405161021b9190611707565b60405180910390f35b61023e6004803603810190610239919061192a565b6107dc565b005b61025a60048036038101906102559190611a9f565b6107f2565b005b6102766004803603810190610271919061175f565b610854565b6040516102839190611707565b60405180910390f35b6102a660048036038101906102a19190611b22565b6108bc565b6040516102b3919061165c565b60405180910390f35b60007f80ac58cd000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061038757507f5b5e139f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b80610397575061039682610950565b5b9050919050565b6060600080546103ad90611b91565b80601f01602080910402602001604051908101604052809291908181526020018280546103d990611b91565b80156104265780601f106103fb57610100808354040283529160200191610426565b820191906000526020600020905b81548152906001019060200180831161040957829003601f168201915b5050505050905090565b600061043b826109ba565b6004600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60006104818261060d565b90508073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036104f1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104e890611c34565b60405180910390fd5b8073ffffffffffffffffffffffffffffffffffffffff16610510610a05565b73ffffffffffffffffffffffffffffffffffffffff16148061053f575061053e81610539610a05565b6108bc565b5b61057e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161057590611cc6565b60405180910390fd5b6105888383610a0d565b505050565b61059e610598610a05565b82610ac6565b6105dd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105d490611d58565b60405180910390fd5b6105e8838383610b5b565b505050565b610608838383604051806020016040528060008152506107f2565b505050565b60008061061983610e54565b9050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff160361068a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161068190611dc4565b60405180910390fd5b80915050919050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610703576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106fa90611e56565b60405180910390fd5b600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606001805461075990611b91565b80601f016020809104026020016040519081016040528092919081815260200182805461078590611b91565b80156107d25780601f106107a7576101008083540402835291602001916107d2565b820191906000526020600020905b8154815290600101906020018083116107b557829003601f168201915b5050505050905090565b6107ee6107e7610a05565b8383610e91565b5050565b6108036107fd610a05565b83610ac6565b610842576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161083990611d58565b60405180910390fd5b61084e84848484610ffd565b50505050565b606061085f826109ba565b6000610869611059565b9050600081511161088957604051806020016040528060008152506108b4565b8061089384611070565b6040516020016108a4929190611eb2565b6040516020818303038152906040525b915050919050565b6000600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b6109c38161113e565b610a02576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f990611dc4565b60405180910390fd5b50565b600033905090565b816004600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff16610a808361060d565b73ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b600080610ad28361060d565b90508073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161480610b145750610b1381856108bc565b5b80610b5257508373ffffffffffffffffffffffffffffffffffffffff16610b3a84610430565b73ffffffffffffffffffffffffffffffffffffffff16145b91505092915050565b8273ffffffffffffffffffffffffffffffffffffffff16610b7b8261060d565b73ffffffffffffffffffffffffffffffffffffffff1614610bd1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bc890611f48565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610c40576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c3790611fda565b60405180910390fd5b610c4d838383600161117f565b8273ffffffffffffffffffffffffffffffffffffffff16610c6d8261060d565b73ffffffffffffffffffffffffffffffffffffffff1614610cc3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cba90611f48565b60405180910390fd5b6004600082815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556001600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550816002600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550808273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4610e4f83838360016112a5565b505050565b60006002600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610eff576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ef690612046565b60405180910390fd5b80600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610ff0919061165c565b60405180910390a3505050565b611008848484610b5b565b611014848484846112ab565b611053576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161104a906120d8565b60405180910390fd5b50505050565b606060405180602001604052806000815250905090565b60606000600161107f84611432565b01905060008167ffffffffffffffff81111561109e5761109d611974565b5b6040519080825280601f01601f1916602001820160405280156110d05781602001600182028036833780820191505090505b509050600082602001820190505b600115611133578080600190039150507f3031323334353637383961626364656600000000000000000000000000000000600a86061a8153600a8581611127576111266120f8565b5b049450600085036110de575b819350505050919050565b60008073ffffffffffffffffffffffffffffffffffffffff1661116083610e54565b73ffffffffffffffffffffffffffffffffffffffff1614159050919050565b600181111561129f57600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16146112135780600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461120b9190612156565b925050819055505b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161461129e5780600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254611296919061218a565b925050819055505b5b50505050565b50505050565b60006112cc8473ffffffffffffffffffffffffffffffffffffffff16611585565b15611425578373ffffffffffffffffffffffffffffffffffffffff1663150b7a026112f5610a05565b8786866040518563ffffffff1660e01b81526004016113179493929190612213565b6020604051808303816000875af192505050801561135357506040513d601f19601f820116820180604052508101906113509190612274565b60015b6113d5573d8060008114611383576040519150601f19603f3d011682016040523d82523d6000602084013e611388565b606091505b5060008151036113cd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113c4906120d8565b60405180910390fd5b805181602001fd5b63150b7a0260e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161491505061142a565b600190505b949350505050565b600080600090507a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008310611490577a184f03e93ff9f4daa797ed6e38ed64bf6a1f0100000000000000008381611486576114856120f8565b5b0492506040810190505b6d04ee2d6d415b85acef810000000083106114cd576d04ee2d6d415b85acef810000000083816114c3576114c26120f8565b5b0492506020810190505b662386f26fc1000083106114fc57662386f26fc1000083816114f2576114f16120f8565b5b0492506010810190505b6305f5e1008310611525576305f5e100838161151b5761151a6120f8565b5b0492506008810190505b612710831061154a5761271083816115405761153f6120f8565b5b0492506004810190505b6064831061156d5760648381611563576115626120f8565b5b0492506002810190505b600a831061157c576001810190505b80915050919050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b6000604051905090565b600080fd5b600080fd5b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6115f1816115bc565b81146115fc57600080fd5b50565b60008135905061160e816115e8565b92915050565b60006020828403121561162a576116296115b2565b5b6000611638848285016115ff565b91505092915050565b60008115159050919050565b61165681611641565b82525050565b6000602082019050611671600083018461164d565b92915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156116b1578082015181840152602081019050611696565b60008484015250505050565b6000601f19601f8301169050919050565b60006116d982611677565b6116e38185611682565b93506116f3818560208601611693565b6116fc816116bd565b840191505092915050565b6000602082019050818103600083015261172181846116ce565b905092915050565b6000819050919050565b61173c81611729565b811461174757600080fd5b50565b60008135905061175981611733565b92915050565b600060208284031215611775576117746115b2565b5b60006117838482850161174a565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006117b78261178c565b9050919050565b6117c7816117ac565b82525050565b60006020820190506117e260008301846117be565b92915050565b6117f1816117ac565b81146117fc57600080fd5b50565b60008135905061180e816117e8565b92915050565b6000806040838503121561182b5761182a6115b2565b5b6000611839858286016117ff565b925050602061184a8582860161174a565b9150509250929050565b60008060006060848603121561186d5761186c6115b2565b5b600061187b868287016117ff565b935050602061188c868287016117ff565b925050604061189d8682870161174a565b9150509250925092565b6000602082840312156118bd576118bc6115b2565b5b60006118cb848285016117ff565b91505092915050565b6118dd81611729565b82525050565b60006020820190506118f860008301846118d4565b92915050565b61190781611641565b811461191257600080fd5b50565b600081359050611924816118fe565b92915050565b60008060408385031215611941576119406115b2565b5b600061194f858286016117ff565b925050602061196085828601611915565b9150509250929050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6119ac826116bd565b810181811067ffffffffffffffff821117156119cb576119ca611974565b5b80604052505050565b60006119de6115a8565b90506119ea82826119a3565b919050565b600067ffffffffffffffff821115611a0a57611a09611974565b5b611a13826116bd565b9050602081019050919050565b82818337600083830152505050565b6000611a42611a3d846119ef565b6119d4565b905082815260208101848484011115611a5e57611a5d61196f565b5b611a69848285611a20565b509392505050565b600082601f830112611a8657611a8561196a565b5b8135611a96848260208601611a2f565b91505092915050565b60008060008060808587031215611ab957611ab86115b2565b5b6000611ac7878288016117ff565b9450506020611ad8878288016117ff565b9350506040611ae98782880161174a565b925050606085013567ffffffffffffffff811115611b0a57611b096115b7565b5b611b1687828801611a71565b91505092959194509250565b60008060408385031215611b3957611b386115b2565b5b6000611b47858286016117ff565b9250506020611b58858286016117ff565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680611ba957607f821691505b602082108103611bbc57611bbb611b62565b5b50919050565b7f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560008201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b6000611c1e602183611682565b9150611c2982611bc2565b604082019050919050565b60006020820190508181036000830152611c4d81611c11565b9050919050565b7f4552433732313a20617070726f76652063616c6c6572206973206e6f7420746f60008201527f6b656e206f776e6572206f7220617070726f76656420666f7220616c6c000000602082015250565b6000611cb0603d83611682565b9150611cbb82611c54565b604082019050919050565b60006020820190508181036000830152611cdf81611ca3565b9050919050565b7f4552433732313a2063616c6c6572206973206e6f7420746f6b656e206f776e6560008201527f72206f7220617070726f76656400000000000000000000000000000000000000602082015250565b6000611d42602d83611682565b9150611d4d82611ce6565b604082019050919050565b60006020820190508181036000830152611d7181611d35565b9050919050565b7f4552433732313a20696e76616c696420746f6b656e2049440000000000000000600082015250565b6000611dae601883611682565b9150611db982611d78565b602082019050919050565b60006020820190508181036000830152611ddd81611da1565b9050919050565b7f4552433732313a2061646472657373207a65726f206973206e6f74206120766160008201527f6c6964206f776e65720000000000000000000000000000000000000000000000602082015250565b6000611e40602983611682565b9150611e4b82611de4565b604082019050919050565b60006020820190508181036000830152611e6f81611e33565b9050919050565b600081905092915050565b6000611e8c82611677565b611e968185611e76565b9350611ea6818560208601611693565b80840191505092915050565b6000611ebe8285611e81565b9150611eca8284611e81565b91508190509392505050565b7f4552433732313a207472616e736665722066726f6d20696e636f72726563742060008201527f6f776e6572000000000000000000000000000000000000000000000000000000602082015250565b6000611f32602583611682565b9150611f3d82611ed6565b604082019050919050565b60006020820190508181036000830152611f6181611f25565b9050919050565b7f4552433732313a207472616e7366657220746f20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b6000611fc4602483611682565b9150611fcf82611f68565b604082019050919050565b60006020820190508181036000830152611ff381611fb7565b9050919050565b7f4552433732313a20617070726f766520746f2063616c6c657200000000000000600082015250565b6000612030601983611682565b915061203b82611ffa565b602082019050919050565b6000602082019050818103600083015261205f81612023565b9050919050565b7f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560008201527f63656976657220696d706c656d656e7465720000000000000000000000000000602082015250565b60006120c2603283611682565b91506120cd82612066565b604082019050919050565b600060208201905081810360008301526120f1816120b5565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061216182611729565b915061216c83611729565b925082820390508181111561218457612183612127565b5b92915050565b600061219582611729565b91506121a083611729565b92508282019050808211156121b8576121b7612127565b5b92915050565b600081519050919050565b600082825260208201905092915050565b60006121e5826121be565b6121ef81856121c9565b93506121ff818560208601611693565b612208816116bd565b840191505092915050565b600060808201905061222860008301876117be565b61223560208301866117be565b61224260408301856118d4565b818103606083015261225481846121da565b905095945050505050565b60008151905061226e816115e8565b92915050565b60006020828403121561228a576122896115b2565b5b60006122988482850161225f565b9150509291505056fea2646970667358221220f87cc3fd454ce969c8167ce1039167d8357182a77816a62ffde5fa1391724a9c64736f6c63430008110033";

type ERC721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721__factory extends ContractFactory {
  constructor(...args: ERC721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC721>;
  }
  override getDeployTransaction(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  override attach(address: string): ERC721 {
    return super.attach(address) as ERC721;
  }
  override connect(signer: Signer): ERC721__factory {
    return super.connect(signer) as ERC721__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721Interface {
    return new utils.Interface(_abi) as ERC721Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC721 {
    return new Contract(address, _abi, signerOrProvider) as ERC721;
  }
}
