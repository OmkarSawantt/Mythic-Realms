
# Mythic Realms

Mythic Realms brings the excitement of strategic card battles to Web3, enabling players to truly own their digital assets


## Features

- **Blockchain Integration**: Smart contracts handle game logic and ensure secure NFT ownership on the Avalanche network.
- **NFT Cards**: Each card is a tradeable NFT with unique attributes and rarity levels.
- **Multiplayer Battles**: Compete against players worldwide in skill-based card battles.
- **Web3 Authentication**: Securely connect your wallet to manage assets and participate in battles.



## Tech Stack

### Frontend

- **React.js** – For building the user interface
- **Tailwind CSS** – For styling
- **Ethers.js** – For blockchain interaction
### Backend
- **Node.js** – For server-side logic
- **Hardhat** – For smart contract development and deployment
- **Solidity** – For writing smart contracts

## Getting Started

Follow these instructions to set up and run the project locally.
### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Avalanche Wallet

### Installation

1. **Clone the Repository**:
```bash
git clone https://github.com/OmkarSawantt/Mythic-Realms.git
cd Mythic-Realms
```
2. **Install Dependencies for Smart Contracts**:
```bash
cd web3
```
```bash
npm install
```
or
```bash
yarn install
```  
3. **Compile Smart Contracts**:
```bash
npx hardhat compile
```
4. **Deploy Smart Contracts**:
Update the deployment script with your wallet credentials and  network configuration, then run
```bash
npx hardhat run scripts/deploy.js --network avalanche
```

5. **Install Dependencies for Frontend**:
```bash
cd client
```
```bash
npm install
```
or
```bash
yarn install
```  
6. **Start the Frontend**:
```bash
npm start
```
or
```bash
yarn start
```  
## Usage
- Connect Wallet: Use the "Connect Wallet" button to link your Avalanche wallet.
- Mint Cards: Mint new NFT cards to add to your collection.
- Battle: Challenge other players to real-time battles using your NFT cards.
## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the [MIT License.](https://choosealicense.com/licenses/mit/)
