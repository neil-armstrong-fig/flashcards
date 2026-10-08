import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {CARDS_IN_EVERY_DECK} from "@src/shared/CardsInEveryDeck";

const A_NOTE = "Sounds like mule: picture a mule drinking";

given("the learner has made a card for 코끼리 on one device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.cardForm.addCard({word: "코끼리", meaning: "elephant", romanisation: "kokkiri"});
    await webApp.reload();
    await webApp.sync.waitUntilUpToDate();
  });

  when("they open the app on another device", () => {
    beforeEach(async ({secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
      await secondDevice.home.openBrowse();
    });

    then("both directions of the card are listed there, as new cards", async ({secondDevice}) => {
      const rows = await secondDevice.browse.getRows();

      expect(await secondDevice.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK + 2);
      expect(rows).toContainEqual({front: "코끼리", back: "elephant", hint: "kokkiri", status: "New"});
      expect(rows).toContainEqual({front: "elephant", back: "코끼리", hint: "kokkiri", status: "New"});
    });

    when("they play it there", () => {
      beforeEach(async ({secondDevice}) => {
        await secondDevice.browse.play("코끼리");
      });

      then("the word is heard, as its recordings were fetched for that device too", async ({secondDevice}) => {
        const [korean] = await secondDevice.review.sound.getRecordingsPlayed();

        expect(korean).toMatchObject({language: "ko", found: true});
      });
    });
  });

  when("they delete it on the first device, and the other device, which had it, catches up", () => {
    beforeEach(async ({webApp, secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
      await webApp.home.openBrowse();
      await webApp.browse.cardForm.deleteCard("코끼리");
      await webApp.reload();
      await webApp.sync.waitUntilUpToDate();
      await secondDevice.reload();
      await secondDevice.sync.waitUntilUpToDate();
      await secondDevice.home.openBrowse();
    });

    then("it is gone from the other device, and does not come back", async ({secondDevice}) => {
      expect(await secondDevice.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK);
    });
  });
});

given("the learner has added the similar word 볼 to 물 on one device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.openSimilars("물");
    await webApp.browse.similar.add("볼");
    await webApp.reload();
    await webApp.sync.waitUntilUpToDate();
  });

  when("they look at the similars of 물 on another device", () => {
    beforeEach(async ({secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
      await secondDevice.home.openBrowse();
      await secondDevice.browse.openSimilars("물");
    });

    then("it is there beside 불", async ({secondDevice}) => {
      expect(await secondDevice.browse.similar.getWords()).toEqual(["불", "볼"]);
    });
  });

  when("they delete it on the first device, and the other device, which had it, catches up", () => {
    beforeEach(async ({webApp, secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
      await webApp.home.openBrowse();
      await webApp.browse.openSimilars("물");
      await webApp.browse.similar.delete("볼");
      await webApp.reload();
      await webApp.sync.waitUntilUpToDate();
      await secondDevice.reload();
      await secondDevice.sync.waitUntilUpToDate();
      await secondDevice.home.openBrowse();
      await secondDevice.browse.openSimilars("물");
    });

    then("it is gone from the other device too", async ({secondDevice}) => {
      expect(await secondDevice.browse.similar.getWords()).toEqual(["불"]);
    });
  });
});

given("the learner has written a note on the first card on one device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.memoryAid.addNote(A_NOTE);
    await webApp.reload();
    await webApp.sync.waitUntilUpToDate();
  });

  when("they review the same card on another device", () => {
    beforeEach(async ({secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
      await secondDevice.home.startReviewing();
    });

    then("the note is on it", async ({secondDevice}) => {
      expect(await secondDevice.review.memoryAid.getNote()).toBe(A_NOTE);
    });
  });
});

given("the learner has put a picture on the first card on one device", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.memoryAid.addPicture();
    await webApp.reload();
    await webApp.sync.waitUntilUpToDate();
  });

  when("they review the same card on another device", () => {
    beforeEach(async ({secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
      await secondDevice.home.startReviewing();
    });

    then("the picture is on it", async ({secondDevice}) => {
      expect(await secondDevice.review.memoryAid.isPictureShown()).toBe(true);
    });
  });

  when("they remove it on the first device, and the other device, which had it, catches up", () => {
    beforeEach(async ({webApp, secondDevice}) => {
      await secondDevice.begin();
      await secondDevice.sync.waitUntilUpToDate();
      await webApp.home.startReviewing();
      await webApp.review.memoryAid.removePicture();
      await webApp.reload();
      await webApp.sync.waitUntilUpToDate();
      await secondDevice.reload();
      await secondDevice.sync.waitUntilUpToDate();
      await secondDevice.home.startReviewing();
    });

    then("it is gone from the other device too", async ({secondDevice}) => {
      expect(await secondDevice.review.memoryAid.isPictureShown()).toBe(false);
    });
  });
});
