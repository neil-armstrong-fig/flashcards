import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {CARDS_IN_EVERY_DECK} from "@src/shared/CardsInEveryDeck";

const CARDS_IN_THE_STARTER_DECK = 20;

given("the learner has made a card for 코끼리, elephant, kokkiri", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.cardForm.addCard({word: "코끼리", meaning: "elephant", romanisation: "kokkiri"});
  });

  then("they can edit it, and none of the deck's own cards", async ({webApp}) => {
    expect(await webApp.browse.cardForm.canEditCard("코끼리")).toBe(true);
    expect(await webApp.browse.cardForm.canEditCard("물")).toBe(false);
  });

  when("they change it to 고래, whale, gorae", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.cardForm.editCard("코끼리", {word: "고래", meaning: "whale", romanisation: "gorae"});
    });

    then("both directions show the new words, and there are still only two", async ({webApp}) => {
      const rows = await webApp.browse.getRows();

      expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK + 2);
      expect(rows).toContainEqual({front: "고래", back: "whale", hint: "gorae", status: "New"});
      expect(rows).toContainEqual({front: "whale", back: "고래", hint: "gorae", status: "New"});
      expect(rows.map(row => row.front)).not.toContain("코끼리");
    });

    when("they play the new Korean word", () => {
      beforeEach(async ({webApp}) => {
        await webApp.browse.play("고래");
      });

      then("it is heard, because its recordings were kept before the edit was saved", async ({webApp}) => {
        const [recording] = await webApp.review.sound.getRecordingsPlayed();

        expect(recording).toMatchObject({language: "ko", found: true});
      });
    });

    when("they forget everything this device kept and reopen the app", () => {
      beforeEach(async ({webApp}) => {
        await webApp.forgetThisDevice();
        await webApp.home.openBrowse();
      });

      then("the edited card comes back from online, not the old one", async ({webApp}) => {
        const rows = await webApp.browse.getRows();

        expect(rows).toContainEqual({front: "고래", back: "whale", hint: "gorae", status: "New"});
        expect(rows.map(row => row.front)).not.toContain("코끼리");
      });
    });
  });

  when("they study the card once, then change its words", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.close();
      await webApp.home.openSettings();
      await webApp.settings.limits.setNewCardsPerDay(CARDS_IN_THE_STARTER_DECK + 2);
      await webApp.settings.close();
      await webApp.home.startReviewing();
      for (let answered = 0; answered < CARDS_IN_THE_STARTER_DECK + 2; answered++) {
        await webApp.review.rate("easy");
      }
      await webApp.review.finishSession();
      await webApp.home.openBrowse();
      await webApp.browse.cardForm.editCard("코끼리", {word: "고래", meaning: "whale", romanisation: "gorae"});
    });

    then("it keeps the progress it had, because it is the same card", async ({webApp}) => {
      const statuses = (await webApp.browse.getRows())
        .filter(row => row.front === "고래" || row.front === "whale")
        .map(row => row.status);

      expect(statuses).not.toContain("New");
    });
  });

  when("they change the Korean to something that is not Korean", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.cardForm.editCard("코끼리", {word: "whale", meaning: "whale", romanisation: "gorae"});
    });

    then("it is refused with a reason, and the card is as it was", async ({webApp}) => {
      expect(await webApp.browse.cardForm.getEditCardError()).not.toBe("");
      expect((await webApp.browse.getRows()).map(row => row.front)).toContain("코끼리");
    });
  });

  when("they change it to the Korean of a card they already have", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.cardForm.addCard({word: "고래", meaning: "whale", romanisation: "gorae"});
      await webApp.browse.cardForm.editCard("코끼리", {word: "고래", meaning: "elephant", romanisation: "kokkiri"});
    });

    then("it is refused with a reason, and both cards are as they were", async ({webApp}) => {
      expect(await webApp.browse.cardForm.getEditCardError()).not.toBe("");
      expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK + 4);
    });
  });
});
