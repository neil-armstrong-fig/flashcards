import {speechMarkupOf} from "@flashcards/shared/audio/azure/SpeechMarkupOf";

const WATER = {text: "물", voiceName: "ko-KR-JiMinNeural", locale: "ko-KR", rate: "default"};

const NO_SILENCE = '<mstts:silence type="Leading-exact" value="0ms"/><mstts:silence type="Tailing-exact" value="0ms"/>';

it("names the voice and the locale", () => {
  expect(speechMarkupOf(WATER)).toContain('xml:lang="ko-KR"><voice name="ko-KR-JiMinNeural">');
});

it("declares the namespace the silence elements need", () => {
  expect(speechMarkupOf(WATER)).toContain('xmlns:mstts="https://www.w3.org/2001/mstts"');
});

it("asks for no silence before or after the speech, so back-to-back recordings run on", () => {
  expect(speechMarkupOf(WATER)).toContain(`${NO_SILENCE}물</voice>`);
});

it("leaves the speed alone at the default rate", () => {
  expect(speechMarkupOf(WATER)).not.toContain("prosody");
});

it("slows the speech with a prosody rate", () => {
  expect(speechMarkupOf({...WATER, rate: "-15%"})).toContain(`${NO_SILENCE}<prosody rate="-15%">물</prosody></voice>`);
});

it("escapes what would otherwise be read as markup", () => {
  expect(speechMarkupOf({...WATER, text: `a<b & "c"`})).toContain("a&lt;b &amp; &quot;c&quot;");
});
