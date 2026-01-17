# Deployment Guide - Polygon Amoy Testnet

## Prerequisites

1. **Get Polygon Amoy Test MATIC**
   - Visit: https://faucet.polygon.technology/
   - Or: https://www.alchemy.com/faucets/polygon-amoy
   - Enter your wallet address to receive test MATIC

2. **Setup Environment Variables**
   ```bash
   cd contract
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `PRIVATE_KEY`: Your wallet private key (without 0x prefix)
   - `POLYGON_AMOY_RPC_URL`: `https://rpc-amoy.polygon.technology`
   - `POLYGONSCAN_API_KEY`: (Optional) Get from https://polygonscan.com/apis

## Deployment Steps

### 1. Build Contracts
```bash
forge build
```

### 2. Deploy to Polygon Amoy
```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url polygon_amoy --broadcast --verify -vvvv
```

Or without verification:
```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url polygon_amoy --broadcast -vvvv
```

### 3. Verify Contracts (if not done during deployment)
```bash
# Verify ENService
forge verify-contract <ENS_CONTRACT_ADDRESS> src/ENService.sol:ENService --chain polygon-amoy --watch

# Verify Chatzone
forge verify-contract <CHATZONE_CONTRACT_ADDRESS> src/Chatzone.sol:Chatzone --constructor-args $(cast abi-encode "constructor(address)" <ENS_CONTRACT_ADDRESS>) --chain polygon-amoy --watch
```

## Network Information

- **Network Name**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **RPC URL**: https://rpc-amoy.polygon.technology
- **Block Explorer**: https://amoy.polygonscan.com/
- **Currency**: MATIC

## Post-Deployment

After successful deployment, you'll receive two contract addresses:
1. **ENService Contract Address**
2. **Chatzone Contract Address**

Update these addresses in:
- Frontend: `frontend/.env` (VITE_ENS_CONTRACT_ADDRESS, VITE_CHAT_CONTRACT_ADDRESS)
- Relayer: `myRelayer/.env` (ENS_CONTRACT_ADDRESS, CHAT_CONTRACT_ADDRESS)

## Troubleshooting

### Insufficient Funds
- Make sure you have enough MATIC from the faucet
- Each deployment costs ~0.01-0.05 MATIC

### RPC Connection Issues
- Try alternative RPC: `https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY`
- Or: `https://polygon-amoy.infura.io/v3/YOUR_API_KEY`

### Verification Failed
- Wait a few minutes and try manual verification
- Ensure POLYGONSCAN_API_KEY is correct
