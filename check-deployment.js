#!/usr/bin/env node

/**
 * Deployment Status Checker
 * Run this script to verify your deployment setup
 * 
 * Usage: node check-deployment.js
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[36m';
const RESET = '\x1b[0m';

function checkmark() { return `${GREEN}✓${RESET}`; }
function cross() { return `${RED}✗${RESET}`; }
function warning() { return `${YELLOW}⚠${RESET}`; }

console.log(`\n${BLUE}╔════════════════════════════════════════╗${RESET}`);
console.log(`${BLUE}║   Chatzone Deployment Status Check    ║${RESET}`);
console.log(`${BLUE}╔════════════════════════════════════════╗${RESET}\n`);

let allGood = true;

// Check Contract Setup
console.log(`${BLUE}📦 Contract Setup${RESET}`);
console.log('─'.repeat(40));

const contractEnv = path.join(__dirname, 'contract', '.env');
if (fs.existsSync(contractEnv)) {
    console.log(`${checkmark()} contract/.env exists`);
    const content = fs.readFileSync(contractEnv, 'utf8');
    if (content.includes('PRIVATE_KEY=your_private_key_here') || 
        content.includes('PRIVATE_KEY=') === false) {
        console.log(`${warning()} contract/.env: PRIVATE_KEY not configured`);
        allGood = false;
    } else {
        console.log(`${checkmark()} PRIVATE_KEY configured`);
    }
} else {
    console.log(`${cross()} contract/.env missing`);
    console.log(`   ${YELLOW}Run: cd contract && cp .env.example .env${RESET}`);
    allGood = false;
}

const deployScript = path.join(__dirname, 'contract', 'script', 'Deploy.s.sol');
if (fs.existsSync(deployScript)) {
    console.log(`${checkmark()} Deploy.s.sol exists`);
} else {
    console.log(`${cross()} Deploy.s.sol missing`);
    allGood = false;
}

console.log('');

// Check Frontend Setup
console.log(`${BLUE}🎨 Frontend Setup${RESET}`);
console.log('─'.repeat(40));

const frontendEnv = path.join(__dirname, 'frontend', '.env');
if (fs.existsSync(frontendEnv)) {
    console.log(`${checkmark()} frontend/.env exists`);
    const content = fs.readFileSync(frontendEnv, 'utf8');
    
    const checks = [
        { key: 'VITE_ENS_CONTRACT_ADDRESS', label: 'ENS Contract Address' },
        { key: 'VITE_CHAT_CONTRACT_ADDRESS', label: 'Chat Contract Address' },
        { key: 'VITE_PROJECT_ID', label: 'WalletConnect Project ID' },
        { key: 'VITE_PINATA_API_KEY', label: 'Pinata API Key' },
    ];
    
    checks.forEach(({ key, label }) => {
        if (content.includes(`${key}=0x_YOUR`) || 
            content.includes(`${key}=your_`) ||
            !content.includes(`${key}=`)) {
            console.log(`${warning()} ${label} not configured`);
        } else {
            console.log(`${checkmark()} ${label} configured`);
        }
    });
} else {
    console.log(`${cross()} frontend/.env missing`);
    console.log(`   ${YELLOW}Run: cd frontend && cp .env.example .env${RESET}`);
    allGood = false;
}

const frontendNodeModules = path.join(__dirname, 'frontend', 'node_modules');
if (fs.existsSync(frontendNodeModules)) {
    console.log(`${checkmark()} Frontend dependencies installed`);
} else {
    console.log(`${warning()} Frontend dependencies not installed`);
    console.log(`   ${YELLOW}Run: cd frontend && npm install${RESET}`);
}

console.log('');

// Check Relayer Setup
console.log(`${BLUE}🤖 Relayer Setup${RESET}`);
console.log('─'.repeat(40));

const relayerEnv = path.join(__dirname, 'myRelayer', '.env');
if (fs.existsSync(relayerEnv)) {
    console.log(`${checkmark()} myRelayer/.env exists`);
    const content = fs.readFileSync(relayerEnv, 'utf8');
    
    const checks = [
        { key: 'ENS_CONTRACT_ADDRESS', label: 'ENS Contract Address' },
        { key: 'CHAT_CONTRACT_ADDRESS', label: 'Chat Contract Address' },
        { key: 'MY_PRIVATE_KEY', label: 'Relayer Private Key' },
        { key: 'MY_SALT', label: 'Encryption Salt' },
    ];
    
    checks.forEach(({ key, label }) => {
        if (content.includes(`${key}=0x_YOUR`) || 
            content.includes(`${key}=your_`) ||
            !content.includes(`${key}=`)) {
            console.log(`${warning()} ${label} not configured`);
        } else {
            console.log(`${checkmark()} ${label} configured`);
        }
    });
} else {
    console.log(`${cross()} myRelayer/.env missing`);
    console.log(`   ${YELLOW}Run: cd myRelayer && cp .env.example .env${RESET}`);
    allGood = false;
}

const encryptedKey = path.join(__dirname, 'myRelayer', '.encryptedKey.json');
if (fs.existsSync(encryptedKey)) {
    console.log(`${checkmark()} Encrypted key file exists`);
} else {
    console.log(`${warning()} Encrypted key not generated`);
    console.log(`   ${YELLOW}Run: cd myRelayer && node encryptMyKey.js${RESET}`);
}

const relayerNodeModules = path.join(__dirname, 'myRelayer', 'node_modules');
if (fs.existsSync(relayerNodeModules)) {
    console.log(`${checkmark()} Relayer dependencies installed`);
} else {
    console.log(`${warning()} Relayer dependencies not installed`);
    console.log(`   ${YELLOW}Run: cd myRelayer && npm install${RESET}`);
}

console.log('');

// Summary
console.log(`${BLUE}═══════════════════════════════════════${RESET}`);
if (allGood) {
    console.log(`${GREEN}✓ All critical files configured!${RESET}`);
    console.log(`\n${BLUE}Next steps:${RESET}`);
    console.log(`1. Get MATIC: https://faucet.polygon.technology/`);
    console.log(`2. Deploy: cd contract && forge script script/Deploy.s.sol:DeployScript --rpc-url polygon_amoy --broadcast`);
    console.log(`3. Update frontend/.env and myRelayer/.env with contract addresses`);
    console.log(`4. Run: cd frontend && npm run dev`);
    console.log(`5. Run: cd myRelayer && npm start`);
} else {
    console.log(`${RED}✗ Some configuration needed${RESET}`);
    console.log(`\n${YELLOW}Please fix the issues above and run this script again.${RESET}`);
}

console.log(`\n${BLUE}📚 Documentation:${RESET}`);
console.log(`   • Quick Start: QUICK_START.md`);
console.log(`   • Full Guide: POLYGON_DEPLOYMENT_GUIDE.md`);
console.log(`   • Checklist: DEPLOYMENT_CHECKLIST.md`);
console.log('');
