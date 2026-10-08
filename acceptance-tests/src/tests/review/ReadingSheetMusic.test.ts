import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is reviewing the sheet music deck and the first card comes up", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("music-notes");
  });

  then("a note is shown on a staff with the treble clef, two steps below the bottom line", async ({webApp}) => {
    expect(await webApp.review.getNotation()).toEqual({clef: "treble", stepsAboveBottomLine: -2});
  });

  then("the note's name is not written on the front", async ({webApp}) => {
    expect(await webApp.review.getFrontText()).not.toContain("C");
  });

  then("nothing is played, so the learner names the note first", async ({webApp}) => {
    expect(await webApp.review.sound.getRecordingsPlayed()).toHaveLength(0);
  });

  when("they show the answer", () => {
    beforeEach(async ({webApp}) => {
      await webApp.review.showAnswer();
    });

    then("the staff stays and the note is named, middle C", async ({webApp}) => {
      expect(await webApp.review.getNotation()).toEqual({clef: "treble", stepsAboveBottomLine: -2});
      expect(await webApp.review.getBackText()).toContain("C4");
    });

    then("the note is played, once", async ({webApp}) => {
      const recordings = await webApp.review.sound.getRecordingsPlayed();

      expect(recordings).toHaveLength(1);
      expect(recordings[0]).toMatchObject({language: "music", found: true});
    });
  });
});

given("the learner opens the list of every card and chooses the sheet music deck", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
    await webApp.browse.chooseDeck("music-notes");
  });

  then("each note is one card, because there is nothing to say in English", async ({webApp}) => {
    expect(await webApp.browse.getCardCount()).toBe(30);
  });

  then("each card shows its staff, middle C on the treble clef first", async ({webApp}) => {
    const notations = await webApp.browse.getNotations();

    expect(notations).toHaveLength(30);
    expect(notations[0]).toEqual({clef: "treble", stepsAboveBottomLine: -2});
  });

  then("there is no voice or speed to choose, since a note has one sound", async ({webApp}) => {
    expect(await webApp.browse.isVoiceAndSpeedChoiceShown()).toBe(false);
  });
});

given("the learner is reviewing the sheet music deck and shows the answer", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing("music-notes");
    await webApp.review.showAnswer();
  });

  then("there is no voice or speed to switch under the card", async ({webApp}) => {
    expect(await webApp.review.sound.canSwitchVoice()).toBe(false);
  });
});
