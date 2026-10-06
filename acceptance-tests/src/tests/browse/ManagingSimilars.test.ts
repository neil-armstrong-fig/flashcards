import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the similars of 물 from the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.openSimilars("물");
  });

  then("the one that came with the word is there, and cannot be deleted", async ({webApp}) => {
    expect(await webApp.browse.similar.getWords()).toEqual(["불"]);
    expect(await webApp.browse.similar.canDelete("불")).toBe(false);
  });

  when("they add 볼", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.similar.add("볼");
    });

    then("it is there beside 불, and can be deleted", async ({webApp}) => {
      expect(await webApp.browse.similar.getWords()).toEqual(["불", "볼"]);
      expect(await webApp.browse.similar.canDelete("볼")).toBe(true);
    });

    when("they delete it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.similar.delete("볼");
      });

      then("it is gone and 불 is left", async ({webApp}) => {
        expect(await webApp.browse.similar.getWords()).toEqual(["불"]);
      });

      when("they reopen the app and look again", () => {
        beforeEach(async ({webApp}) => {
          await webApp.reload();
          await webApp.home.openBrowse();
          await webApp.browse.openSimilars("물");
        });

        then("it is still gone, because that was kept online too", async ({webApp}) => {
          expect(await webApp.browse.similar.getWords()).toEqual(["불"]);
        });
      });
    });

    when("they open the similars on the English card of the same word", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.openSimilars("water");
      });

      then("the same words are there", async ({webApp}) => {
        expect(await webApp.browse.similar.getWords()).toEqual(["불", "볼"]);
      });
    });
  });
});

given("the learner has added 볼 to 물 while reviewing", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.showAnswer();
    await webApp.review.similar.open();
    await webApp.review.similar.add("볼");
  });

  when("they delete it there", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.similar.delete("볼");
    });

    then("it is gone from the card", async ({webApp}) => {
      expect(await webApp.review.similar.getWords()).toEqual(["불"]);
    });
  });
});
