#!/bin/bash

# Polygon Amoy Deployment Script
# This script helps deploy the Chatzone DApp to Polygon Amoy testnet

set -e

echo "🚀 Chatzone DApp - Polygon Amoy Deployment"
echo "=========================================="
echo ""

# Check if .env exists in contract folder
if [ ! -f "contract/.env" ]; then
    echo "❌ contract/.env not found!"
    echo "📝 Creating from template..."
    cp contract/.env.example contract/.env
    echo "✅ Created contract/.env"
    echo "⚠️  Please edit contract/.env and add your PRIVATE_KEY"
    echo ""
    exit 1
fi

# Navigate to contract directory
cd contract

echo "📦 Building contracts..."
forge build

echo ""
echo "🌐 Deploying to Polygon Amoy..."
echo "⏳ This may take a few minutes..."
echo ""

# Deploy contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url polygon_amoy --broadcast --verify -vvvv

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the contract addresses from above"
echo "2. Update frontend/.env with the new addresses"
echo "3. Update myRelayer/.env with the new addresses"
echo "4. Run 'cd frontend && npm install && npm run dev'"
echo "5. Run 'cd myRelayer && npm install && npm start'"
echo ""
echo "📚 See POLYGON_DEPLOYMENT_GUIDE.md for detailed instructions"
