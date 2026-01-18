const { ethers } = require("ethers");
const fs = require("fs");

const INFURA_RPC_URL = "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = "0x02840a410a8bfaa646c7378235505c8ed0474eb5b6f9afa006e0528c48f92f9f";

// Contract ABIs
const ENS_ABI = require("./contract/out/ENService.sol/ENService.json").abi;
const CHAT_ABI = require("./contract/out/Chatzone.sol/Chatzone.json").abi;

// Contract Bytecodes
const ENS_BYTECODE = require("./contract/out/ENService.sol/ENService.json").bytecode;
const CHAT_BYTECODE = require("./contract/out/Chatzone.sol/Chatzone.json").bytecode;

async function deployContracts() {
  const provider = new ethers.JsonRpcProvider(INFURA_RPC_URL);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("🚀 Deploying fresh contracts to Polygon Amoy...");
  console.log(`Signer address: ${signer.address}`);

  // Deploy ENService
  console.log("\n📝 Deploying ENService...");
  const ENServiceFactory = new ethers.ContractFactory(ENS_ABI, ENS_BYTECODE, signer);
  const ensService = await ENServiceFactory.deploy();
  await ensService.waitForDeployment();
  const ensAddress = await ensService.getAddress();
  console.log(`✅ ENService deployed to: ${ensAddress}`);

  // Deploy Chatzone
  console.log("\n💬 Deploying Chatzone...");
  const ChatzoneFactory = new ethers.ContractFactory(CHAT_ABI, CHAT_BYTECODE, signer);
  const chatzone = await ChatzoneFactory.deploy(ensAddress);
  await chatzone.waitForDeployment();
  const chatzoneAddress = await chatzone.getAddress();
  console.log(`✅ Chatzone deployed to: ${chatzoneAddress}`);

  // Update environment files
  console.log("\n🔄 Updating environment files...");

  // Update frontend .env
  const frontendEnvPath = "./frontend/.env";
  let frontendEnv = fs.readFileSync(frontendEnvPath, "utf8");
  frontendEnv = frontendEnv.replace(
    /VITE_ENS_CONTRACT_ADDRESS=.*/,
    `VITE_ENS_CONTRACT_ADDRESS=${ensAddress}`
  );
  frontendEnv = frontendEnv.replace(
    /VITE_CHAT_CONTRACT_ADDRESS=.*/,
    `VITE_CHAT_CONTRACT_ADDRESS=${chatzoneAddress}`
  );
  fs.writeFileSync(frontendEnvPath, frontendEnv);
  console.log(`✅ Updated frontend/.env`);

  // Update relayer .env
  const relayerEnvPath = "./myRelayer/.env";
  let relayerEnv = fs.readFileSync(relayerEnvPath, "utf8");
  relayerEnv = relayerEnv.replace(
    /ENS_CONTRACT_ADDRESS=.*/,
    `ENS_CONTRACT_ADDRESS=${ensAddress}`
  );
  relayerEnv = relayerEnv.replace(
    /CHAT_CONTRACT_ADDRESS=.*/,
    `CHAT_CONTRACT_ADDRESS=${chatzoneAddress}`
  );
  fs.writeFileSync(relayerEnvPath, relayerEnv);
  console.log(`✅ Updated myRelayer/.env`);

  console.log("\n🎉 Deployment complete!");
  console.log("\n📋 Summary:");
  console.log(`   ENService:  ${ensAddress}`);
  console.log(`   Chatzone:   ${chatzoneAddress}`);
  console.log("\n✨ All user data has been cleared (fresh deployment)");
  console.log("   Now restart your servers and register new users!\n");
}

deployContracts().catch(console.error);
