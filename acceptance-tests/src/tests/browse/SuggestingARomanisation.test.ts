import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the list of every card and starts a card of their own", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  when("they type 학교 as the Korean word", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.cardForm.typeNewCardWord("학교");
    });

    then("how it is said fills itself in as it is pronounced, not as it is spelt", async ({webApp}) => {
      expect(await webApp.browse.cardForm.getNewCardRomanisation()).toBe("hakgyo");
    });

    when("they carry on typing, making it 학교생", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.cardForm.typeNewCardWord("학교생");
      });

      then("the suggestion follows the word", async ({webApp}) => {
        expect(await webApp.browse.cardForm.getNewCardRomanisation()).toBe("hakgyosaeng");
      });
    });

    when("they correct it to something of their own and then change the word", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.cardForm.typeNewCardRomanisation("hak-gyo");
        await webApp.browse.cardForm.typeNewCardWord("학교생");
      });

      then("their correction is left alone", async ({webApp}) => {
        expect(await webApp.browse.cardForm.getNewCardRomanisation()).toBe("hak-gyo");
      });
    });

    when("they clear it and then change the word", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.cardForm.typeNewCardRomanisation("");
        await webApp.browse.cardForm.typeNewCardWord("학교생");
      });

      then("the suggestion comes back", async ({webApp}) => {
        expect(await webApp.browse.cardForm.getNewCardRomanisation()).toBe("hakgyosaeng");
      });
    });
  });

  when("they add 코끼리, elephant, and never touch how it is said", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.cardForm.addCard({word: "코끼리", meaning: "elephant"});
    });

    then("the card has the suggestion as how it is said", async ({webApp}) => {
      expect(await webApp.browse.getRows()).toContainEqual({
        front: "코끼리",
        back: "elephant",
        hint: "kokkiri",
        status: "New",
      });
    });
  });
});
