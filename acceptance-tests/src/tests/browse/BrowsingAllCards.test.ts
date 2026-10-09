import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {CARDS_IN_EVERY_DECK} from "@src/shared/CardsInEveryDeck";

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  then("every card is listed, both directions of every word", async ({webApp}) => {
    expect(await webApp.browse.getCardCount()).toBe(CARDS_IN_EVERY_DECK);
    expect(await webApp.browse.getRows()).toContainEqual({front: "물", back: "water", hint: "mul", status: "New"});
    expect(await webApp.browse.getRows()).toContainEqual({front: "water", back: "물", hint: "mul", status: "New"});
  });

  when("they search for an English meaning", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.chooseDeck("ko-starter");
      await webApp.browse.search("water");
    });

    then("only that word's two cards are left", async ({webApp}) => {
      const fronts = (await webApp.browse.getRows()).map(row => row.front);

      expect(fronts.sort()).toEqual(["water", "물"]);
    });
  });

  when("they search by how a word is said in Latin letters", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.search("hakgyo");
    });

    then("the word's cards are found, and the card for how it is pronounced", async ({webApp}) => {
      expect((await webApp.browse.getRows()).map(row => row.front).sort()).toEqual(["school", "학교", "학교"]);
    });
  });

  when("they search for something that is not there", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.search("zzz");
    });

    then("nothing is listed, and they are told so", async ({webApp}) => {
      expect(await webApp.browse.getRows()).toEqual([]);
      expect(await webApp.browse.isNothingFoundShown()).toBe(true);
    });
  });

  when("they play a Korean card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.play("물");
    });

    then("the Korean word is heard, in the voice and speed they chose", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({language: "ko", voice: "male", speed: "normal", found: true});
    });
  });

  when("they play an English card", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.chooseDeck("ko-starter");
      await webApp.browse.play("water");
    });

    then("it is the Korean word they hear, since that is what is being learned", async ({webApp}) => {
      const [recording] = await webApp.review.sound.getRecordingsPlayed();

      expect(recording).toMatchObject({language: "ko", found: true});
    });
  });

  when("they go back", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.close();
    });

    then("they are on the home screen", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(20);
    });
  });
});

given("the learner has answered one card and suspended another", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
    await webApp.review.suspend();
    await webApp.reload();
    await webApp.home.openBrowse();
  });

  then("the answered card says when it comes back", async ({webApp}) => {
    const row = (await webApp.browse.getRows()).find(each => each.front === "물");

    expect(row?.status).toMatch(/^Due in \d/);
  });

  then("the suspended card says so", async ({webApp}) => {
    const row = (await webApp.browse.getRows()).find(each => each.front === "밥");

    expect(row?.status).toBe("Suspended");
  });

  then("the others are still new", async ({webApp}) => {
    const row = (await webApp.browse.getRows()).find(each => each.front === "집");

    expect(row?.status).toBe("New");
  });
});
