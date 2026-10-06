import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner has not studied yet", () => {
  then("no look ahead is offered, as no card is waiting for a later day", async ({webApp}) => {
    expect(await webApp.home.getLookAheadCount("ko-starter")).toBe(0);
  });
});

given("the learner has answered one card easily, so it is not due for days, and is back on the home screen", () => {
  let statusBefore = "";

  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(1);
    await webApp.settings.close();
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
    await webApp.review.finishSession();
    statusBefore = await statusOfWater(webApp);
  });

  then("the deck offers a look ahead at that one card", async ({webApp}) => {
    expect(await webApp.home.getLookAheadCount("ko-starter")).toBe(1);
  });

  when("they look ahead", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.lookAhead("ko-starter");
    });

    then("the screen says the answers are not kept, and one card is left", async ({webApp}) => {
      expect(await webApp.review.isLookingAhead()).toBe(true);
      expect(await webApp.review.getCardsRemaining()).toBe(1);
    });

    when("they show the answer and move on", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.showAnswer();
        await webApp.review.next();
      });

      then("nothing is left to look at", async ({webApp}) => {
        expect(await webApp.review.isSessionComplete()).toBe(true);
      });

      when("they go home", () => {
        beforeEach(async ({webApp}) => {
          await webApp.review.finishSession();
        });

        then("it still counts one card answered today, not two", async ({webApp}) => {
          expect(await webApp.home.getCardsReviewedToday()).toBe(1);
        });

        then("the card comes back when it did before", async ({webApp}) => {
          expect(await statusOfWater(webApp)).toBe(statusBefore);
        });
      });
    });
  });
});

async function statusOfWater(webApp: WebApp): Promise<string> {
  await webApp.home.openBrowse();

  const status = (await webApp.browse.getRows()).find(row => row.front === "물")?.status ?? "";

  await webApp.browse.close();

  return status;
}
