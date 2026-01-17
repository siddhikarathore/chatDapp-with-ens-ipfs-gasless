# Complete Polygon Amoy Deployment Guide

## Overview
This guide will help you deploy the Chatzone DApp to Polygon Amoy testnet.

---

## Step 1: Get Polygon Amoy Test MATIC

1. Visit Polygon Faucet: https://faucet.polygon.technology/
2. Select **Polygon Amoy** network
3. Enter your wallet address
4. You'll receive test MATIC for deployments

Alternative faucets:
- https://www.alchemy.com/faucets/polygon-amoy
- https://www.allthatnode.com/faucet/polygon.dsrv

---

## Step 2: Deploy Smart Contracts

### 2.1 Setup Contract Environment

```bash
cd contract
cp .env.example .env
```

Edit `contract/.env`:
```env
PRIVATE_KEY=your_private_key_without_0x
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=optional_for_verification
```

### 2.2 Build and Deploy

```bash
# Build contracts
forge build

# Deploy to Polygon Amoy
forge script script/Deploy.s.sol:DeployScript --rpc-url polygon_amoy --broadcast --verify -vvvv
```

### 2.3 Save Contract Addresses

After deployment, you'll see:
```
ENService Contract: 0x...
Chatzone Contract: 0x...
```

**Save these addresses!** You'll need them for the next steps.

---

## Step 3: Configure Frontend

### 3.1 Setup Frontend Environment

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env`:
```env
VITE_INFURA_RPC_URL=https://rpc-amoy.polygon.technology
VITE_WEB_SOCKET_RPC_URL=wss://polygon-amoy-bor-rpc.publicnode.com
VITE_ENS_CONTRACT_ADDRESS=0x_YOUR_ENS_CONTRACT_ADDRESS
VITE_CHAT_CONTRACT_ADDRESS=0x_YOUR_CHAT_CONTRACT_ADDRESS
VITE_PROJECT_ID=your_walletconnect_project_id
VITE_PINATA_API_KEY=your_pinata_key
VITE_PINATA_SECRET_API_KEY=your_pinata_secret
```

**Get WalletConnect Project ID:**
1. Visit: https://cloud.walletconnect.com/
2. Create a new project
3. Copy the Project ID

**Get Pinata API Keys:**
1. Visit: https://pinata.cloud/
2. Create account and generate API keys

### 3.2 Install and Run Frontend

```bash
npm install
npm run dev
```

---

## Step 4: Setup Relayer (Gasless Transactions)

### 4.1 Setup Relayer Environment

```bash
cd ../myRelayer
cp .env.example .env
```

Edit `myRelayer/.env`:
```env
INFURA_RPC_URL=https://rpc-amoy.polygon.technology
ENS_CONTRACT_ADDRESS=0x_YOUR_ENS_CONTRACT_ADDRESS
CHAT_CONTRACT_ADDRESS=0x_YOUR_CHAT_CONTRACT_ADDRESS
MY_PRIVATE_KEY=relayer_wallet_private_key
MY_SALT=strong_encryption_password
PORT=5000
```

**Important:** The relayer wallet needs MATIC to pay for gas!
- Use a separate wallet for the relayer
- Fund it with test MATIC from the faucet

### 4.2 Encrypt Relayer Private Key

```bash
node encryptMyKey.js
```

This creates `.encryptedKey.json` - keep this file secure!

### 4.3 Start Relayer

```bash
npm install
npm start
```

The relayer will run on `http://localhost:5000`

---

## Step 5: Update Frontend to Use Relayer

If running relayer locally, update these files:

**frontend/src/hooks/useCreateUser.ts** (Line ~41):
```typescript
const response = await fetch(
  "http://localhost:5000/register-user",
  // ... rest of code
);
```

**frontend/src/hooks/useSendMessage.ts** (Line ~35):
```typescript
const response = await fetch(
  "http://localhost:5000/forward-message",
  // ... rest of code
);
```

---

## Step 6: Test the Application

1. **Connect Wallet**: Click "Connect Wallet" in the UI
2. **Switch to Polygon Amoy**: MetaMask will prompt you to add/switch network
3. **Register User**: Upload avatar and choose username
4. **Start Chatting**: Select a user from the sidebar and send messages

---

## Network Configuration for MetaMask

If MetaMask doesn't auto-add Polygon Amoy:

- **Network Name**: Polygon Amoy Testnet
- **RPC URL**: https://rpc-amoy.polygon.technology
- **Chain ID**: 80002
- **Currency Symbol**: MATIC
- **Block Explorer**: https://amoy.polygonscan.com

---

## Troubleshooting

### Contract Deployment Fails
- Ensure you have enough MATIC in your deployment wallet
- Check RPC URL is correct
- Try: `forge clean` then `forge build`

### Frontend Can't Connect
- Verify contract addresses in `.env`
- Check network is Polygon Amoy (Chain ID: 80002)
- Clear browser cache and reconnect wallet

### Relayer Not Working
- Ensure relayer wallet has MATIC
- Check contract addresses match deployment
- Verify `.encryptedKey.json` exists
- Check relayer logs for errors

### Messages Not Sending
- Verify relayer is running
- Check frontend is pointing to correct relayer URL
- Ensure user is registered (has username)

---

## Production Deployment

For production/mainnet:

1. **Use Polygon Mainnet**:
   - Chain ID: 137
   - RPC: https://polygon-rpc.com

2. **Deploy Relayer to Cloud**:
   - Use Render, Railway, or AWS
   - Update frontend URLs to production relayer
   - Secure private keys with secrets management

3. **Enable HTTPS**:
   - Use SSL certificates
   - Update CORS settings

4. **Contract Verification**:
   - Always verify on PolygonScan
   - Publish source code

---

## Useful Resources

- Polygon Amoy Explorer: https://amoy.polygonscan.com/
- Polygon Docs: https://wiki.polygon.technology/
- Foundry Book: https://book.getfoundry.sh/
- Web3Modal Docs: https://docs.walletconnect.com/web3modal/about

---

## Quick Command Reference

```bash
# Deploy contracts
cd contract && forge script script/Deploy.s.sol:DeployScript --rpc-url polygon_amoy --broadcast

# Run frontend
cd frontend && npm run dev

# Run relayer
cd myRelayer && npm start

# Test contracts
cd contract && forge test -vvvv
```
