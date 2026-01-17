# 🚀 Quick Deployment Commands

## Prerequisites
- Get Polygon Amoy MATIC: https://faucet.polygon.technology/
- Install Foundry: https://book.getfoundry.sh/getting-started/installation

---

## 1️⃣ Deploy Smart Contracts

```bash
# Setup
cd contract
cp .env.example .env
# Edit .env: Add PRIVATE_KEY

# Deploy
forge build
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url polygon_amoy \
  --broadcast \
  --verify \
  -vvvv
```

**Save the contract addresses!**

---

## 2️⃣ Configure Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env: Add contract addresses + API keys

npm install
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 3️⃣ Setup Relayer

```bash
cd myRelayer
cp .env.example .env
# Edit .env: Add contract addresses + relayer private key

node encryptMyKey.js
npm install
npm start
```

Relayer runs at: http://localhost:5000

---

## 🔧 Useful Commands

### Contract Testing
```bash
cd contract
forge test -vvvv
forge test --match-test testingMessageSending -vvvv
```

### Gas Report
```bash
forge test --gas-report
```

### Contract Verification
```bash
forge verify-contract <ADDRESS> src/Chatzone.sol:Chatzone \
  --chain polygon-amoy \
  --constructor-args $(cast abi-encode "constructor(address)" <ENS_ADDRESS>)
```

### Check Deployment
```bash
cast call <ENS_CONTRACT> "getAllUsers()" --rpc-url polygon_amoy
```

---

## 🌐 Network Info

- **Chain ID**: 80002
- **RPC**: https://rpc-amoy.polygon.technology
- **Explorer**: https://amoy.polygonscan.com
- **Faucet**: https://faucet.polygon.technology
- **Currency**: MATIC (testnet)

---

## 📦 Environment Files Summary

### contract/.env
```env
PRIVATE_KEY=your_deployer_private_key
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_api_key
```

### frontend/.env
```env
VITE_INFURA_RPC_URL=https://rpc-amoy.polygon.technology
VITE_WEB_SOCKET_RPC_URL=wss://polygon-amoy-bor-rpc.publicnode.com
VITE_ENS_CONTRACT_ADDRESS=0x...
VITE_CHAT_CONTRACT_ADDRESS=0x...
VITE_PROJECT_ID=walletconnect_project_id
VITE_PINATA_API_KEY=...
VITE_PINATA_SECRET_API_KEY=...
```

### myRelayer/.env
```env
INFURA_RPC_URL=https://rpc-amoy.polygon.technology
ENS_CONTRACT_ADDRESS=0x...
CHAT_CONTRACT_ADDRESS=0x...
MY_PRIVATE_KEY=relayer_private_key
MY_SALT=encryption_password
PORT=5000
```

---

## 🐛 Troubleshooting

**Deployment fails:**
```bash
forge clean
forge build
# Try again
```

**Out of gas:**
- Get more MATIC from faucet
- Check wallet balance: `cast balance <YOUR_ADDRESS> --rpc-url polygon_amoy`

**Verification fails:**
- Wait 1-2 minutes after deployment
- Verify manually on PolygonScan

**Frontend can't connect:**
- Check contract addresses in .env
- Ensure MetaMask is on Polygon Amoy (Chain ID: 80002)
- Clear browser cache

---

## 📚 Full Documentation

- [Complete Guide](POLYGON_DEPLOYMENT_GUIDE.md)
- [Contract Deployment](contract/DEPLOYMENT.md)
- [Foundry Docs](https://book.getfoundry.sh/)
