import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const A_LONG_TIME = 90;
const A_VERY_LONG_TIME = 600;
/** After three good answers a card is not due again for years. */
const YEARS = 4000;
/** Longer than any interval the scheduler gives, so the card is due whatever its history. */
const LONGER_THAN_ANY_INTERVAL = 40000;

given("the learner gave the first card a note and a picture, and answered it easy", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(1);
    await webApp.settings.close();
    await webApp.home.startReviewing();
    await webApp.review.memoryAid.addNote("Sounds like mule");
    await webApp.review.memoryAid.addPicture();
    await webApp.review.rate("easy");
    await webApp.review.finishSession();
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(0);
    await webApp.settings.close();
  });

  when("they remember it well once more and it comes back", () => {
    beforeEach(async ({webApp}) => {
      await reviewWellOnALaterDay(webApp, A_LONG_TIME);
      await webApp.passDays(A_VERY_LONG_TIME);
      await webApp.home.startReviewing();
    });

    then("they are not yet offered to remove the note and picture", async ({webApp}) => {
      expect(await webApp.review.memoryAid.isRemovingTheAidsOffered()).toBe(false);
    });
  });

  when("they remember it well twice more and it comes back", () => {
    beforeEach(async ({webApp}) => {
      await reviewWellOnALaterDay(webApp, A_LONG_TIME);
      await reviewWellOnALaterDay(webApp, A_VERY_LONG_TIME);
      await webApp.passDays(YEARS);
      await webApp.home.startReviewing();
    });

    then("they are offered to remove the note and picture", async ({webApp}) => {
      expect(await webApp.review.memoryAid.isRemovingTheAidsOffered()).toBe(true);
    });

    when("they remove them", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.memoryAid.removeTheAids();
      });

      then("the card has no note and no picture, and the offer is gone", async ({webApp}) => {
        expect(await webApp.review.memoryAid.getNote()).toBeUndefined();
        expect(await webApp.review.memoryAid.isPictureShown()).toBe(false);
        expect(await webApp.review.memoryAid.isRemovingTheAidsOffered()).toBe(false);
      });
    });

    when("they keep them", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.memoryAid.keepTheAids();
      });

      then("the note and picture stay, and the offer is gone", async ({webApp}) => {
        expect(await webApp.review.memoryAid.getNote()).toBe("Sounds like mule");
        expect(await webApp.review.memoryAid.isPictureShown()).toBe(true);
        expect(await webApp.review.memoryAid.isRemovingTheAidsOffered()).toBe(false);
      });

      when("they remember it well once more and it comes back", () => {
        beforeEach(async ({webApp}) => {
          await webApp.review.rate("good");
          await webApp.review.finishSession();
          await webApp.passDays(LONGER_THAN_ANY_INTERVAL);
          await webApp.home.startReviewing();
        });

        then("they are not offered again so soon", async ({webApp}) => {
          expect(await webApp.review.memoryAid.isRemovingTheAidsOffered()).toBe(false);
        });
      });
    });
  });
});

async function reviewWellOnALaterDay(webApp: WebApp, days: number): Promise<void> {
  await webApp.passDays(days);
  await webApp.home.startReviewing();
  await webApp.review.rate("good");
  await webApp.review.finishSession();
}
