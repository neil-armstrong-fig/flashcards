import {readDeckPreferences} from "@src/redux/slices/settings/storage/read/ReadDeckPreferences";

it("reads the preferences kept for each deck", () => {
  const preferences = readDeckPreferences({"ko-starter": {voice: "female", speed: "slower", hideTarget: true}}, {});

  expect(preferences["ko-starter"]).toEqual({voice: "female", speed: "slower", hideTarget: true});
});

it("gives a deck with nothing kept the defaults: the male voice at normal speed, words shown", () => {
  expect(readDeckPreferences({}, {})["ja-hiragana"]).toEqual({
    voice: "male",
    speed: "normal",
    hideTarget: false,
  });
});

it("gives a field that does not check out its default alone", () => {
  const preferences = readDeckPreferences({"ko-starter": {voice: "robot", speed: "slower", hideTarget: "yes"}}, {});

  expect(preferences["ko-starter"]).toEqual({voice: "male", speed: "slower", hideTarget: false});
});

it("carries the voice, speed and listen-only choices kept before there was one for each deck over to every deck without its own", () => {
  const preferences = readDeckPreferences(
    {"ko-starter": {voice: "male"}},
    {voice: "female", speed: "slower", hideTarget: true},
  );

  expect(preferences["ko-starter"]).toEqual({voice: "male", speed: "slower", hideTarget: true});
  expect(preferences["ja-katakana"]).toEqual({voice: "female", speed: "slower", hideTarget: true});
});

it("keeps only decks the app ships", () => {
  expect(Object.keys(readDeckPreferences({"nl-nothing": {voice: "female"}}, {}))).not.toContain("nl-nothing");
});
