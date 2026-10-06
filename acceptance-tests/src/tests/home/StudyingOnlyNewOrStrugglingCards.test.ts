import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const A_LONG_TIME = 90;
const A_VERY_LONG_TIME = 400;

given("the learner opens the app for the first time, when every card waiting is new", () => {
  then("there is only one way to study the deck, since a narrower session would be the same", async ({webApp}) => {
    expect(await webApp.home.canStudyOnly("ko-starter", "new")).toBe(false);
    expect(await webApp.home.canStudyOnly("ko-starter", "struggling")).toBe(false);
  });
});

given("the learner has a struggling card due for review, and two new cards waiting", () => {
  beforeEach(async ({webApp}) => {
    await makeTheFirstCardStrugglingAndDue(webApp);
  });

  then("they are offered to study only the new cards, and only the struggling ones", async ({webApp}) => {
    expect(await webApp.home.canStudyOnly("ko-starter", "new")).toBe(true);
    expect(await webApp.home.canStudyOnly("ko-starter", "struggling")).toBe(true);
  });

  then("the offers say how many each holds", async ({webApp}) => {
    expect(await webApp.home.getStudyOnlyCount("ko-starter", "new")).toBe(2);
    expect(await webApp.home.getStudyOnlyCount("ko-starter", "struggling")).toBe(1);
  });

  when("they study only the struggling cards", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewingOnly("ko-starter", "struggling");
    });

    then("the struggling card comes up, and nothing else is waiting behind it", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("물");
      expect(await webApp.review.getCardsRemaining()).toBe(1);
    });

    when("they answer it well", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate("good");
      });

      then("the session is over, though new cards are still waiting", async ({webApp}) => {
        expect(await webApp.review.isSessionComplete()).toBe(true);
      });

      when("they go home", () => {
        beforeEach(async ({webApp}) => {
          await webApp.review.finishSession();
        });

        then("the new cards were not touched", async ({webApp}) => {
          expect(await webApp.home.getDeckDueCounts("ko-starter")).toMatchObject({new: 2});
        });
      });
    });
  });

  when("they study only the new cards", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewingOnly("ko-starter", "new");
    });

    then("the first new card comes up, with only the new cards behind it", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("밥");
      expect(await webApp.review.getCardsRemaining()).toBe(2);
    });

    when("they answer both", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate("good");
        await webApp.review.rate("good");
      });

      then("the session is over, though a review is still waiting", async ({webApp}) => {
        expect(await webApp.review.isSessionComplete()).toBe(true);
      });

      when("they go home", () => {
        beforeEach(async ({webApp}) => {
          await webApp.review.finishSession();
        });

        then("the struggling card is still waiting for review", async ({webApp}) => {
          expect(await webApp.home.getDeckDueCounts("ko-starter")).toMatchObject({review: 1});
        });
      });
    });
  });

  when("they study the whole deck as usual", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.startReviewing("ko-starter");
    });

    then("everything is in the session", async ({webApp}) => {
      expect(await webApp.review.getCardsRemaining()).toBe(3);
    });
  });
});

async function makeTheFirstCardStrugglingAndDue(webApp: WebApp): Promise<void> {
  await webApp.home.openSettings();
  await webApp.settings.struggling.setStrugglingAfter(1);
  await webApp.settings.limits.setNewCardsPerDay(1);
  await webApp.settings.close();
  await webApp.home.startReviewing();
  await webApp.review.rate("easy");
  await webApp.review.finishSession();
  await webApp.home.openSettings();
  await webApp.settings.limits.setNewCardsPerDay(0);
  await webApp.settings.close();
  await webApp.passDays(A_LONG_TIME);
  await webApp.home.startReviewing();
  await webApp.review.rate("again");
  await webApp.review.rate("good");
  await webApp.review.finishSession();
  await webApp.home.openSettings();
  await webApp.settings.limits.setNewCardsPerDay(2);
  await webApp.settings.close();
  await webApp.passDays(A_VERY_LONG_TIME);
}
