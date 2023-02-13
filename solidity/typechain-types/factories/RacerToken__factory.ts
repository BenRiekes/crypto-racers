/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../common";
import type { RacerToken, RacerTokenInterface } from "../RacerToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_racer",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "Minter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "Amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "Payment",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "Time",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "Reciever",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "Amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "Time",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "Sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "Reciever",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "Amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "Time",
        type: "uint256",
      },
    ],
    name: "TransferFrom",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
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
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_increase",
        type: "bool",
      },
    ],
    name: "editSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getSupply",
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
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserBalance",
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
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isCaller",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mintRacer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "price",
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
    inputs: [],
    name: "racer",
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
    inputs: [],
    name: "racerUtils",
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
        name: "_newCaller",
        type: "address",
      },
    ],
    name: "setCallers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_racer",
        type: "address",
      },
      {
        internalType: "address",
        name: "_racerUtils",
        type: "address",
      },
    ],
    name: "setContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newPrice",
        type: "uint256",
      },
    ],
    name: "setPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200186b3803806200186b8339818101604052810190620000379190620002c0565b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816003819055506001600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506001600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506001600560003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550670de0b6b3a7640000600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505062000307565b600080fd5b6000819050919050565b620002358162000220565b81146200024157600080fd5b50565b60008151905062000255816200022a565b92915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600062000288826200025b565b9050919050565b6200029a816200027b565b8114620002a657600080fd5b50565b600081519050620002ba816200028f565b92915050565b60008060408385031215620002da57620002d96200021b565b5b6000620002ea8582860162000244565b9250506020620002fd85828601620002a9565b9150509250929050565b61155480620003176000396000f3fe6080604052600436106100f35760003560e01c80638c3fee1c1161008a578063a035b1fe11610059578063a035b1fe1461031b578063a9059cbb14610346578063d8952a491461036f578063f2fde38b14610398576100f3565b80638c3fee1c146102825780638da5cb5b146102ab57806391b7f5ed146102d65780639b0842f3146102ff576100f3565b8063693ba294116100c6578063693ba294146101b25780636c9c2faf146101dd57806370a08231146102085780637ac07dcc14610245576100f3565b8063123203aa146100f857806323b872dd14610121578063299cfafa1461014a5780634773489214610175575b600080fd5b34801561010457600080fd5b5061011f600480360381019061011a9190610f6a565b6103c1565b005b34801561012d57600080fd5b5061014860048036038101906101439190610fcd565b6104b1565b005b34801561015657600080fd5b5061015f61067f565b60405161016c919061102f565b60405180910390f35b34801561018157600080fd5b5061019c60048036038101906101979190610f6a565b6106a5565b6040516101a99190611059565b60405180910390f35b3480156101be57600080fd5b506101c76106ee565b6040516101d4919061102f565b60405180910390f35b3480156101e957600080fd5b506101f2610714565b6040516101ff9190611059565b60405180910390f35b34801561021457600080fd5b5061022f600480360381019061022a9190610f6a565b61075b565b60405161023c9190611059565b60405180910390f35b34801561025157600080fd5b5061026c60048036038101906102679190610f6a565b610773565b604051610279919061108f565b60405180910390f35b34801561028e57600080fd5b506102a960048036038101906102a491906110d6565b610793565b005b3480156102b757600080fd5b506102c06108ea565b6040516102cd919061102f565b60405180910390f35b3480156102e257600080fd5b506102fd60048036038101906102f89190611116565b61090e565b005b61031960048036038101906103149190611116565b6109ad565b005b34801561032757600080fd5b50610330610b32565b60405161033d9190611059565b60405180910390f35b34801561035257600080fd5b5061036d60048036038101906103689190611143565b610b38565b005b34801561037b57600080fd5b5061039660048036038101906103919190611183565b610d02565b005b3480156103a457600080fd5b506103bf60048036038101906103ba9190610f6a565b610e2f565b005b3360011515600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610455576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161044c90611220565b60405180910390fd5b6001600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b3360011515600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610545576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161053c90611220565b60405180910390fd5b8161054f856106a5565b1015610590576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105879061128c565b60405180910390fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105df91906112db565b9250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610635919061130f565b925050819055507fb8895721a96e7143e20e31a604051b295ebcb698777a32baa88f5b904932b503848484426040516106719493929190611343565b60405180910390a150505050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905090565b60046020528060005260406000206000915090505481565b60056020528060005260406000206000915054906101000a900460ff1681565b3360011515600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610827576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161081e90611220565b60405180910390fd5b600115158215150361088e5782600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610882919061130f565b925050819055506108e5565b82600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546108dd91906112db565b925050819055505b505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b3360011515600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515146109a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161099990611220565b60405180910390fd5b816003819055505050565b600354816109bb9190611388565b34146109fc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109f390611416565b60405180910390fd5b80610a05610714565b1015610a46576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a3d90611482565b60405180910390fd5b80600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610a95919061130f565b9250508190555080600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610aeb91906112db565b925050819055507fb4c03061fb5b7fed76389d5af8f2e0ddb09f8c70d1333abbb62582835e10accb33823442604051610b2794939291906114a2565b60405180910390a150565b60035481565b3360011515600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610bcc576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bc390611220565b60405180910390fd5b81610bd5610714565b1015610c16576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c0d90611482565b60405180910390fd5b81600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610c65919061130f565b9250508190555081600460003073ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610cbb91906112db565b925050819055507f7fa9aafeb8bb803d77de5d84bc2f2edbd842ca91b20cd5020aa21dfe26ab0be9838342604051610cf5939291906114e7565b60405180910390a1505050565b3360011515600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610d96576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d8d90611220565b60405180910390fd5b82600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610e21836103c1565b610e2a826103c1565b505050565b3360011515600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610ec3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610eba90611220565b60405180910390fd5b816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610f3782610f0c565b9050919050565b610f4781610f2c565b8114610f5257600080fd5b50565b600081359050610f6481610f3e565b92915050565b600060208284031215610f8057610f7f610f07565b5b6000610f8e84828501610f55565b91505092915050565b6000819050919050565b610faa81610f97565b8114610fb557600080fd5b50565b600081359050610fc781610fa1565b92915050565b600080600060608486031215610fe657610fe5610f07565b5b6000610ff486828701610f55565b935050602061100586828701610f55565b925050604061101686828701610fb8565b9150509250925092565b61102981610f2c565b82525050565b60006020820190506110446000830184611020565b92915050565b61105381610f97565b82525050565b600060208201905061106e600083018461104a565b92915050565b60008115159050919050565b61108981611074565b82525050565b60006020820190506110a46000830184611080565b92915050565b6110b381611074565b81146110be57600080fd5b50565b6000813590506110d0816110aa565b92915050565b600080604083850312156110ed576110ec610f07565b5b60006110fb85828601610fb8565b925050602061110c858286016110c1565b9150509250929050565b60006020828403121561112c5761112b610f07565b5b600061113a84828501610fb8565b91505092915050565b6000806040838503121561115a57611159610f07565b5b600061116885828601610f55565b925050602061117985828601610fb8565b9150509250929050565b6000806040838503121561119a57611199610f07565b5b60006111a885828601610f55565b92505060206111b985828601610f55565b9150509250929050565b600082825260208201905092915050565b7f596f7520617265206e6f7420616e20617574686f72697a65642063616c6c6564600082015250565b600061120a6020836111c3565b9150611215826111d4565b602082019050919050565b60006020820190508181036000830152611239816111fd565b9050919050565b7f496e73756666696369656e742062616c616e6365000000000000000000000000600082015250565b60006112766014836111c3565b915061128182611240565b602082019050919050565b600060208201905081810360008301526112a581611269565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60006112e682610f97565b91506112f183610f97565b9250828203905081811115611309576113086112ac565b5b92915050565b600061131a82610f97565b915061132583610f97565b925082820190508082111561133d5761133c6112ac565b5b92915050565b60006080820190506113586000830187611020565b6113656020830186611020565b611372604083018561104a565b61137f606083018461104a565b95945050505050565b600061139382610f97565b915061139e83610f97565b92508282026113ac81610f97565b915082820484148315176113c3576113c26112ac565b5b5092915050565b7f45786163742076616c7565206578706563746564000000000000000000000000600082015250565b60006114006014836111c3565b915061140b826113ca565b602082019050919050565b6000602082019050818103600083015261142f816113f3565b9050919050565b7f496e73756666696369656e7420537570706c7900000000000000000000000000600082015250565b600061146c6013836111c3565b915061147782611436565b602082019050919050565b6000602082019050818103600083015261149b8161145f565b9050919050565b60006080820190506114b76000830187611020565b6114c4602083018661104a565b6114d1604083018561104a565b6114de606083018461104a565b95945050505050565b60006060820190506114fc6000830186611020565b611509602083018561104a565b611516604083018461104a565b94935050505056fea2646970667358221220f1d460f14dc0e4b88b0b18d6fc78aeae89a2b4f3a38d4d0c375e96e24fb9d41f64736f6c63430008110033";

type RacerTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: RacerTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class RacerToken__factory extends ContractFactory {
  constructor(...args: RacerTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _price: PromiseOrValue<BigNumberish>,
    _racer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<RacerToken> {
    return super.deploy(_price, _racer, overrides || {}) as Promise<RacerToken>;
  }
  override getDeployTransaction(
    _price: PromiseOrValue<BigNumberish>,
    _racer: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_price, _racer, overrides || {});
  }
  override attach(address: string): RacerToken {
    return super.attach(address) as RacerToken;
  }
  override connect(signer: Signer): RacerToken__factory {
    return super.connect(signer) as RacerToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RacerTokenInterface {
    return new utils.Interface(_abi) as RacerTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RacerToken {
    return new Contract(address, _abi, signerOrProvider) as RacerToken;
  }
}
