# Decentralized Chat DApp

Welcome to the Decentralized Chat DApp branded `Chatzone`! This project aims to create a decentralized chat application using Ethereum blockchain and IPFS for secure profile image storage. Below you'll find information on the project structure, setup instructions, and how to contribute.

![Decentralized Chat DApp](https://github.com/Signor1/chatDapp-with-ens-ipfs-gasless/blob/68515becd36f881687d57035f167ea535e0093ee/Screenshot.png)


## Table of Contents

- [Decentralized Chat DApp](#decentralized-chat-dapp)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Contract Addresses](#contract-addresses)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Setup Instructions](#setup-instructions)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

This project is a decentralized chat application built on Ethereum blockchain and IPFS. Users can securely communicate with each other using smart contracts for messaging and IPFS for profile image storage. Gasless transactions are facilitated through a custom relayer service.

## Contract Addresses

### Polygon Amoy Testnet (Current)
  - **Network**: Polygon Amoy Testnet (Chain ID: 80002)
  - **ENS Contract**: Deploy using instructions below
  - **Chat Contract**: Deploy using instructions below
  - **Explorer**: https://amoy.polygonscan.com

### Previous Deployment (Sepolia)
  - [ENS Contract Address](https://sepolia.etherscan.io/address/0x882f1e69cd5e2c5c172bf1ab8c9c192d8f581211)
  - [Chat Contract Address](https://sepolia.etherscan.io/address/0xfbc211edebc6b2b7738fd934e265737b0750b4ee)

## Features

- **Decentralized Messaging:** Users can send and receive messages securely through Ethereum smart contracts.
- **Profile Image Storage:** Profile images are stored on IPFS, ensuring decentralized and censorship-resistant access.
- **Gasless Transactions:** Gasless transactions are supported via a custom relayer service, allowing users to interact with the DApp without holding ETH.
- **ENS Integration:** Ethereum Name Service (ENS) is integrated to provide human-readable usernames for users.

## Technologies Used

- **Polygon:** Polygon Amoy testnet for fast and cheap transactions
- **Solidity:** Smart contract programming language
- **Foundry:** Modern Ethereum development toolkit for testing and deployment
- **IPFS:** InterPlanetary File System (IPFS) for decentralized profile image storage
- **React + TypeScript:** Frontend user interface with type safety
- **Vite:** Fast frontend build tool
- **Ethers.js v6:** Blockchain interaction library
- **Web3Modal:** Wallet connection management
- **Express.js:** Custom relayer service for gasless transactions
- **Node.js:** Backend runtime environment

## Project Structure

The project is structured as follows:

- `contracts/`: Contains Solidity smart contracts for the chat application and other functionalities.
- `frontend/`: Contains the React.js frontend for the decentralized chat DApp.
- `myRelayer/`: Contains the Node.js backend for the custom relayer service.
- `README.md`: The README file you are currently reading.

## Setup Instructions

### Quick Start - Deploy to Polygon Amoy

1. **Get Test MATIC**: Visit https://faucet.polygon.technology/ and get Polygon Amoy test MATIC

2. **Setup and Deploy Contracts**:
   ```bash
   cd contract
   cp .env.example .env
   # Edit .env and add your PRIVATE_KEY
   forge build
   forge script script/Deploy.s.sol:DeployScript --rpc-url polygon_amoy --broadcast --verify
   ```

3. **Configure Frontend**:
   ```bash
   cd ../frontend
   cp .env.example .env
   # Edit .env and add contract addresses from step 2
   npm install
   npm run dev
   ```

4. **Setup Relayer** (for gasless transactions):
   ```bash
   cd ../myRelayer
   cp .env.example .env
   # Edit .env with contract addresses and relayer private key
   node encryptMyKey.js
   npm install
   npm start
   ```

📚 **Detailed Guide**: See [POLYGON_DEPLOYMENT_GUIDE.md](POLYGON_DEPLOYMENT_GUIDE.md) for complete instructions

### Alternative: Windows Quick Deploy
```bash
deploy-polygon.bat
```

### Alternative: Linux/Mac Quick Deploy
```bash
chmod +x deploy-polygon.sh
./deploy-polygon.sh
```

## Usage

Once the project is set up and running, users can access the decentralized chat DApp through their web browser. They can register their username, upload a profile image, and start communicating with other users securely.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-branch`
5. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

