import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is partway through a session when another release of the app becomes available", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
    await webApp.releaseUpdate.makeAvailable();
  });

  then("the app offers to refresh, with the new release waiting", async ({webApp}) => {
    expect(await webApp.releaseUpdate.isOffered()).toBe(true);
    expect(await webApp.releaseUpdate.isWaiting()).toBe(true);
  });

  when("they leave it until later", () => {
    beforeEach(async ({webApp}) => {
      await webApp.releaseUpdate.leaveUntilLater();
    });

    then("the offer goes away and the session carries on", async ({webApp}) => {
      expect(await webApp.releaseUpdate.isDismissed()).toBe(true);
      expect(await webApp.review.getCardsRemaining()).toBe(19);
    });
  });

  when("they refresh", () => {
    beforeEach(async ({webApp}) => {
      await webApp.releaseUpdate.refresh();
    });

    then("the new release is running and the answer they gave was kept", async ({webApp}) => {
      expect(await webApp.releaseUpdate.isAvailableReleaseRunning()).toBe(true);
      expect(await webApp.home.getCardsDueToday()).toBe(19);
    });
  });
});
