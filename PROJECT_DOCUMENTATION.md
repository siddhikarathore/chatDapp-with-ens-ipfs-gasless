# ChatZone DApp - Full Project Documentation

## Table of Contents
1. Overview
2. Features
3. Architecture
4. Smart Contracts
5. Frontend
6. Relayer Backend
7. IPFS & Avatars
8. Environment Setup
9. How to Run
10. How to Register & Chat
11. Troubleshooting
12. Enhancements & Ideas
13. Credits
14. Full Technical Details

---

## 1. Overview
ChatZone is a decentralized chat application (DApp) built on Polygon Amoy testnet. It allows users to register unique usernames, set avatars (stored on IPFS), and chat with others using gasless transactions. The app uses smart contracts, a React frontend, a Node.js relayer, and IPFS for decentralized storage.

## 2. Features
- Register with a unique username
- Set a profile avatar (stored on IPFS)
- See a list of all registered users
- Send and receive messages (gasless, via relayer)
- ENS-style username resolution
- Avatars and messages are decentralized

## 3. Architecture
- **Smart Contracts:** Solidity contracts for user registration and messaging
- **Frontend:** React + TypeScript (Vite) for the user interface
- **Relayer:** Node.js Express server to sponsor gas for users
- **IPFS:** Stores user avatars and files
- **Polygon Amoy:** Blockchain network for contracts

## 4. Smart Contracts
- **ENService.sol:** Handles username registration, mapping usernames to addresses, and avatar hashes.
- **Chatzone.sol:** Handles sending and storing messages between users.
- **Deployment:** Contracts are deployed using Foundry. Addresses are stored in `.env` files.

## 5. Frontend
- **Tech:** React 18, TypeScript, Vite, ethers.js, Web3Modal
- **Key Files:**
  - `src/App.tsx`: Main app component
  - `src/components/shared/Sidebar.tsx`: User list and current user
  - `src/components/shared/MessageContainer.tsx`: Chat messages
  - `src/hooks/useGetMessages.ts`: Fetches messages
  - `src/hooks/useSendMessage.ts`: Sends messages via relayer
  - `src/constants/contract.ts`: Contract ABIs and addresses
  - `src/constants/provider.ts`: Blockchain providers
- **Styling:** Tailwind CSS

## 6. Relayer Backend
- **Tech:** Node.js, Express, ethers.js
- **Purpose:** Sponsors gas for user transactions (gasless chat)
- **Key Files:**
  - `myRelayer/main.js`: Main server logic
  - `myRelayer/encryptMyKey.js`: Handles private key encryption
  - `.env`: Stores relayer private key, contract addresses, and port
- **How it works:**
  - Receives signed message from frontend
  - Verifies signature
  - Submits transaction to blockchain on user's behalf

## 7. IPFS & Avatars
- **Pinata API:** Used to upload avatars to IPFS
- **Public Gateway:** Avatars loaded via `https://ipfs.io/ipfs/<hash>`
- **Avatar selection:** On registration, user uploads an image, which is pinned to IPFS

## 8. Environment Setup
- **Frontend:**
  - `frontend/.env` contains contract addresses, Pinata keys, relayer URL
- **Relayer:**
  - `myRelayer/.env` contains contract addresses, relayer private key, port
- **Contracts:**
  - `contract/.env` contains deployer private key
- **Pinata:**
  - API Key and Secret with full permissions
- **Polygon Amoy:**
  - RPC: `https://rpc-amoy.polygon.technology`
  - ChainId: `80002`

## 9. How to Run
### Prerequisites
- Node.js (v18+)
- Foundry (for contract deployment)
- Metamask wallet (Polygon Amoy testnet)

### Steps
1. **Clone the repository**
2. **Install dependencies**
   - `cd frontend && npm install`
   - `cd ../myRelayer && npm install`
3. **Set up environment files**
   - Fill in `.env` files in `frontend`, `myRelayer`, and `contract` folders
4. **Deploy contracts** (if needed)
   - `cd contract`
   - `forge script script/Deploy.s.sol --rpc-url <AMOY_RPC> --private-key <PRIVATE_KEY> --broadcast`
   - Copy deployed addresses to `.env` files
5. **Start relayer**
   - `cd myRelayer`
   - `node main.js`
6. **Start frontend**
   - `cd frontend`
   - `npm run dev`
7. **Open app**
   - Visit `http://localhost:5173` in your browser

## 10. How to Register & Chat
1. **Connect your wallet** (Metamask)
2. **Register a username** (unique, ENS-style)
3. **Upload an avatar** (image pinned to IPFS)
4. **See yourself in the user list**
5. **Select a user to chat**
6. **Send messages** (gasless, via relayer)
7. **Messages and avatars are decentralized**

## 11. Troubleshooting
- **Avatars not loading:**
  - Check IPFS gateway status (try ipfs.io, cloudflare-ipfs.com, or gateway.pinata.cloud)
  - Make sure avatar hash is correct
- **Relayer errors:**
  - Ensure relayer is running and URL is correct in `.env`
  - Check relayer logs for errors
- **Contract errors:**
  - Make sure contract addresses in `.env` match deployed contracts
- **Pinata 401/403 errors:**
  - Use correct API Key/Secret with full permissions
- **WebSocket errors:**
  - Check your RPC/WebSocket URL in `.env`

## 12. Enhancements & Ideas
- Group chats
- Message encryption
- File sharing
- Message reactions
- Typing indicators
- Read receipts
- Profile customization
- Multi-chain support
- Push notifications

## 13. Credits
- Built by Siddhika and contributors
- Uses Polygon, IPFS, Pinata, ethers.js, React, Foundry, and more

## 14. Full Technical Details

### Smart Contracts

#### ENService.sol
- **Purpose:** Handles user registration, username-to-address mapping, and avatar storage.
- **Key Functions:**
  - `createAccount(address _from, string avatar, string name)`: Registers a new user with a unique name and avatar IPFS hash.
  - `getUserFromAddress(address)`: Returns user struct for an address.
  - `getUserInfoFromName(string)`: Returns user struct for a username.
  - `getAddressFromName(string)`: Returns address for a username.
  - `usernameExist(string)`: Checks if a username is taken.
  - `getAllUsers()`: Returns all registered users.
- **Events:**
  - `UserRegistered(address, string)`
- **Errors:**
  - `ZERO_ADDRESS_NOT_ALLOWED()`
  - `NAME_NOT_AVAILABLE()`

#### Chatzone.sol
- **Purpose:** Handles messaging between users.
- **Key Functions:**
  - `sendMessage(address _from, string msg, string _to)`: Sends a message from one user to another (by username).
  - `getUserMessages()`: Returns all messages for the sender.
  - `getCountOfMsg()`: Returns all messages.
  - `getMessagesBetweenUsers(string name1, string name2)`: Returns all messages exchanged between two users (by username).
- **Events:**
  - `MessageSent(address from, address to, string message)`

### Frontend Structure
- **React + TypeScript + Vite**
- **Key Components:**
  - `Sidebar.tsx`: Shows current user and all users (with avatars from IPFS)
  - `MessageContainer.tsx`: Shows chat with selected user, message input, and send button
  - `Chat.tsx`: Renders individual chat bubbles
- **Hooks:**
  - `useGetMessages.ts`: Fetches messages between users using contract call
  - `useSendMessage.ts`: Signs and sends messages via relayer
- **State Management:** React hooks and context
- **Styling:** Tailwind CSS

### Relayer Backend (Node.js)
- **main.js:**
  - Express server with endpoints:
    - `/forward-message`: Receives signed message, verifies, and relays to contract
    - `/register-user`: Receives signed registration, verifies, and relays to contract
    - `/relayer-address`: Returns relayer wallet address
    - `/health`: Health check for environment
  - Uses ethers.js for contract interaction
  - Reads contract ABIs from `chatAbi.json` and `ensAbi.json`
  - Loads private key from `.env` or encrypted file
  - Checks relayer balance and gas before sending tx

### Environment Files (Examples)

#### frontend/.env
```
VITE_INFURA_RPC_URL=https://rpc-amoy.polygon.technology
VITE_WEB_SOCKET_RPC_URL=wss://polygon-amoy-bor-rpc.publicnode.com
VITE_ENS_CONTRACT_ADDRESS=0x380Fec7E758dd8eBd08fE9D21cfd842EC42b9c9e
VITE_CHAT_CONTRACT_ADDRESS=0xCf98efBAaDB4BFA6E832f777A8CCd54dBA05Db4c
VITE_PROJECT_ID=<web3modal_project_id>
VITE_PINATA_API_KEY=<pinata_api_key>
VITE_PINATA_SECRET_API_KEY=<pinata_secret>
VITE_RELAYER_URL=http://localhost:5000
```

#### myRelayer/.env
```
INFURA_RPC_URL=https://rpc-amoy.polygon.technology
ENS_CONTRACT_ADDRESS=0x380Fec7E758dd8eBd08fE9D21cfd842EC42b9c9e
CHAT_CONTRACT_ADDRESS=0xCf98efBAaDB4BFA6E832f777A8CCd54dBA05Db4c
MY_PRIVATE_KEY=<relayer_private_key>
MY_SALT=<encryption_salt>
PORT=5000
```

#### contract/.env
```
PRIVATE_KEY=<deployer_private_key>
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=<polygonscan_api_key>
```

### Example User Flow
1. User connects wallet in frontend (Metamask, WalletConnect)
2. Registers username and uploads avatar (image pinned to IPFS via Pinata)
3. Relayer receives signed registration, verifies, and submits to ENService contract
4. User appears in user list (with avatar from IPFS)
5. User selects another user to chat
6. Sends message (signed, relayed to Chatzone contract)
7. Messages are fetched from contract and displayed in chat window

### Example Contract Call (Frontend)
```typescript
const contract = getChatContract(readOnlyProvider);
const messages = await contract.getMessagesBetweenUsers('alice', 'bob');
```

### Example Relayer Call (Frontend)
```typescript
const response = await fetch(`${import.meta.env.VITE_RELAYER_URL}/forward-message`, {
  method: "POST",
  body: JSON.stringify({ from, msg, to, signature }),
  headers: { "Content-Type": "application/json" },
});
```

### Example Avatar URL
```
https://ipfs.io/ipfs/<avatar_hash>
```

---

**This file contains all technical, architectural, and usage details for the project. No external documentation is required.**
