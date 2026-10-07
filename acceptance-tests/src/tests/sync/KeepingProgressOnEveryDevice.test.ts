import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has rated the first card easy on one device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
    await webApp.reload();
    await webApp.sync.waitUntilUpToDate();
  });

  when("they open the app on another device", () => {
    beforeEach(async ({secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
    });

    then("that card is not waiting there either", async ({secondDevice}) => {
      expect(await secondDevice.home.getCardsDueToday()).toBe(19);
    });

    when("they start reviewing there", () => {
      beforeEach(async ({secondDevice}) => {
        await secondDevice.home.startReviewing();
      });

      then("reviewing carries on with the next card", async ({secondDevice}) => {
        expect(await secondDevice.review.getFrontText()).toBe("밥");
      });
    });
  });
});

given("the learner has put the first card aside on one device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.suspend();
    await webApp.reload();
    await webApp.sync.waitUntilUpToDate();
  });

  when("they open the app on another device", () => {
    beforeEach(async ({secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
    });

    then("that card is not waiting there", async ({secondDevice}) => {
      expect(await secondDevice.home.getCardsDueToday()).toBe(19);
    });
  });
});

given("the learner has rated the first card on both devices before either heard from the other", () => {
  beforeEach(async ({webApp, secondDevice}) => {
    await secondDevice.begin();
    // Both are on the same card before either answers it, so neither can hear of the other's answer first.
    await webApp.home.startReviewing();
    await secondDevice.home.startReviewing();
    await webApp.review.rate("easy");
    await secondDevice.review.rate("good");
  });

  when("both devices catch up", () => {
    beforeEach(async ({webApp, secondDevice}) => {
      await webApp.reload();
      await webApp.sync.waitUntilUpToDate();
      await secondDevice.reload();
      await secondDevice.sync.waitUntilUpToDate();
    });

    then("each shows that card once, as answered and not waiting", async ({webApp, secondDevice}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(19);
      expect(await secondDevice.home.getCardsDueToday()).toBe(19);
    });
  });
});
