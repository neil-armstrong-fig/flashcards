import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

const CARDS_IN_THE_STARTER_DECK = 20;
/** The starter deck and the two kana decks, 482 cards between them, before any card the learner makes. */
const CARDS_IN_EVERY_DECK = 482;

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  then("they can add a card, and none of the deck's own cards can be deleted", async ({webApp}) => {
    expect(await webApp.browse.cardForm.canAddCard()).toBe(true);
    expect(await webApp.browse.cardForm.canDeleteCard("물")).toBe(false);
  });

  when("they add a card for 코끼리, elephant, kokkiri", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.cardForm.addCard({word: "코끼리", meaning: "elephant", romanisation: "kokkiri"});
    });

    then("both directions are listed, as new cards", async ({webApp}) => {
      const rows = await webApp.browse.getRows();

      expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK + 2);
      expect(rows).toContainEqual({front: "코끼리", back: "elephant", hint: "kokkiri", status: "New"});
      expect(rows).toContainEqual({front: "elephant", back: "코끼리", hint: "kokkiri", status: "New"});
    });

    when("they play the Korean card and then the English one", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.play("코끼리");
        await webApp.browse.play("elephant");
      });

      then("the Korean word is heard from either card, in the voice chosen", async ({webApp}) => {
        const [korean, english] = await webApp.review.sound.getRecordingsPlayed();

        expect(korean).toMatchObject({language: "ko", voice: "female", speed: "normal", found: true});
        expect(english).toMatchObject({language: "ko", found: true});
      });
    });

    when("they switch to the male voice and play it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.switchVoice();
        await webApp.browse.play("코끼리");
      });

      then("the male recording is there too, because every version was kept", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(recording).toMatchObject({voice: "male", found: true});
      });
    });

    when("they lose their connection and reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.goOffline();
        await webApp.reload();
        await webApp.home.openBrowse();
        await webApp.browse.play("코끼리");
      });

      then("the card is still there, and still plays", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK + 2);
        expect(recording).toMatchObject({language: "ko", found: true});
      });
    });

    when("they study, the new card joining the others", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.close();
        await webApp.home.startReviewing();
      });

      then("it comes up in a session once the deck's own new cards are done", async ({webApp}) => {
        expect(await webApp.review.getCardsRemaining()).toBe(CARDS_IN_THE_STARTER_DECK);
      });
    });

    when("they ask for a similar for it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.openSimilars("코끼리");
        await webApp.browse.similar.add("고기리");
      });

      then("it is kept with the card like any other word's", async ({webApp}) => {
        expect(await webApp.browse.similar.getWords()).toEqual(["고기리"]);
      });
    });

    when("they forget everything this device kept and reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.forgetThisDevice();
        await webApp.home.openBrowse();
      });

      then("the card is back, because it was kept for them online", async ({webApp}) => {
        expect(await webApp.browse.getRows()).toContainEqual({
          front: "코끼리",
          back: "elephant",
          hint: "kokkiri",
          status: "New",
        });
      });
    });

    when("they delete it", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.cardForm.deleteCard("코끼리");
      });

      then("both of its cards are gone and the deck's own are left", async ({webApp}) => {
        expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK);
        expect((await webApp.browse.getRows()).map(row => row.front)).not.toContain("코끼리");
      });

      when("they reopen the app", () => {
        beforeEach(async ({webApp}) => {
          await webApp.reload();
          await webApp.home.openBrowse();
        });

        then("it stays gone", async ({webApp}) => {
          expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK);
        });
      });
    });
  });

  when("they ask for a card whose Korean is not Korean", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.cardForm.addCard({word: "elephant", meaning: "elephant", romanisation: "kokkiri"});
    });

    then("it is refused with a reason, and no card is added", async ({webApp}) => {
      expect(await webApp.browse.cardForm.getAddCardError()).not.toBe("");
      expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK);
    });
  });

  when("they leave out the meaning", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.cardForm.addCard({word: "코끼리", meaning: "", romanisation: "kokkiri"});
    });

    then("it is refused with a reason, and no card is added", async ({webApp}) => {
      expect(await webApp.browse.cardForm.getAddCardError()).not.toBe("");
      expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK);
    });
  });
});
