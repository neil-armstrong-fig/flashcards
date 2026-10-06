import {ssmlOf} from "@language-learning/shared/audio/azure/SsmlOf";

const WATER = {text: "물", voiceName: "ko-KR-JiMinNeural", locale: "ko-KR", rate: "default"};

it("names the voice and the locale", () => {
  expect(ssmlOf(WATER)).toContain('xml:lang="ko-KR"><voice name="ko-KR-JiMinNeural">물</voice>');
});

it("leaves the speed alone at the default rate", () => {
  expect(ssmlOf(WATER)).not.toContain("prosody");
});

it("slows the speech with a prosody rate", () => {
  expect(ssmlOf({...WATER, rate: "-15%"})).toContain('<prosody rate="-15%">물</prosody>');
});

it("escapes what would otherwise be read as markup", () => {
  expect(ssmlOf({...WATER, text: `a<b & "c"`})).toContain("a&lt;b &amp; &quot;c&quot;");
});
