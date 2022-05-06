// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Cooldowner {

    string public foo = "bar";

    uint cooldownTime = 1 days;

    mapping(address => uint) readyTimes;
    mapping(address => uint) prizes;

    function _triggerCooldown(address account) internal {
        readyTimes[account] = block.timestamp + cooldownTime;
    }

    function _isReady(address account) internal view returns (bool) {
        return readyTimes[account] <= block.timestamp;
    }

    // Can one be called once per day
    function claimDailyPrize() external {
        require(_isReady(msg.sender), "Already claimed a prize today!");
        prizes[msg.sender]++;
        _triggerCooldown(msg.sender);
    }

    function getMyPrizes() external view returns (uint) {
      return prizes[msg.sender];
    }

}
