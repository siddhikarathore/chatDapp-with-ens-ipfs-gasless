// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ENService} from "../src/ENService.sol";
import {Chatzone} from "../src/Chatzone.sol";

contract DeployScript is Script {
    ENService public ensContract;
    Chatzone public chatzoneContract;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy ENService first
        ensContract = new ENService();
        console.log("ENService deployed to:", address(ensContract));

        // Deploy Chatzone with ENService address
        chatzoneContract = new Chatzone(address(ensContract));
        console.log("Chatzone deployed to:", address(chatzoneContract));

        vm.stopBroadcast();

        // Log deployment addresses for easy copy
        console.log("\n=== Deployment Summary ===");
        console.log("Network: Polygon Amoy Testnet");
        console.log("ENService Contract:", address(ensContract));
        console.log("Chatzone Contract:", address(chatzoneContract));
        console.log("==========================\n");
    }
}
