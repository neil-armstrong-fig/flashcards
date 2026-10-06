import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the app for the first time", () => {
  then("each deck has twenty new cards waiting, counted on its own", async ({webApp}) => {
    expect(await webApp.home.getCardsDueToday("ko-starter")).toBe(20);
    expect(await webApp.home.getCardsDueToday("ja-hiragana")).toBe(20);
    expect(await webApp.home.getCardsDueToday("ja-katakana")).toBe(20);
  });
});

given("the learner starts a session on the hiragana deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ja-hiragana");
  });

  then("only hiragana comes up, from the start of the table, and only the deck's own twenty", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("あ");
    expect(await webApp.review.getCardsRemaining()).toBe(20);
  });

  then("the kana is spoken in the Japanese voice, and only the kana", async ({webApp}) => {
    const recordings = await webApp.review.sound.getRecordingsPlayed();

    expect(recordings).toHaveLength(1);
    expect(recordings[0]).toMatchObject({language: "ja", voice: "female", speed: "normal", found: true});
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("it is the sound alone, with no empty brackets for a romanisation a kana does not have", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toBe("a");
    });
  });
});

given("the learner gives the katakana deck five new cards a day", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(5, "ja-katakana");
    await webApp.settings.close();
  });

  then("katakana has five cards waiting and the other decks are as they were", async ({webApp}) => {
    expect(await webApp.home.getCardsDueToday("ja-katakana")).toBe(5);
    expect(await webApp.home.getCardsDueToday("ko-starter")).toBe(20);
    expect(await webApp.home.getCardsDueToday("ja-hiragana")).toBe(20);
  });

  when("they reopen the app", () => {
    beforeEach(async ({webApp}) => {
      await webApp.reload();
    });

    then("the limit was kept", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday("ja-katakana")).toBe(5);
    });
  });
});

given("the learner has learned three starter words' cards and a quarter of a year goes by", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(3, "ko-starter");
    await webApp.settings.close();
    await webApp.home.startReviewing();
    await webApp.review.rate("easy");
    await webApp.review.rate("easy");
    await webApp.review.rate("easy");
    await webApp.review.finishSession();
    await webApp.home.openSettings();
    await webApp.settings.limits.setNewCardsPerDay(0, "ko-starter");
    await webApp.settings.close();
    await webApp.passDays(90);
  });

  then("all three are due for review", async ({webApp}) => {
    expect(await webApp.home.getCardsDueToday()).toBe(3);
  });

  when("they allow the deck only one review a day", () => {
    beforeEach(async ({webApp}) => {
      await webApp.home.openSettings();
      await webApp.settings.limits.setMaxReviewsPerDay(1, "ko-starter");
      await webApp.settings.close();
    });

    then("only one is due, and the other decks are not held back by it", async ({webApp}) => {
      expect(await webApp.home.getCardsDueToday()).toBe(1);
      expect(await webApp.home.getCardsDueToday("ja-hiragana")).toBe(20);
    });
  });
});
