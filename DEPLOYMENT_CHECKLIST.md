# 📋 Deployment Checklist - Polygon Amoy

Use this checklist to ensure a smooth deployment process.

---

## ✅ Pre-Deployment Checklist

### 🔑 API Keys & Access
- [ ] WalletConnect Project ID obtained from https://cloud.walletconnect.com/
- [ ] Pinata API Key obtained from https://pinata.cloud/
- [ ] Pinata Secret API Key saved
- [ ] PolygonScan API Key (optional) from https://polygonscan.com/apis

### 💰 Wallet Setup
- [ ] Deployer wallet created/ready
- [ ] Deployer wallet has ~0.01-0.05 MATIC from faucet
- [ ] Relayer wallet created (separate from deployer)
- [ ] Relayer wallet has ~0.1-0.5 MATIC from faucet
- [ ] Private keys safely stored

### 🛠️ Development Environment
- [ ] Foundry installed (`forge --version`)
- [ ] Node.js installed (`node --version`)
- [ ] Git repository cloned
- [ ] All dependencies understood

---

## 📝 Contract Deployment

### Setup
- [ ] Navigate to `contract/` directory
- [ ] Copy `.env.example` to `.env`
- [ ] Add `PRIVATE_KEY` to `.env` (deployer wallet, no 0x)
- [ ] Add `POLYGON_AMOY_RPC_URL` to `.env`
- [ ] Add `POLYGONSCAN_API_KEY` to `.env` (optional)

### Build & Test
- [ ] Run `forge build` successfully
- [ ] Run `forge test` - all tests pass
- [ ] Review gas estimates with `forge test --gas-report`

### Deploy
- [ ] Run deployment command:
  ```bash
  forge script script/Deploy.s.sol:DeployScript \
    --rpc-url polygon_amoy \
    --broadcast \
    --verify \
    -vvvv
  ```
- [ ] Deployment successful
- [ ] **ENS Contract Address**: ________________________________
- [ ] **Chat Contract Address**: ________________________________
- [ ] Contracts verified on PolygonScan
- [ ] Test contract on explorer: https://amoy.polygonscan.com/address/___

### Verify Deployment
- [ ] Check ENS contract: `cast call <ENS_ADDR> "getAllUsers()" --rpc-url polygon_amoy`
- [ ] Contracts appear on PolygonScan with verified source code

---

## 🎨 Frontend Configuration

### Environment Setup
- [ ] Navigate to `frontend/` directory
- [ ] Copy `.env.example` to `.env`
- [ ] Add `VITE_INFURA_RPC_URL=https://rpc-amoy.polygon.technology`
- [ ] Add `VITE_WEB_SOCKET_RPC_URL=wss://polygon-amoy-bor-rpc.publicnode.com`
- [ ] Add `VITE_ENS_CONTRACT_ADDRESS` (from deployment)
- [ ] Add `VITE_CHAT_CONTRACT_ADDRESS` (from deployment)
- [ ] Add `VITE_PROJECT_ID` (WalletConnect)
- [ ] Add `VITE_PINATA_API_KEY`
- [ ] Add `VITE_PINATA_SECRET_API_KEY`

### Build & Run
- [ ] Run `npm install`
- [ ] No installation errors
- [ ] Run `npm run dev`
- [ ] Frontend opens at http://localhost:5173
- [ ] No console errors in browser
- [ ] Connect wallet button visible

---

## 🤖 Relayer Configuration

### Environment Setup
- [ ] Navigate to `myRelayer/` directory
- [ ] Copy `.env.example` to `.env`
- [ ] Add `INFURA_RPC_URL=https://rpc-amoy.polygon.technology`
- [ ] Add `ENS_CONTRACT_ADDRESS` (from deployment)
- [ ] Add `CHAT_CONTRACT_ADDRESS` (from deployment)
- [ ] Add `MY_PRIVATE_KEY` (relayer wallet, no 0x)
- [ ] Add `MY_SALT` (strong password for encryption)
- [ ] Add `PORT=5000`

### Encrypt & Run
- [ ] Run `node encryptMyKey.js`
- [ ] Verify `.encryptedKey.json` created
- [ ] **IMPORTANT**: Backup `.encryptedKey.json` securely
- [ ] Run `npm install`
- [ ] No installation errors
- [ ] Run `npm start`
- [ ] Server running on port 5000
- [ ] No errors in console
- [ ] Test endpoint: `curl http://localhost:5000`

---

## 🧪 Testing Checklist

### Wallet Connection
- [ ] Open http://localhost:5173
- [ ] Click "Connect Wallet"
- [ ] MetaMask prompts to add Polygon Amoy network
- [ ] Network added successfully
- [ ] Wallet connected (address shown)
- [ ] Correct network displayed (Polygon Amoy / 80002)

### User Registration
- [ ] Navigate to `/signup`
- [ ] Upload profile image (< 5MB)
- [ ] Image preview appears
- [ ] Enter unique username
- [ ] Click submit/register
- [ ] MetaMask signature request appears
- [ ] Sign message (no gas required!)
- [ ] Registration success message
- [ ] Redirected to `/chat`

### IPFS Verification
- [ ] Profile image visible in chat
- [ ] Image URL contains `ipfs/` or `mypinata.cloud`
- [ ] Image loads correctly
- [ ] Check on Pinata dashboard

### Messaging
- [ ] User list appears in sidebar
- [ ] Click on another user
- [ ] Chat interface opens
- [ ] Type a message
- [ ] Click "Send"
- [ ] MetaMask signature request (no gas!)
- [ ] Sign the message
- [ ] Message appears in chat
- [ ] Message sent successfully

### Real-time Updates
- [ ] Open chat in another browser/incognito
- [ ] Connect different wallet
- [ ] Register second user
- [ ] Send message from User A to User B
- [ ] Verify User B sees message (may need refresh)
- [ ] Check message in both directions

### Contract Interaction
- [ ] Check message on PolygonScan:
  - [ ] Go to Chat contract address
  - [ ] Check "Events" tab
  - [ ] See `MessageSent` events
- [ ] Check user registration:
  - [ ] Go to ENS contract address
  - [ ] Check "Events" tab
  - [ ] See `UserRegistered` events

---

## 🚨 Troubleshooting Checks

### If Deployment Fails
- [ ] Verify wallet has enough MATIC
- [ ] Check RPC URL is correct
- [ ] Try: `forge clean && forge build`
- [ ] Check internet connection
- [ ] Try alternative RPC from Alchemy/Infura

### If Frontend Can't Connect
- [ ] Contract addresses correct in `.env`
- [ ] MetaMask on Polygon Amoy network
- [ ] Clear browser cache
- [ ] Restart dev server
- [ ] Check browser console for errors

### If Relayer Fails
- [ ] Relayer wallet has MATIC
- [ ] Contract addresses match deployment
- [ ] `.encryptedKey.json` exists
- [ ] `MY_SALT` matches encryption password
- [ ] Check relayer console logs
- [ ] Verify relayer is running (http://localhost:5000)

### If Signatures Fail
- [ ] Correct network in MetaMask
- [ ] Wallet unlocked
- [ ] No pending transactions
- [ ] Try disconnecting and reconnecting wallet

---

## 📊 Post-Deployment Verification

### Smart Contracts
- [ ] Both contracts verified on PolygonScan
- [ ] Source code visible and readable
- [ ] Contract interactions work on explorer
- [ ] Events are emitting correctly

### Frontend
- [ ] All pages load without errors
- [ ] Wallet connection smooth
- [ ] Images load from IPFS
- [ ] Routing works correctly
- [ ] Responsive on mobile

### Relayer
- [ ] Accepts signature verification
- [ ] Forwards transactions correctly
- [ ] Returns proper responses
- [ ] Logs are clean
- [ ] No memory leaks

---

## 🎯 Production Readiness (Optional)

If deploying to production:

### Security
- [ ] Smart contracts audited
- [ ] Private keys in secure vault (not .env)
- [ ] Rate limiting on relayer
- [ ] CORS properly configured
- [ ] Input validation on all endpoints

### Infrastructure
- [ ] Relayer deployed to cloud (Render/Railway/AWS)
- [ ] HTTPS enabled
- [ ] Domain name configured
- [ ] CDN for frontend
- [ ] Database for relayer logs (optional)
- [ ] Monitoring setup (Sentry, etc.)

### Performance
- [ ] Load testing completed
- [ ] Gas optimization done
- [ ] Frontend bundle optimized
- [ ] Image compression
- [ ] Caching strategy

### Legal & Compliance
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] GDPR compliance (if applicable)
- [ ] Content moderation plan

---

## ✅ Deployment Complete!

- [ ] All tests passed
- [ ] Documentation updated with contract addresses
- [ ] Team notified
- [ ] Users can access DApp
- [ ] Monitoring in place

### Final Contract Addresses

**Polygon Amoy Testnet:**
- ENS Contract: _________________________________
- Chat Contract: _________________________________
- Deployment Date: _________________________________
- Deployer Address: _________________________________
- Relayer Address: _________________________________

### Access URLs

- Frontend: http://localhost:5173 (or production URL)
- Relayer: http://localhost:5000 (or production URL)
- PolygonScan: https://amoy.polygonscan.com

---

## 📝 Notes & Issues

Use this space to track any issues or notes during deployment:

```
Date: _________
Issue: 
Resolution:

Date: _________
Issue:
Resolution:
```

---

## 🎉 Congratulations!

Your Chatzone DApp is now live on Polygon Amoy! 🚀

**Don't forget to:**
- ⭐ Update README with new contract addresses
- 📸 Take screenshots for documentation
- 🐛 Monitor for any bugs
- 💬 Test with real users
- 🔄 Keep relayer wallet funded

---

**Need help?** Check:
- [QUICK_START.md](QUICK_START.md)
- [POLYGON_DEPLOYMENT_GUIDE.md](POLYGON_DEPLOYMENT_GUIDE.md)
- [GET_STARTED.md](GET_STARTED.md)
