const Cooldowner = artifacts.require("Cooldowner");
const truffleAssert = require('truffle-assertions');
const time = require("./helpers/time");

contract("Cooldowner", function (accounts) {

  const [owner, user1, user2] = accounts;

  const SECONDS_IN_ONE_DAY = 86400;

  let cooldowner;

  beforeEach(async () => {
    cooldowner = await Cooldowner.new();

  })

  it("should assert true", async function () {
    return assert.isTrue(true);
  });

  it('has a foo string', async () => {

    const fooValue = await cooldowner.foo();

    expect(fooValue).to.equal("bar");

  })

  it('starts users with 0 prizes', async () => {

    const ownerPrizeCount = (await cooldowner.getMyPrizes()).toNumber();
    const user1PrizeCount = (await cooldowner.getMyPrizes({ from: user1 })).toNumber();
    const user2PrizeCount = (await cooldowner.getMyPrizes({ from: user2 })).toNumber();

    expect(ownerPrizeCount).to.equal(0);
    expect(user1PrizeCount).to.equal(0);
    expect(user2PrizeCount).to.equal(0);

  })

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

  it('reverts when a user tries to claim two prizes', async () => {

    await cooldowner.claimDailyPrize();

    await truffleAssert.reverts(
      cooldowner.claimDailyPrize(),
      "Already claimed a prize today!"
    );

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

  it('a user must wait a full day before claiming another prize', async () => {

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

});
