const { ethers, upgrades } = require("hardhat");

async function main() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error(
      "PRIVATE_KEY not set. Add your wallet private key to .env in the contracts folder.\n" +
        "Example: PRIVATE_KEY=0x..."
    );
  }

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account. Check PRIVATE_KEY in .env");
  }
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const DocProof = await ethers.getContractFactory("DocProof");
  const proxy = await upgrades.deployProxy(DocProof, [], {
    kind: "uups",
    initializer: "initialize",
  });

  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();

  console.log("DocProof Proxy deployed to:", proxyAddress);
  console.log("Implementation address:", await upgrades.erc1967.getImplementationAddress(proxyAddress));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
