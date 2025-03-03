import { ethers } from 'hardhat';
import console from 'console';

// The metadataURI should be valid - keep the working one
const _metadataUri = 'https://gateway.pinata.cloud/ipfs/bafybeiarr2ykkjmzvnbc3rftd5ggxwsvvwgalrh5wchx5zhs2e65q67ybm';

async function main() {
  try {
    const [admin] = await ethers.getSigners();

    console.log(`Deploying MythicRealms with account: ${admin.address}`);
    console.log(`Account balance: ${(await admin.getBalance()).toString()}`);

    // Get the contract factory
    const MythicRealmsFactory = await ethers.getContractFactory("MythicRealms");

    // Deploy with increased gas limit and wait for deployment
    console.log(`Deploying with metadata URI: ${_metadataUri}`);
    const mythicRealms = await MythicRealmsFactory.deploy(_metadataUri, {
      gasLimit: 8000000  // Increased gas limit
    });

    console.log("Waiting for deployment transaction to be mined...");
    await mythicRealms.deployed();

    console.log(`MythicRealms successfully deployed to: ${mythicRealms.address}`);
  } catch (error) {
    console.error("Deployment failed with error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error during deployment:", error);
    process.exit(1);
  });