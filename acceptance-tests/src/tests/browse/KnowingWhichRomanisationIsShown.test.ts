import {beforeEach, expect, given, then} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  then("it says which system the Latin letters for Korean words follow", async ({webApp}) => {
    expect(await webApp.browse.getRomanisationNote()).toBe(
      "Korean words are written in Latin letters with the Revised Romanization of Korean, the official South Korean system.",
    );
  });
});
