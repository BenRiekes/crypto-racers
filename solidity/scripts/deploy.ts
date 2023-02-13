import { ethers } from "hardhat";

async function main() {
    const [owner] = await ethers.getSigners();

    const Racer = await ethers.getContractFactory("Racer");
    const RacerToken = await ethers.getContractFactory("RacerToken");
    const RacerUtils = await ethers.getContractFactory("RacerUtils");

    const racer = await Racer.deploy();
    await racer.deployed();
    const racerToken = await RacerToken.deploy(1, racer.address);
    await racerToken.deployed();
    const racerUtils = await RacerUtils.deploy(racer.address, racerToken.address, 10);
    await racerUtils.deployed();

    console.log("Racer deployed to:", racer.address);
    console.log("RacerToken deployed to:", racerToken.address);
    console.log("RacerUtils deployed to:", racerUtils.address);

    await racer.setContracts(racerToken.address, racerUtils.address);
    await racerToken.setContracts(racer.address, racerUtils.address);
    await racerUtils.setContracts(racer.address, racerToken.address);
    
    console.log("Contracts set");

    await racer.createCar(
      "https://ipfs.io/ipfs/QmVorzJ7gxKEK5aK4NcUq1jwjZqvi8RvrKESbFSUkHeCvU",
      "Red Racer",
      "Red",
      100,
      1,
      0
    );

    const car = await racer.cars(0);
    console.log("Car created:\n", car, "\n");

    await racerUtils.mintCar(
      owner.address,
      [1,1,1],
      0,
      'https://ipfs.io/ipfs/QmVorzJ7gxKEK5aK4NcUq1jwjZqvi8RvrKESbFSUkHeCvU',
      false
    );

    const token = await racer.IDToToken(1);
    console.log("Token minted:\n", token, "\n");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});