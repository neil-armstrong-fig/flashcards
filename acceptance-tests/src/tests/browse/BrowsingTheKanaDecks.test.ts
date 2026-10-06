import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

given("the learner opens the list of every card", () => {
  beforeEach(async ({webApp}) => {
    await webApp.home.openBrowse();
  });

  when("they search for the sound shi", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.search("shi");
    });

    then(
      "the hiragana and katakana are listed, each both ways, with the sound shown but not spoken",
      async ({webApp}) => {
        const rows = await webApp.browse.getRows();

        expect(rows).toContainEqual({front: "し", back: "shi", hint: "", status: "New"});
        expect(rows).toContainEqual({front: "シ", back: "shi", hint: "", status: "New"});
        expect(rows).toContainEqual({front: "shi", back: "し", hint: "", status: "New"});
        expect(rows).toContainEqual({front: "shi", back: "シ", hint: "", status: "New"});
      },
    );
  });

  when("they search for the sound ga, which has dakuten", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.search("ga");
    });

    then("the voiced hiragana and katakana are listed", async ({webApp}) => {
      const rows = await webApp.browse.getRows();

      expect(rows).toContainEqual({front: "が", back: "ga", hint: "", status: "New"});
      expect(rows).toContainEqual({front: "ガ", back: "ga", hint: "", status: "New"});
    });
  });

  when("they search for the sound kya, which is two kana combined", () => {
    beforeEach(async ({webApp}) => {
      await webApp.browse.search("kya");
    });

    then("the combined hiragana and katakana are listed", async ({webApp}) => {
      const rows = await webApp.browse.getRows();

      expect(rows).toContainEqual({front: "きゃ", back: "kya", hint: "", status: "New"});
      expect(rows).toContainEqual({front: "キャ", back: "kya", hint: "", status: "New"});
    });
  });
});
