# References and credits

This project is built on the ideas and open-source work of others. This file is the single place where that credit is kept. Add an entry in the same change that introduces an idea, library or data source.

## Ideas and inspiration

| Idea in this project | Inspired by | Link |
| --- | --- | --- |
| Spaced repetition review loop, decks, notes and cards | Anki (Damien Elmes and contributors, AGPL-3.0) | https://apps.ankiweb.net/ |
| FSRS scheduling and desired retention | Free Spaced Repetition Scheduler (open-spaced-repetition) | https://github.com/open-spaced-repetition |
| The 46 basic hiragana and katakana, in gojūon order, with Hepburn romaji (を as `wo`) | Standard Japanese kana tables (facts, not a copied dataset) | https://en.wikipedia.org/wiki/Gojūon |
| Leech detection (cards that repeatedly lapse) | Anki manual, "Leeches" | https://docs.ankiweb.net/leeches.html |
| Note types with fields, cloze deletion, tags | Anki manual | https://docs.ankiweb.net/ |
| Suspend, bury, custom study | Anki manual | https://docs.ankiweb.net/ |
| Learning steps (1m, 10m) and relearning after a lapse | Anki manual, "Deck Options: Learning steps, Lapses" | https://docs.ankiweb.net/deck-options.html |
| Learn ahead: showing a learning card early when nothing else is waiting | Anki manual, "Deck Options: Learn ahead limit" | https://docs.ankiweb.net/deck-options.html |
| Study day rolls over at 4am, not midnight | Anki manual, "Studying: Next day starts at" | https://docs.ankiweb.net/studying.html |
| Daily new-card allowance; learning, then review, then new card order | Anki manual, "Deck Options: Daily limits, Display order" | https://docs.ankiweb.net/deck-options.html |
| Colour tokens and theme handling | The author's personal site | https://github.com/neil-armstrong-fig/personal-site |
| Acceptance-test DSL layering and Given/When/Then mapping | Janggi | https://github.com/neil-armstrong-fig/janggi |

No Anki code is used. Only publicly documented behaviour and concepts inspired the design.

## Libraries

Added as they are introduced (the dependency catalog in `pnpm-workspace.yaml` is the source of truth for versions).

| Library | Used for | Licence | Link |
| --- | --- | --- | --- |
| koroman | Revised Romanization of Korean, as pronounced, for suggesting how a card's word is said (`shared/`); see `docs/romanisation.md` | MIT | https://www.npmjs.com/package/koroman |
| idb | A small promise wrapper over IndexedDB for the study and picture databases (`webapp/`); see `docs/storage.md` | ISC | https://github.com/jakearchibald/idb |
| fake-indexeddb | An in-memory IndexedDB for unit tests of the real database code (`webapp/`, dev only); see `docs/storage.md` | Apache-2.0 | https://github.com/dumbmatter/fakeIndexedDB |
| ts-fsrs | The FSRS scheduling algorithm, behind `spaced-repetition/scheduling/` | MIT | https://github.com/open-spaced-repetition/ts-fsrs |
| drizzle-orm, drizzle-kit, oauth4webapi | The API's database access and Google sign-in (setup as in janggi) | Apache-2.0 / MIT | see each package |
| Alchemy, Wrangler, Cloudflare Workers types, tsx | The speech API's infrastructure as code, local dev and typing (setup as in janggi) | Apache-2.0 / MIT | see each package |
| React, React Router, Redux Toolkit, Tailwind CSS, Vite, vite-plugin-pwa, Workbox, Playwright, Vitest | The app, tests and tooling (stack as in janggi) | MIT / Apache-2.0 | see each package |
| Testing Library (`@testing-library/react`, `@testing-library/dom`), jsdom | Testing hooks alone with `renderHook` on a DOM (the pattern from janggi) | MIT | see each package |

## Data and audio sources

Audio is generated with Azure AI Speech (`docs/audio.md`). Any real recordings used later are listed here per source with licence and attribution.

- **Korean pronunciation deck** (`content/src/korean/pronunciation/`): the sound rules (aspiration, liaison, nasalisation, liquid
  assimilation, tensing, palatalisation, weak ㅎ, final sounds, double finals, added ㄴ) follow the standard pronunciation rules,
  [표준 발음법](https://korean.go.kr/kornorms/) of the National Institute of Korean Language. The words are chosen by us and the
  explanations written by us; each pronunciation is checked against `koroman`. The idea of a deck of such words, and the sound
  changes the Korean Wiki Project lists on its [consonant assimilation](https://www.koreanwikiproject.com/wiki/Category:Consonant_assimilation)
  pages, guided what to cover; no text or audio of an Anki package or of that site is copied.

## Test data

Some expected values in `shared/src/language/RomanisationOf.test.ts` come from the Korean Wiki Project's page on
[consonant assimilation](https://www.koreanwikiproject.com/wiki/Category:Consonant_assimilation), which gives each word's
pronunciation in Hangul. They were turned into the Revised Romanization by its rules; no text is copied (`docs/romanisation.md`).

## Kana explanations

The notes on the extended katakana (`content/src/japanese/extended-katakana/`) are our own words, written from what these pages say about why the combinations exist and the 1946 reform that dropped ゐ and ゑ: [Extended Katakana for Foreign Sounds (elon.io)](https://elon.io/grammar/japanese/kana/katakana-extended), [Nihongo Master's katakana chart](https://nihongomaster.com/katakana-chart), and Wikipedia's [Katakana](https://en.wikipedia.org/wiki/Katakana) and [Wi (kana)](https://en.wikipedia.org/wiki/Wi_(kana)). No text is copied.
