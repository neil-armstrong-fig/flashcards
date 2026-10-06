import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const A_LONG_TIME = 90;
/** A card answered easy and then good more than once is not due again for months. */
const A_VERY_LONG_TIME = 600;

given("the learner has chosen that one lapse makes a card struggle, and learned the first card of the deck", () => {
  beforeEach(async ({webApp}) => {
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
  });

  then("nothing is struggling", async ({webApp}) => {
    expect(await webApp.home.getStrugglingCount()).toBe(0);
  });

  when("they come back later and forget it, then remember it straight away", () => {
    beforeEach(async ({webApp}) => {
      await webApp.passDays(A_LONG_TIME);
      await webApp.home.startReviewing();
      await webApp.review.rate("again");
      await webApp.review.rate("good");
      await webApp.review.finishSession();
    });

    then("the home screen says one card is struggling", async ({webApp}) => {
      expect(await webApp.home.getStrugglingCount()).toBe(1);
    });

    when("they open the list", () => {
      beforeEach(async ({webApp}) => {
        await webApp.home.openStruggling();
      });

      then("it shows the card, forgotten once, and still in their reviews", async ({webApp}) => {
        expect(await webApp.struggling.getCards()).toEqual([{front: "물", back: "water", lapses: 1, status: ""}]);
      });
    });

    when("they then remember it correctly three times running, on later days", () => {
      beforeEach(async ({webApp}) => {
        await reviewWellOnALaterDay(webApp);
        await reviewWellOnALaterDay(webApp);
      });

      then("it is struggling no longer, because its recent answers were good", async ({webApp}) => {
        expect(await webApp.home.getStrugglingCount()).toBe(0);
      });
    });

    when("they remember it correctly only twice, and then forget it again", () => {
      beforeEach(async ({webApp}) => {
        await reviewWellOnALaterDay(webApp);
        await webApp.passDays(A_LONG_TIME);
        await webApp.home.startReviewing();
        await webApp.review.rate("again");
        await webApp.review.rate("good");
        await webApp.review.finishSession();
      });

      then("it is still struggling", async ({webApp}) => {
        expect(await webApp.home.getStrugglingCount()).toBe(1);
      });
    });
  });
});

given("the learner has just forgotten and remembered a card, and the session is over", () => {
  beforeEach(async ({webApp}) => {
    await learnTheFirstCard(webApp, {strugglingAfter: 1});
    await webApp.passDays(A_LONG_TIME);
    await webApp.home.startReviewing();
    await webApp.review.rate("again");
    await webApp.review.rate("good");
  });

  then("the end of the session points out that one card is struggling", async ({webApp}) => {
    expect(await webApp.review.struggling.getStrugglingNotice()).toBe(1);
  });

  when("they follow it", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.struggling.openStrugglingFromSession();
    });

    then("they are on the list", async ({webApp}) => {
      expect((await webApp.struggling.getCards()).map(card => card.front)).toEqual(["물"]);
    });
  });
});

given("the learner has finished a session with nothing struggling", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(1);
    await webApp.settings.close();
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
  });

  then("the end of the session says nothing about struggling", async ({webApp}) => {
    expect(await webApp.review.struggling.getStrugglingNotice()).toBe(0);
  });
});

given("the learner is on the first card of the deck, with the default of eight lapses", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(1);
    await webApp.settings.close();
    await webApp.home.startReviewing();
  });

  then("it is not on the Struggling list", async ({webApp}) => {
    expect(await webApp.review.struggling.isOnStrugglingList()).toBe(false);
  });

  when("they say it is hard", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.struggling.markHard();
    });

    then("it is on the list at once, though it has never been forgotten", async ({webApp}) => {
      expect(await webApp.review.struggling.isOnStrugglingList()).toBe(true);
    });

    when("they answer it, go home and open the list", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate("easy");
        await webApp.review.finishSession();
        await webApp.home.openStruggling();
      });

      then("it is listed with no lapses, because it was marked, not forgotten", async ({webApp}) => {
        expect(await webApp.struggling.getCards()).toEqual([{front: "물", back: "water", lapses: 0, status: ""}]);
      });
    });

    when("they then remember it three times running, on later days", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.rate("easy");
        await webApp.review.finishSession();
        await webApp.home.openSettings();
        await webApp.settings.limits.setNewCardsPerDay(0);
        await webApp.settings.close();
        await reviewWellOnALaterDay(webApp, A_VERY_LONG_TIME);
        await reviewWellOnALaterDay(webApp, A_VERY_LONG_TIME);
      });

      then("it is struggling no longer", async ({webApp}) => {
        expect(await webApp.home.getStrugglingCount()).toBe(0);
      });
    });
  });
});

given("the learner has chosen that struggling cards are set aside", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.struggling.setStrugglingAfter(1);
    await webApp.settings.struggling.setSetAsideWhenStruggling(true);
    await webApp.settings.limits.setNewCardsPerDay(1);
    await webApp.settings.close();
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
    await webApp.review.finishSession();
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(0);
    await webApp.settings.close();
  });

  when("they forget a card that was being reviewed", () => {
    beforeEach(async ({webApp}) => {
      await webApp.passDays(A_LONG_TIME);
      await webApp.home.startReviewing();
      await webApp.review.rate("again");
    });

    then("it is not shown again, and the session is over", async ({webApp}) => {
      expect(await webApp.review.isSessionComplete()).toBe(true);
    });

    when("they go home and open the list", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.finishSession();
        await webApp.home.openStruggling();
      });

      then("it is listed, as suspended", async ({webApp}) => {
        expect(await webApp.struggling.getCards()).toEqual([
          {front: "물", back: "water", lapses: 1, status: "Suspended"},
        ]);
      });

      when("they bring it back", () => {
        beforeEach(async ({webApp}) => {
          await webApp.struggling.bringBack("물");
        });

        then("it is no longer suspended", async ({webApp}) => {
          expect(await webApp.struggling.getCards()).toEqual([{front: "물", back: "water", lapses: 1, status: ""}]);
        });

        when("they go home", () => {
          beforeEach(async ({webApp}) => {
            await webApp.struggling.close();
          });

          then("it is waiting in their reviews again", async ({webApp}) => {
            expect(await webApp.home.getCardsDueToday()).toBe(1);
          });
        });
      });
    });
  });
});

given("the learner is not told what makes a card struggle", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
  });

  then("it takes eight lapses, and cards are not set aside", async ({webApp}) => {
    expect(await webApp.settings.struggling.getStrugglingAfter()).toBe(8);
    expect(await webApp.settings.struggling.isSetAsideWhenStruggling()).toBe(false);
  });
});

async function learnTheFirstCard(webApp: WebApp, {strugglingAfter}: {readonly strugglingAfter: number}): Promise<void> {
  await webApp.home.openSettings();
  await webApp.settings.struggling.setStrugglingAfter(strugglingAfter);
  await webApp.settings.limits.setNewCardsPerDay(1);
  await webApp.settings.close();
  await webApp.home.startReviewing();
  await webApp.review.rate("easy");
  await webApp.review.finishSession();
  await webApp.home.openSettings();
  await webApp.settings.limits.setNewCardsPerDay(0);
  await webApp.settings.close();
}

async function reviewWellOnALaterDay(webApp: WebApp, days: number = A_LONG_TIME): Promise<void> {
  await webApp.passDays(days);
  await webApp.home.startReviewing();
  await webApp.review.rate("good");
  await webApp.review.finishSession();
}
