import {beforeEach, expect, given, then} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner says the first card of the deck is hard, then opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.startReviewing();
    await webApp.review.struggling.markHard();
    await webApp.reload();
    await webApp.home.openBrowse();
  });

  then("that card is marked as struggling", async ({webApp}) => {
    expect(await webApp.browse.isCardStruggling("물")).toBe(true);
  });

  then("the card for the same word the other way round is not", async ({webApp}) => {
    expect(await webApp.browse.isCardStruggling("water")).toBe(false);
  });

  then("another word's card is not", async ({webApp}) => {
    expect(await webApp.browse.isCardStruggling("밥")).toBe(false);
  });
});

given("the learner opens the list of every card and has said nothing is hard", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  then("the first card is not marked as struggling", async ({webApp}) => {
    expect(await webApp.browse.isCardStruggling("물")).toBe(false);
  });
});
