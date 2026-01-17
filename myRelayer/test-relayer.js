// Test script to verify relayer setup
const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function testRelayerSetup() {
  console.log("🔍 Testing Relayer Setup...\n");

  // Check environment variables
  console.log("📋 Checking Environment Variables:");
  const requiredEnvs = [
    "INFURA_RPC_URL",
    "ENS_CONTRACT_ADDRESS",
    "CHAT_CONTRACT_ADDRESS",
    "MY_SALT",
  ];

  let allEnvsPresent = true;
  for (const env of requiredEnvs) {
    const present = !!process.env[env];
    console.log(`  ${present ? "✓" : "✗"} ${env}: ${present ? "Set" : "MISSING"}`);
    if (!present) allEnvsPresent = false;
  }

  if (!allEnvsPresent) {
    console.error("\n❌ Missing required environment variables!");
    console.log("Create a .env file in myRelayer/ with all required variables.");
    process.exit(1);
  }

  // Check encrypted key file or env
  console.log("\n🔑 Checking Encrypted Wallet Key:");
  const keyFromEnv = process.env.ENCRYPTED_KEY_JSON;
  const hasKeyFile = fs.existsSync("./.encryptedKey.json");
  const hasKeyEnv = keyFromEnv && keyFromEnv.length > 0;

  if (hasKeyEnv) {
    console.log("  ✓ ENCRYPTED_KEY_JSON env variable found");
  } else if (hasKeyFile) {
    console.log("  ✓ .encryptedKey.json file found");
  } else {
    console.error("  ✗ No encrypted key found!");
    console.log("    Need either:");
    console.log("    - .encryptedKey.json file, OR");
    console.log("    - ENCRYPTED_KEY_JSON environment variable");
    process.exit(1);
  }

  // Try to decrypt wallet
  console.log("\n🔓 Testing Wallet Decryption:");
  try {
    const encryptedJsonKey = hasKeyEnv
      ? keyFromEnv
      : fs.readFileSync("./.encryptedKey.json", "utf8");
    
    const wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJsonKey,
      process.env.MY_SALT
    );
    console.log("  ✓ Wallet decrypted successfully");
    console.log(`  📍 Relayer Address: ${wallet.address}`);
  } catch (error) {
    console.error("  ✗ Failed to decrypt wallet!");
    console.error(`  Error: ${error.message}`);
    console.log("\n  Possible causes:");
    console.log("  - Wrong MY_SALT value");
    console.log("  - Corrupted encrypted key file/env");
    process.exit(1);
  }

  // Test RPC connection
  console.log("\n🌐 Testing RPC Connection:");
  try {
    const provider = new ethers.JsonRpcProvider(process.env.INFURA_RPC_URL);
    const network = await provider.getNetwork();
    console.log(`  ✓ Connected to network: ${network.name} (chainId: ${network.chainId})`);

    if (network.chainId !== 80002n) {
      console.warn("  ⚠️  Warning: Expected Polygon Amoy (chainId 80002)");
    }
  } catch (error) {
    console.error("  ✗ Failed to connect to RPC!");
    console.error(`  Error: ${error.message}`);
    process.exit(1);
  }

  // Check relayer balance
  console.log("\n💰 Checking Relayer Wallet Balance:");
  try {
    const provider = new ethers.JsonRpcProvider(process.env.INFURA_RPC_URL);
    const encryptedJsonKey = hasKeyEnv
      ? keyFromEnv
      : fs.readFileSync("./.encryptedKey.json", "utf8");
    
    const wallet = ethers.Wallet.fromEncryptedJsonSync(
      encryptedJsonKey,
      process.env.MY_SALT
    ).connect(provider);

    const balance = await provider.getBalance(wallet.address);
    const balanceInMatic = ethers.formatEther(balance);
    
    console.log(`  Balance: ${balanceInMatic} MATIC`);
    
    if (balance === 0n) {
      console.warn("  ⚠️  Warning: Wallet has no MATIC!");
      console.log("  Fund this address on Polygon Amoy faucet:");
      console.log(`  https://faucet.polygon.technology/`);
      console.log(`  Address: ${wallet.address}`);
    } else {
      console.log("  ✓ Wallet is funded");
    }
  } catch (error) {
    console.error("  ✗ Failed to check balance!");
    console.error(`  Error: ${error.message}`);
  }

  // Test contract connectivity
  console.log("\n📝 Testing Contract Access:");
  try {
    const ENS_ABI = require("./ensAbi.json");
    const provider = new ethers.JsonRpcProvider(process.env.INFURA_RPC_URL);
    const contract = new ethers.Contract(
      process.env.ENS_CONTRACT_ADDRESS,
      ENS_ABI,
      provider
    );

    // Try to call a view function
    const users = await contract.getAllUsers();
    console.log(`  ✓ Successfully connected to ENS contract`);
    console.log(`  📊 Registered users: ${users.length}`);
  } catch (error) {
    console.error("  ✗ Failed to connect to contract!");
    console.error(`  Error: ${error.message}`);
    console.log("\n  Check:");
    console.log("  - ENS_CONTRACT_ADDRESS is correct");
    console.log("  - Contract is deployed on Polygon Amoy");
  }

  console.log("\n✅ Relayer setup test complete!");
  console.log("\nIf all checks passed, your relayer is ready to use.");
  console.log("Start it with: node main.js");
}

testRelayerSetup().catch((error) => {
  console.error("\n❌ Test failed with error:");
  console.error(error);
  process.exit(1);
});
