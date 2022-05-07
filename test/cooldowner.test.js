const Cooldowner = artifacts.require("Cooldowner");
const truffleAssert = require('truffle-assertions');
const time = require("./helpers/time");

contract("Cooldowner", function (accounts) {

  const [owner, user1, user2] = accounts;

  const SECONDS_IN_ONE_DAY = time.duration.days(1);

  const ALREADY_CLAIMED_ERROR_MSG = "Already claimed a prize today!";

  let cooldowner;

  beforeEach(async () => {
    cooldowner = await Cooldowner.new();
  })

  describe('initizliation', () => {
  
    it('starts users with 0 prizes', async () => {
      
      const ownerPrizeCount = (await cooldowner.getMyPrizes()).toNumber();
      const user1PrizeCount = (await cooldowner.getMyPrizes({ from: user1 })).toNumber();
      const user2PrizeCount = (await cooldowner.getMyPrizes({ from: user2 })).toNumber();
      
      expect(ownerPrizeCount).to.equal(0);
      expect(user1PrizeCount).to.equal(0);
      expect(user2PrizeCount).to.equal(0);
      
    })
    
  })

  describe('claiming prizes', () => {

    it('users can claim a prize', async () => {

      await cooldowner.claimDailyPrize()
      await cooldowner.claimDailyPrize({ from: user1 })
      await cooldowner.claimDailyPrize({ from: user2 })

      const ownerPrizeCount = (await cooldowner.getMyPrizes()).toNumber();
      const user1PrizeCount = (await cooldowner.getMyPrizes({ from: user1 })).toNumber();
      const user2PrizeCount = (await cooldowner.getMyPrizes({ from: user2 })).toNumber();

      expect(ownerPrizeCount).to.equal(1);
      expect(user1PrizeCount).to.equal(1);
      expect(user2PrizeCount).to.equal(1);

    })

    it('user can claim another prize after one day', async () => {

      await cooldowner.claimDailyPrize();

      await time.increase(time.duration.days(1));

      await cooldowner.claimDailyPrize();

      const ownerPrizeCount = (await cooldowner.getMyPrizes()).toNumber();

      expect(ownerPrizeCount).to.equal(2);

    })

    it('a user can claim three prizes over three days', async () => {

      await cooldowner.claimDailyPrize();
      await time.increase(time.duration.days(1));

      await cooldowner.claimDailyPrize();
      await time.increase(time.duration.days(1));

      await cooldowner.claimDailyPrize();

      const ownerPrizeCount = (await cooldowner.getMyPrizes()).toNumber();
      expect(ownerPrizeCount).to.equal(3);
    })

  })

  describe('reverting when trying to claim prize too soon', () => {

    it('reverts when a user tries to claim two prizes', async () => {

      await cooldowner.claimDailyPrize();

      await truffleAssert.reverts(cooldowner.claimDailyPrize(), ALREADY_CLAIMED_ERROR_MSG);
    })

    it('reverts when a user tries to claim prize just before the one day cooldown', async () => {

      await cooldowner.claimDailyPrize();

      await time.increase(time.duration.days(0.9999));

      await truffleAssert.reverts(cooldowner.claimDailyPrize(), ALREADY_CLAIMED_ERROR_MSG);
    })

    it('users cannot claim prizes even one second early!', async () => {

      await cooldowner.claimDailyPrize();
      await time.increase(time.duration.seconds(SECONDS_IN_ONE_DAY - 1));

      await truffleAssert.reverts(
        cooldowner.claimDailyPrize(),
        "Already claimed a prize today!"
      );

      await time.increase(time.duration.seconds(1));
      await cooldowner.claimDailyPrize();

      const ownerPrizeCount = (await cooldowner.getMyPrizes()).toNumber();
      expect(ownerPrizeCount).to.equal(2);

    })

  })

});
