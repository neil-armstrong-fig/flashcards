import {expect, given, then} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner is on the home screen", () => {
  then("the pointer over a button they can press is a hand", async ({webApp}) => {
    expect(await webApp.getPointerOverAButton()).toBe("pointer");
  });
});
