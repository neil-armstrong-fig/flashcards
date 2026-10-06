import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the settings", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("they start at twenty new cards a day", async ({webApp}) => {
    expect(await webApp.settings.limits.getNewCardsPerDay()).toBe(20);
  });

  when("they choose three new cards a day and go back", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.limits.setNewCardsPerDay(3);
      await webApp.settings.close();
    });

    then("only three cards are due today", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(3);
    });

    when("they start reviewing", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.startReviewing();
      });

      then("three cards remain in the session", async ({webApp}) => {
        expect(await webApp.review.getCardsRemaining()).toBe(3);
      });
    });

    when("they reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
      });

      then("only three cards are still due today", async ({webApp}) => {
        expect(await webApp.home.getCardsDueToday()).toBe(3);
      });
    });
  });

  when("they choose no new cards at all and go back", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.limits.setNewCardsPerDay(0);
      await webApp.settings.close();
    });

    then("nothing is due today", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(0);
    });
  });
});

given("the learner has learned two of three new cards today", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(3);
    await webApp.settings.close();
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
    await webApp.review.rate("easy");
  });

  when("they raise the allowance to five", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.rate("easy");
      await webApp.review.finishSession();
      await webApp.home.openSettings();
      await webApp.settings.limits.setNewCardsPerDay(5);
      await webApp.settings.close();
    });

    then("two more cards are due, because three were already learned", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(2);
    });
  });
});
