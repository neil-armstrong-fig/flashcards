# Audio

All card audio comes from Azure AI Speech, for every language, in a male and a female voice at two speeds. Facts below come from
Microsoft's own pages (checked 2026-10-05); anything unverified says so.

## Decisions

- **One engine for everything.** Azure has male and female neural voices for Korean, Japanese and Dutch, with speed set per request
  and MP3 returned directly. One engine keeps the voices consistent and means one key, one API, one tool.
- **Four recordings per card face:** female and male, each at normal and slower speed. Voice and speed are the learner's own
  settings, changed at any time, not a property of a deck.
- **Region: UK South (`uksouth`).** Any supported region works, but a key only works against its own region.
- **Generated once, served privately.** Audio is not made at play time. A command-line tool generates it into a git-ignored folder, a
  second command uploads it to a private R2 bucket, and the API serves it to a signed-in learner (`docs/online.md`). The app keeps
  what it has played and plays it offline.
- **Cloudflare hosts the API only, not speech.** Workers AI MeloTTS has one female voice and no gender control, so it cannot meet the
  need.
- **Real recordings are not used.** Tatoeba has no Korean audio and little Japanese or Dutch with a usable licence, Forvo does not
  allow caching, and Common Voice clips fit vocabulary cards badly.

## Voices

| Language | Chosen                                                      | Other voices on offer in UK South                                                    |
| -------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Korean   | female `ko-KR-JiMinNeural`, male `ko-KR-BongJinNeural`      | F: SunHi, SeoHyeon, SoonBok, YuJin. M: InJoon, Hyunsu, Hyunsu Multilingual, GookMin  |
| Japanese | female `ja-JP-MayuNeural`, male `ja-JP-NaokiNeural`         | F: Aoi, Mayu, Nanami, Shiori. M: Daichi, Keita, Naoki (`ja-JP-<Name>Neural`)         |
| Dutch    | female `nl-NL-FennaNeural`, male `nl-NL-MaartenNeural`      | nl-NL F: Colette, Fenna. nl-BE F: Dena. M: Arnaud (`nl-NL-<Name>Neural`)             |
| English  | `en-GB-SoniaNeural`, one voice, normal speed                | Spoken for each card's English meaning, whatever voice and speed are chosen          |

All were chosen by ear. Maarten is the only Netherlands male voice (Arnaud is Belgian). Keita's isolated kana were too soft or
cropped, so Naoki replaced him. A lone kana is best spoken bare: a full stop, repeating it, IPA `<phoneme>` and `say-as characters`
were compared and bare won. Voices live in `shared/src/audio/azure/AzureVoices.ts`.

**Dialect.** The target is the standard speech of the capital for each language. Azure's voice metadata says nothing about a
speaker's region or accent, so accent is judged by ear.

## Azure facts

- **Free tier: 0.5 million neural characters a month.** Paid standard neural voices are about $15 per million characters. A few
  thousand characters generated once is far inside the free tier.
- **Rate limit on the free tier: 20 requests per 60 seconds, not adjustable.** The tool throttles itself (one request every 3.3
  seconds) and retries a 429 with a wait. Four variants of a thousand faces is 4,000 requests, about 3.7 hours the first time, then
  only new or changed text.
- **API:** `POST https://<region>.tts.speech.microsoft.com/cognitiveservices/v1`, headers `Ocp-Apim-Subscription-Key`,
  `Content-Type: application/ssml+xml`, `X-Microsoft-OutputFormat: audio-24khz-48kbitrate-mono-mp3` and a `User-Agent`. The speech markup (Speech Synthesis Markup Language) names
  the voice and sets speed with `<prosody rate="-15%">`. `GET .../cognitiveservices/voices/list` lists a region's voices.
- **Output is MP3 directly** (about 11 KB for a word, 27 KB for a long sentence), so no encoder is needed. A thousand faces in four
  variants is about 40 MB.
- **The voices are synthetic**, and the settings screen says so.

## Speed

"Slower" is `-15%` (`<prosody rate="-15%">`) for every kind of text. Sentences come out about 16 to 18% longer at that rate, and any
slower sounds distorted. Single words barely change at -15%, which is accepted. Do not go below -15%.

## Design

The notes of music are the exception to Azure: `tools/src/tone/` synthesises each pitch (equal temperament, A4 = 440 Hz, a decaying note with a few overtones, mono, 1.5 seconds) and encodes it to MP3 with `@breezystack/lamejs`. A tone is a recording like any other, under `music/female-normal/<hash>.mp3` (one variant, as English has), listed in the manifest under `music`, uploaded and kept offline the same way. Nothing is sent to Azure for it.

A recording is identified by its text, voice (`female` or `male`) and speed (`normal` or `slower`), never by its text alone.

- **The generator** (`tools/`): `pnpm --filter @flashcards/tools generate-audio`, with the key loaded from `.env.dev` in a
  subshell. It writes `private-source/recordings/<language>/<voice>-<speed>/<hash>.mp3`, the hash being of the text, the voice's name,
  the rate and the speech markup revision (`RecordingFileOf.ts`: bumped when every recording must be remade, as a device keeps one for good under its name), so a changed word regenerates and an unchanged one never costs again. The variant is in the folder so a spec can
  tell which recording played without recomputing a hash. Stale files are not deleted. Recordings carry no added silence (`mstts:silence` 0ms, `SpeechMarkupOf.ts`), so two side by side run on. `upload-audio` sends what is missing to R2.
- **The manifest** is `content/src/audio/recordings.json`, written by the tool: language, then the text, then each variant's file.
  The webapp plays only what it names (`audioFileOf`), and a text or variant with no entry is silent. It is keyed by text, not by
  card, so a word's two cards share its four files.
- **Playback.** A card speaks its front when it comes up and its answer when the answer is shown, in both directions, so a learner
  can listen while walking, think, then look and rate. A replay button repeats what was said last. Under it, while Korean is being
  spoken, two switches (voice, speed) flip the choice and speak the word again. Voice (male by default) and speed are chosen for each deck,
  in the settings or by the switches, since a voice can sound odd on one deck and not another; the list of every card has one of its own.
  "Hide the word when it comes first", in the card's more options, hides the target-language word on the front of a to-English card
  until the answer is shown, for that deck. Tapping the card anywhere but a button plays it again. Playing happens in the thunks that bring up a
  card (`startSession`, `answerCard`, `setCardAside`), not in a component effect, so StrictMode cannot double it. One audio element
  lives for the whole app, because a phone lets an element a tap has started carry on later.
- **Compare sounds.** Once the answer is shown (never on the front), a button opens a panel: the card's own word and its similars,
  each with a play button and a "word then similar" button, in the chosen voice and speed. The deck ships similars
  (`VocabNote.soundSimilars`, 물 has 불). The learner can type another: it is checked as Korean (twelve characters at most) and
  fetched in all four versions from the API (`api/`, which holds the Azure key and the spend guard: origin check, 20 requests a
  minute per address, a monthly character ceiling). It is kept in the browser's Cache and served by the service worker at
  `kept-audio/<language>/<variant>/...`, so it plays offline. **A card the learner makes uses the same path**: its Korean word in
  four versions and its English meaning in one, fetched together before the card is added, so no card is ever silent. The list is
  kept online per Google account (`api/AGENTS.md`) and brought down on a new device. The API caches every recording it makes in KV,
  so a word asked for twice is paid for once.
- **Offline.** Recordings are fetched with the session cookie, kept in the Cache API (`recordings-v1`) as they are played, and a deck
  can be kept offline in one go (`docs/online.md`). The worker is registered only in a production build, so the offline specs live
  in `tests/pwa/` and run with `pnpm acceptance-tests:pwa` against `pnpm start:preview`. On the dev server (`pnpm start`, `start:local`, `start:deployed`) there is no worker, so Vite proxies `/audio/*` to
  the API on :8787 with the session cookie, and recordings play but are not kept for offline; `kept-audio/` needs a production build.
- **The acceptance specs fake the audio element** (`acceptance-tests/src/dsl/web-app/playwright/fake-audio/`): it writes down each
  `play()` and fetches the file, so a recording the app cannot serve shows as not found.

## Cloudflare

The app stays on GitHub Pages. A Worker is the API in front of Azure, so the key is never in the browser, and it checks the allowed
origin (`ALLOWED_ORIGINS`). The app never depends on the Worker to play a card it has already kept, and acceptance specs fake the
Worker.

## The two Anki pronunciation packages (provenance and a listening test)

`private-source/Korean Pronunciation trainer.apkg` (37 notes) and `Korean Pronunciation gotchas.apkg` (60 notes) are minimal
pairs and sound-alike words. Unpacked (not committed) with `private-source/scripts/extract-apkg-media.mjs` and
`inspect-apkg.mjs` into `private-source/anki-inspect/`; the package audio is 76 files (trainer) and 60 (gotchas).

- **Licence: none is recorded in either package.** The deck names (`Disabled::2 Korean::1 Pronunciation trainer`) and the notes carry
  no author, source or licence field. The recordings are therefore all rights reserved until the original author is found; do
  not ship them, and do not assume fair use for a public repository. Reusing only the *word lists* (a list of words is not a
  recording, and the minimal pairs are linguistic facts) is much safer, and generating our own audio makes the question go away.
- **The listening test is ready, not judged.** `private-source/scripts/compare-anki-tts.mjs` generated every word with Azure in
  two Korean voices (JiMin, BongJin: 76 + 60 words each, 272 files) beside the package's file. Open
  `private-source/audio-comparison/anki/index.html` and play package, jimin and bongjin side by side. **I cannot listen, so
  whether the pronunciations match, and whether the Azure voice keeps the tense and aspirated distinction (ㅂ ㅃ ㅍ, ㄷ ㄸ ㅌ)
  in the pairs, is for you to judge.** Those pairs are the point: a voice that blurs 불/풀 or 방/빵 is no use for a pronunciation deck.
- **Decided 2026-10-08 (the developer, after listening): use the generated audio.** It is clearer than the package's. The package audio is
  not used or shipped. The Korean pronunciation deck (`content/src/korean/pronunciation/`) is built from our own list of words by the
  sound rules, with our own explanations and pronunciations, not from the gotchas package's words or notes, because the package has no
  licence (`content/AGENTS.md`: nothing is pasted from a source whose licence is unknown). Its card: the spelling with no audio; then the
  spelling, the sound in hangul, the romanisation, the rule, and the word spoken. The trainer package's minimal pairs (바르다/빠르다,
  방/빵) are the job of `soundSimilars` and are not in this deck; say if they should be added to the starter words as similars.
- If Azure fails on a pair, the fallback is the speech markup `<phoneme>` or a different voice per pair, not the package audio.
