import { ethers } from 'hardhat';
import console from 'console';

// const _metadataUri = 'https://gateway.pinata.cloud/ipfs/QmX2ubhtBPtYw75Wrpv6HLb1fhbJqxrnbhDo1RViW3oVoi';
const _metadataUri = 'https://gateway.pinata.cloud/ipfs/bafybeiarr2ykkjmzvnbc3rftd5ggxwsvvwgalrh5wchx5zhs2e65q67ybm';

async function deploy(name: string, ...params: [string]) {
  const contractFactory = await ethers.getContractFactory(name);

  return await contractFactory.deploy(...params, { gasLimit: 5000000 }).then((f: any) => f.deployed());

}

async function main() {
  try {

    const [admin] = await ethers.getSigners();

    console.log(`Deploying a smart contract...`);

    const MythicRealms = (await deploy('MythicRealms', _metadataUri)).connect(admin);

    console.log({ MythicRealms: MythicRealms.address });
  } catch (error) {
    console.log(error);

  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  });
