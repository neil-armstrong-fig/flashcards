import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const CARDS_IN_THE_STARTER_DECK = 20;

given("the learner is reviewing the first card of the starter deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
  });

  when("they bury it", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.bury();
    });

    then("the next card is shown and one fewer remains", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("밥");
      expect(await webApp.review.getCardsRemaining()).toBe(CARDS_IN_THE_STARTER_DECK - 1);
    });

    when("they reopen the app and start again the same day", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
        await webApp.home.startReviewing();
      });

      then("it is still hidden", async ({webApp}) => {
        expect(await webApp.review.getFrontText()).toBe("밥");
      });
    });

    when("a day goes by", () => {
      beforeEach(async ({webApp}) => {
        await webApp.passDays(1);
        await webApp.home.startReviewing();
      });

      then("it is back, first in line", async ({webApp}) => {
        expect(await webApp.review.getFrontText()).toBe("물");
        expect(await webApp.review.getCardsRemaining()).toBe(CARDS_IN_THE_STARTER_DECK);
      });
    });
  });

  when("they suspend it", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.suspend();
    });

    then("the next card is shown and one fewer remains", async ({webApp}) => {
      expect(await webApp.review.getFrontText()).toBe("밥");
      expect(await webApp.review.getCardsRemaining()).toBe(CARDS_IN_THE_STARTER_DECK - 1);
    });

    when("a month goes by", () => {
      beforeEach(async ({webApp}) => {
        await webApp.passDays(30);
      });

      then("it has still not come back", async ({webApp}) => {
        expect(await webApp.home.getCardsDueToday()).toBe(CARDS_IN_THE_STARTER_DECK - 1);
      });
    });

    when("they bring suspended cards back from the settings", () => {
      beforeEach(async ({webApp}) => {
        await webApp.reload();
        await webApp.home.openSettings();
      });

      then("one card is shown as suspended", async ({webApp}) => {
        expect(await webApp.settings.struggling.getSuspendedCount()).toBe(1);
      });

      when("they bring it back and go home", () => {
        beforeEach(async ({webApp}) => {
          await webApp.settings.struggling.unsuspendAll();
          await webApp.settings.close();
        });

        then("every card is waiting again", async ({webApp}) => {
          expect(await webApp.home.getCardsDueToday()).toBe(CARDS_IN_THE_STARTER_DECK);
        });
      });
    });
  });
});
