// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.25 <0.9.0;

import { CaddieGPT } from "../src/CaddieGPT.sol";

import { BaseScript } from "./Base.s.sol";
import { PRBTest } from "@prb/test/src/PRBTest.sol";

contract Deploy is PRBTest {
    CaddieGPT public caddieGPT;

    address public initialOracleAddress = 0x68EC9556830AD097D661Df2557FBCeC166a0A075;
    string public knowledgeBase = "Qmb5fHYXffFquUaSZhJtsAoUEBjrGmuF1VTCcjCjgJmHfz";
    string public instruction = "You are helpful!";

    function run() public {
        vm.startBroadcast(vm.envUint("TEST_PRIVATE_KEY"));
        caddieGPT = new CaddieGPT(initialOracleAddress, knowledgeBase, instruction);
        vm.stopBroadcast();
    }
}
