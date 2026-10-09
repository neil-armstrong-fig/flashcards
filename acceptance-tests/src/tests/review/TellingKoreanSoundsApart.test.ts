import type {WebApp} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the Korean sounds-alike deck and the first card for 바르다 and 빠르다 comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ko-sounds-alike");
  });

  then("the card shows both words, 바르다/빠르다", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("바르다/빠르다");
  });

  then("one of the two words is said, in the chosen voice", async ({webApp}) => {
    const recordings = await webApp.review.sound.getRecordingsPlayed();

    expect(recordings).toHaveLength(1);
    expect(recordings[0]).toMatchObject({language: "ko", voice: "male", speed: "normal", found: true});
  });

  then("nothing is picked out yet, because that would say which it was", async ({webApp}) => {
    expect(await webApp.review.getEmphasisedText()).toBe("");
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("both words are shown again, with the one that was said in bold", async ({webApp}) => {
      expect(await webApp.review.getBackText()).toContain("바르다/빠르다");
      expect(await webApp.review.getEmphasisedText()).toBe("바르다");
    });

    then("the word is said again", async ({webApp}) => {
      const [first, again] = await webApp.review.sound.getRecordingsPlayed();

      expect(again?.file).toBe(first?.file);
    });

    then("the difference between the two is explained", async ({webApp}) => {
      expect(await webApp.review.getExplanation()).toContain("ㅃ");
    });

    when("they open the similar", () => {
      beforeEach(async ({webApp}) => {
        await webApp.review.similar.open();
      });

      then("the other word, 빠르다, is there to compare", async ({webApp}) => {
        expect(await webApp.review.similar.getWords()).toEqual(["빠르다"]);
      });

      when("they play the other word", () => {
        beforeEach(async ({webApp}) => {
          await webApp.review.similar.play("빠르다");
        });

        then("it is a different recording from the one that was said", async ({webApp}) => {
          const [first, , other] = await webApp.review.sound.getRecordingsPlayed();

          expect(other).toMatchObject({language: "ko", found: true});
          expect(other?.file).not.toBe(first?.file);
        });
      });
    });
  });
});

given("the learner has answered the first card in the Korean sounds-alike deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("ko-sounds-alike");
    await webApp.review.showAnswer();
    await webApp.review.rate("easy");
  });

  then("a card from another pair comes next", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).toBe("물/불");
  });
});

given("the learner opens the list of every card and chooses the Korean sounds-alike deck", () => {
  beforeEach(async ({webApp}) => {
    await openTheSoundsAlikePairs(webApp);
  });

  then("each pair is two cards, one for each word", async ({webApp}) => {
    expect(await webApp.browse.getCardCount()).toBe(26);
  });
});

async function openTheSoundsAlikePairs(webApp: WebApp): Promise<void> {
  await webApp.home.openBrowse();
  await webApp.browse.chooseDeck("ko-sounds-alike");
}
