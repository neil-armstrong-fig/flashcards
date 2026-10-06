import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  then("it is not narrowed to a deck", async ({webApp}) => {
    expect(await webApp.browse.getDeckFilter()).toBe("all");
  });

  when("they choose the hiragana deck", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.chooseDeck("ja-hiragana");
    });

    then("only its 71 words, each both ways, are listed", async ({webApp}) => {
      expect(await webApp.browse.getCardCount()).toBe(142);
    });

    when("they search for the sound shi", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.search("shi");
      });

      then("the hiragana is listed and the katakana is not", async ({webApp}) => {
        const fronts = (await webApp.browse.getRows()).map(row => row.front);

        expect(fronts).toContain("し");
        expect(fronts).not.toContain("シ");
      });
    });

    when("they choose every deck again", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.chooseDeck("all");
      });

      then("more than the hiragana is listed", async ({webApp}) => {
        expect(await webApp.browse.getCardCount()).toBeGreaterThan(208);
      });
    });
  });

  when("they choose the katakana deck", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.chooseDeck("ja-katakana");
    });

    then("its 71 words, each both ways, are listed", async ({webApp}) => {
      expect(await webApp.browse.getCardCount()).toBe(142);
    });
  });

  when("they choose the combined hiragana deck", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.chooseDeck("ja-hiragana-combined");
    });

    then("only its 33 words, each both ways, are listed", async ({webApp}) => {
      expect(await webApp.browse.getCardCount()).toBe(66);
    });
  });

  when("they choose the katakana deck for foreign sounds", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.chooseDeck("ja-katakana-foreign");
    });

    then("only its 23 words, each both ways, are listed", async ({webApp}) => {
      expect(await webApp.browse.getCardCount()).toBe(46);
    });
  });
});
