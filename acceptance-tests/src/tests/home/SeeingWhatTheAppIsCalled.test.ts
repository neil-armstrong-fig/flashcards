import {expect, given, then} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the app", () => {
  then("the home screen calls it Flash Cards", async ({webApp}) => {
    expect(await webApp.home.getAppTitle()).toBe("Flash Cards");
  });

  then("the browser tab calls it Flash Cards", async ({webApp}) => {
    expect(await webApp.getTabTitle()).toBe("Flash Cards");
  });
});
