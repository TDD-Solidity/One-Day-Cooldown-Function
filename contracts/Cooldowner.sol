// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Cooldowner {
    uint256 cooldownTime = 1 days;

    mapping(address => uint256) readyTimes;
    mapping(address => uint256) prizes;

    // Can one be called once per day
    function claimDailyPrize() external isReady(msg.sender) {
        prizes[msg.sender]++;
        _triggerCooldown(msg.sender);
    }

    modifier isReady(address account) {
        require(
            readyTimes[account] < block.timestamp,
            "Already claimed a prize today!"
        );
        _;
    }

    function _triggerCooldown(address account) internal {
        readyTimes[account] = block.timestamp + cooldownTime;
    }

    function getMyPrizes() external view returns (uint256) {
        return prizes[msg.sender];
    }
}
