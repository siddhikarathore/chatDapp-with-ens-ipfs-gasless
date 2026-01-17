import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

export const SUPPORTED_CHAIN_ID = 80002;

const polygonAmoy = {
    chainId: SUPPORTED_CHAIN_ID,
    name: "Polygon Amoy Testnet",
    currency: "MATIC",
    explorerUrl: "https://amoy.polygonscan.com",
    rpcUrl: import.meta.env.VITE_INFURA_RPC_URL,
};

const metadata = {
    name: "My Website",
    description: "My Website description",
    url: "http://localhost:5173/", // origin must match your domain & subdomain
    icons: ["http://localhost:5173/"],
};

export const configWeb3Modal = () =>
    createWeb3Modal({
        ethersConfig: defaultConfig({ metadata }),
        chains: [polygonAmoy],
        projectId: import.meta.env.VITE_PROJECT_ID,
        enableAnalytics: false, // Optional - defaults to your Cloud configuration
    });
