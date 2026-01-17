const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
const CHAT_ABI = require("./chatAbi.json");
const ENS_ABI = require("./ensAbi.json");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("common"));

function getRelayerWallet(provider) {
  const keyFromEnv = process.env.ENCRYPTED_KEY_JSON;
  const encryptedJsonKey = keyFromEnv && keyFromEnv.length > 0
    ? keyFromEnv
    : fs.readFileSync("./.encryptedKey.json", "utf8");
  if (!process.env.MY_SALT) {
    throw new Error("Missing MY_SALT env variable for wallet decryption");
  }
  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJsonKey,
    process.env.MY_SALT
  );
  return wallet.connect(provider);
}

function getReadOnlyProvider() {
  if (!process.env.INFURA_RPC_URL) {
    throw new Error("Missing INFURA_RPC_URL env variable");
  }
  return new ethers.JsonRpcProvider(process.env.INFURA_RPC_URL);
}

async function isUsernameTaken(name) {
  const provider = getReadOnlyProvider();
  const contract = new ethers.Contract(
    process.env.ENS_CONTRACT_ADDRESS,
    ENS_ABI,
    provider
  );
  return await contract.usernameExist(name);
}
async function getRelayerAddress(provider) {
  const wallet = getRelayerWallet(provider);
  return await wallet.getAddress();
}

async function getBalance(provider, address) {
  return await provider.getBalance(address);
}

async function getGasPrice(provider) {
  const fee = await provider.getFeeData();
  // Prefer EIP-1559 maxFeePerGas, fallback to legacy gasPrice
  return fee.maxFeePerGas ?? fee.gasPrice ?? 0n;
}

async function sendMessage(data) {
  try {
    const provider = getReadOnlyProvider();

    const wallet = getRelayerWallet(provider);

    const contract = new ethers.Contract(
      process.env.CHAT_CONTRACT_ADDRESS,
      CHAT_ABI,
      wallet
    );

    const tx = await contract.sendMessage(data.from, data.msg, data.to);
    const receipt = await tx.wait();
    if (receipt.status) {
      return { success: true, tx, message: "Message sent" };
    } else {
      return { success: false, tx, message: "Message send failed" };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      tx: {},
      message: error?.reason ?? error?.message ?? "ERROR_OCCURED",
    };
  }
}

async function createAccount(data) {
  try {
    const provider = getReadOnlyProvider();

    const wallet = getRelayerWallet(provider);

    const contract = new ethers.Contract(
      process.env.ENS_CONTRACT_ADDRESS,
      ENS_ABI,
      wallet
    );

    const tx = await contract.createAccount(data.from, data.avatar, data.name);
    const receipt = await tx.wait();
    if (receipt.status) {
      return { success: true, tx, message: "Registration successful" };
    } else {
      return { success: false, tx, message: "Registration failed" };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      tx: {},
      message: error?.reason ?? error?.message ?? "ERROR_OCCURED",
    };
  }
}

function verifyMessageWithEthers(message, signature) {
  const signerAddress = ethers.verifyMessage(message, signature);
  return signerAddress;
}

app.post("/forward-message", async (req, res) => {
  const data = req.body;
  const signerAddress = verifyMessageWithEthers(
    JSON.stringify({
      from: data.from,
      msg: data.msg,
      to: data.to,
    }),
    data.signature
  );
  if (signerAddress.toString() === data.from.toString()) {
    const tx = await sendMessage(data);
    if (tx.success) {
      res.status(200).send(tx);
    } else {
      res.status(500).send(tx);
    }
  } else {
    res.status(400).send({ success: false, message: "Invalid signature" });
  }
});

app.post("/register-user", async (req, res) => {
  const data = req.body;
  const signerAddress = verifyMessageWithEthers(
    JSON.stringify({
      from: data.from,
      avatar: data.avatar,
      name: data.name,
    }),
    data.signature
  );
  if (signerAddress.toString() === data.from.toString()) {
    // Early validation to avoid on-chain revert
    try {
      const taken = await isUsernameTaken(data.name);
      if (taken) {
        return res.status(400).send({ success: false, message: "NAME_NOT_AVAILABLE" });
      }
    } catch (e) {
      console.error("Pre-check failed:", e);
      // Continue to creation; on-chain will validate
    }
    // Preflight gas cost vs relayer balance
    try {
      const provider = getReadOnlyProvider();
      const wallet = getRelayerWallet(provider);
      const contract = new ethers.Contract(
        process.env.ENS_CONTRACT_ADDRESS,
        ENS_ABI,
        wallet
      );
      const gasEstimate = await contract.createAccount.estimateGas(
        data.from,
        data.avatar,
        data.name
      );
      const gasPrice = await getGasPrice(provider);
      const totalCost = gasEstimate * gasPrice;
      const relayerAddr = await wallet.getAddress();
      const balance = await getBalance(provider, relayerAddr);
      if (gasPrice === 0n) {
        console.warn("Gas price is 0; proceeding without balance check");
      } else if (balance < totalCost) {
        return res.status(400).send({
          success: false,
          message: "INSUFFICIENT_FUNDS",
          details: {
            relayer: relayerAddr,
            balance: balance.toString(),
            gasEstimate: gasEstimate.toString(),
            gasPrice: gasPrice.toString(),
            totalCost: totalCost.toString(),
          },
        });
      }
    } catch (e) {
      console.error("Preflight gas/balance failed:", e);
      // Continue; tx may still succeed
    }
    const tx = await createAccount(data);
    if (tx.success) {
      res.status(200).send(tx);
    } else {
      // Map known validation issues to 400
      const msg = (tx.message || "").toString();
      if (msg.includes("NAME_NOT_AVAILABLE") || msg.includes("ZERO_ADDRESS_NOT_ALLOWED")) {
        res.status(400).send(tx);
      } else {
        res.status(500).send(tx);
      }
    }
  } else {
    res.status(400).send({ success: false, message: "Invalid signature" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).send({
    ok: true,
    env: {
      INFURA_RPC_URL: !!process.env.INFURA_RPC_URL,
      ENS_CONTRACT_ADDRESS: !!process.env.ENS_CONTRACT_ADDRESS,
      CHAT_CONTRACT_ADDRESS: !!process.env.CHAT_CONTRACT_ADDRESS,
      MY_SALT: !!process.env.MY_SALT,
      ENCRYPTED_KEY_JSON: !!process.env.ENCRYPTED_KEY_JSON,
    },
  });
});

const server = app;
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log("server running on port ", PORT);
});

// Helper to retrieve relayer wallet address for funding/debug
app.get("/relayer-address", async (req, res) => {
  try {
    const provider = getReadOnlyProvider();
    const wallet = getRelayerWallet(provider);
    const addr = await wallet.getAddress();
    res.status(200).send({ address: addr });
  } catch (e) {
    res.status(500).send({ error: (e?.message || "ERROR_OCCURED").toString() });
  }
});
