import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the settings", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("they start at twenty new cards a day", async ({webApp}) => {
    expect(await webApp.settings.limits.getNewCardsPerDay()).toBe(20);
  });

  then("the reviews a day are locked to ten for each new card, so two hundred", async ({webApp}) => {
    expect(await webApp.settings.limits.isReviewsPerDayLocked()).toBe(true);
    expect(await webApp.settings.limits.getMaxReviewsPerDay()).toBe(200);
  });

  when("they choose three new cards a day", () => {
    beforeEach(async ({webApp}) => {
      await webApp.settings.limits.setNewCardsPerDay(3);
    });

    then("the reviews a day follow, at thirty", async ({webApp}) => {
      expect(await webApp.settings.limits.getMaxReviewsPerDay()).toBe(30);
    });

    when("they unlock the reviews and choose seven", () => {
      beforeEach(async ({webApp}) => {
        await webApp.settings.limits.unlockReviewsPerDay();
        await webApp.settings.limits.setMaxReviewsPerDay(7);
      });

      then("the new cards a day stay at three", async ({webApp}) => {
        expect(await webApp.settings.limits.getNewCardsPerDay()).toBe(3);
        expect(await webApp.settings.limits.getMaxReviewsPerDay()).toBe(7);
      });

      when("they lock them again", () => {
        beforeEach(async ({webApp}) => {
          await webApp.settings.limits.lockReviewsPerDay();
        });

        then("the reviews a day are back to ten for each new card", async ({webApp}) => {
          expect(await webApp.settings.limits.getMaxReviewsPerDay()).toBe(30);
        });
      });
    });
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

    when("they open the settings again", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.openSettings();
      });

      then("the reviews a day stay as they were, so pausing new cards does not pause reviewing", async ({webApp}) => {
        expect(await webApp.settings.limits.getMaxReviewsPerDay()).toBe(200);
      });
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
