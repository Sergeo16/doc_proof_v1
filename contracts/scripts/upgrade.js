const { ethers, upgrades } = require("hardhat");

async function main() {
  const proxyAddress = process.env.DOC_PROOF_PROXY_ADDRESS;
  if (!proxyAddress) {
    throw new Error("DOC_PROOF_PROXY_ADDRESS not set in .env");
  }

  const DocProofV2 = await ethers.getContractFactory("DocProof");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, DocProofV2);

  console.log("DocProof upgraded to:", await upgraded.getAddress());
  console.log(
    "New implementation:",
    await upgrades.erc1967.getImplementationAddress(proxyAddress)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
