# Render Deployment Setup Guide

## Problem
Your relayer is returning `500 (Internal Server Error)` with message `ERROR_OCCURED`. This means the server-side code is failing to execute properly on Render.

## Root Causes
1. **Missing environment variables** - Render doesn't have access to your local `.env` file
2. **Missing encrypted wallet file** - Render can't read your local `.encryptedKey.json`
3. **Unfunded relayer wallet** - The wallet has no MATIC to pay for gas

## Fix Steps

### Step 1: Configure Environment Variables on Render

Go to your Render service dashboard → Environment tab and add these variables:

```bash
INFURA_RPC_URL=https://rpc-amoy.polygon.technology
ENS_CONTRACT_ADDRESS=0x58ed11afA15BE2Fa7489BF3F68c450C7ab6064e6
CHAT_CONTRACT_ADDRESS=0xb7190E3fFE0664eC7C9029001C517096B5673341
MY_SALT=<your-decryption-salt-here>
ENCRYPTED_KEY_JSON=<paste-entire-contents-of-.encryptedKey.json-here>
PORT=10000
```

**Important Notes:**
- `MY_SALT`: Use the same salt you used when creating the encrypted key locally
- `ENCRYPTED_KEY_JSON`: Copy the ENTIRE contents of `myRelayer/.encryptedKey.json` as a single line string
- `PORT`: Render typically uses port 10000, but the code will use whatever Render provides

### Step 2: Get Your Encrypted Key Contents

From your project root:
```bash
cd myRelayer
cat .encryptedKey.json
```

Copy the entire output (it's a JSON object starting with `{` and ending with `}`) and paste it as the value for `ENCRYPTED_KEY_JSON` in Render.

### Step 3: Save and Redeploy

1. Click "Save Changes" in Render
2. Render will automatically redeploy with the new environment variables
3. Wait for deployment to complete

### Step 4: Verify Environment Configuration

Once deployed, visit:
```
https://chatdapp-with-ens-ipfs-gasless.onrender.com/health
```

Expected response:
```json
{
  "ok": true,
  "env": {
    "INFURA_RPC_URL": true,
    "ENS_CONTRACT_ADDRESS": true,
    "CHAT_CONTRACT_ADDRESS": true,
    "MY_SALT": true,
    "ENCRYPTED_KEY_JSON": true
  }
}
```

If any value is `false`, that environment variable is missing or empty.

### Step 5: Get Relayer Wallet Address

Visit:
```
https://chatdapp-with-ens-ipfs-gasless.onrender.com/relayer-address
```

Expected response:
```json
{
  "address": "0x..."
}
```

Copy this address.

### Step 6: Fund the Relayer Wallet

1. Go to Polygon Amoy faucet: https://faucet.polygon.technology/
2. Select "Polygon Amoy" network
3. Paste your relayer wallet address
4. Request test MATIC
5. Wait for the transaction to confirm

You can verify the balance on Amoy explorer:
```
https://amoy.polygonscan.com/address/<your-relayer-address>
```

### Step 7: Test Registration

1. Open your frontend
2. Connect wallet
3. Go to signup
4. Choose a NEW username (not one used before)
5. Upload an image
6. Click "Register User"

## Expected Behaviors

### Success (200)
- Toast: "Registration successful"
- Redirects to `/chat`

### Username Taken (400)
- Toast: "Username not available"
- Stays on `/signup`

### Insufficient Funds (400)
- Toast: "Relayer needs MATIC on Polygon Amoy. Address: 0x..."
- Use the address to fund the wallet

### Other Errors (500)
- Check Render logs for specific error messages
- Check browser console for detailed error info

## Troubleshooting

### Still getting 500 errors?

1. **Check Render Logs**
   - Go to Render dashboard → Logs
   - Look for error messages when you try to register
   - Common errors:
     - "Missing INFURA_RPC_URL env variable"
     - "Missing MY_SALT env variable for wallet decryption"
     - "insufficient funds for intrinsic transaction cost"

2. **Verify Encrypted Key**
   - Make sure `ENCRYPTED_KEY_JSON` is valid JSON
   - No extra quotes or escaping
   - Complete object from `{` to `}`

3. **Check Browser Console**
   - Look for "Relayer error:" log
   - Check the status code and response details

4. **Test Locally First**
   ```bash
   cd myRelayer
   # Make sure .env and .encryptedKey.json exist
   node main.js
   ```
   - Server should start without errors
   - Try the test script: `node test-relayer.js`

## Common Issues

### "Cannot read properties of undefined"
- Missing environment variable
- Check `/health` endpoint

### "insufficient funds"
- Relayer wallet needs MATIC
- Fund it via Polygon Amoy faucet

### "NAME_NOT_AVAILABLE"
- Username already registered
- Try a different username

### "Invalid signature"
- Wrong chain selected in wallet
- Make sure you're on Polygon Amoy (chain ID 80002)
