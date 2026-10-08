# TODO

Task tracker. Design and rationale are in `docs/PLAN.md`; credits are in `REFERENCES.md`.

- `[ ]` todo, `[~]` in progress, `[x]` done. Update this file in the same change as the work.
- ATDD: write the acceptance spec first, watch it fail for the right reason, then implement. Mutation-check after-the-fact tests.
- A phase is done only when `pnpm checks` and the acceptance suite are green against the production build.
- Ask before adding or upgrading any dependency. Staging, committing and pushing are the developer's job.

## Where we are

Everything listed as done is built and green: `pnpm checks` in every package, the acceptance suite on desktop and Pixel 5, and the
service-worker project (`pnpm acceptance-tests:pwa`). Run the suite with `pnpm start:preview`, then `pnpm acceptance-tests`.
`pnpm start:local` runs the API and the app together; `pnpm start:deployed` runs the app through a local proxy to the deployed API,
using real account data.

**Works today:**

- Eight decks (the Korean "sounds alike" deck: 13 pairs of words told apart by ear, two cards each, the same text on both and a different word said, the answer bolding the one said and offering the other to compare; the Korean pronunciation deck: 84 words that are not said as spelt, one card each, spelling unspoken, then the sound in hangul, the rule and the audio, `docs/audio.md`; Korean starter words; Japanese hiragana and katakana with the 71 basic and voiced kana; combined hiragana and combined
  katakana with 33 each; katakana for foreign sounds with 23), each studied both ways and each in its own session with its own limits,
  voice, speed and choice of hiding the word.
- Review screen: a back button to leave early, tap anywhere but a button to hear the card, male/female (blue/pink, male first) and
  rabbit/turtle switches, the rarely used actions (picture, note, hard, bury, suspend, hide the word) in a "More" dialog, and the
  similars buttons picked out when a word has a similar to hear.
- Reviews per day are locked to ten for each new card (a deck can unlock them); with no new cards the reviews are left alone.
- Review loop: four ratings, learning steps and learn-ahead, interval labels on the buttons, keyboard shortcuts, suspend and bury,
  look ahead, and studying only new or only struggling cards.
- Settings has "Clear this device" (storage, databases and recordings; stays signed in; for testing and a device out of step).
- One daily goal in cards; desired retention (70 to 97 percent); colours (Match device, Light, Dark); PNG app icons.
- Struggling cards (lapse threshold, clearing by three good answers, optional auto-suspend, "This is hard", a Struggling list) and
  memory aids (a note and a picture per card, fading, a prompt on a struggling card).
- The learner's own Korean cards (browse screen, signed in only), with the romanisation suggested (`docs/romanisation.md`), kept
  online per account and on the device.
- Similars: words a learner mixes up, shipped for Korean sounds and Japanese shapes and sounds, and added by the learner.
- Daily-goal reminder (`docs/reminders.md`): a setting to turn it on and move the hour, kept per device; an hourly cron in the API pushes to devices whose hour it is and whose goal is not met (payload-free Web Push, VAPID by hand); the service worker shows it.
- Audio end to end (`docs/audio.md`): 978 recordings, played on show with replay, listen-only, voice and speed settings.
- Online-served model (`docs/online.md`): recordings in a private R2 bucket behind `GET /api/audio/*`, kept on the device as they are
  played, with an opt-in Keep offline per deck. Google sign-in gates the whole app.
- Phone feel: a back button at the top of the settings, each deck's settings on a card of its own, settings in framed groups, a short
  buzz and a pressed or pulsing look when a rating or a recording is tapped, a colour wash over the screen (review) or the card
  (browse) as a recording starts, tap targets of 44px or more on every screen, the page kept out of the notch and home bar, and the
  second recording of a "this then that" fetched and loaded while the first plays. **Not yet tried on a real phone**: the buzz
  (Android only; iPhone browsers have no vibration), the wash, and the safe-area padding. **The gap between the two recordings**: the speech markup now asks
  for no added silence (`mstts:silence`, `SpeechMarkupOf.ts`) and the file name carries a revision so devices fetch the new files; the
  full regeneration and `upload-audio --remote` are under way, then the manifest is committed.
- Deployed and live: the app on GitHub Pages, the API on its Worker's custom domain, the recordings uploaded to R2, and CI deploying
  `main` and running the acceptance suite against the live URL.

## Decisions

- No XP, levels, badges or streaks: one daily card goal and an evening reminder if unmet.
- Every word is studied both ways, target to English and English to target.
- Slower audio is `-15%`, no lower. Undo of an answer was built and removed on purpose.
- FSRS fuzz is off (small decks, predictable intervals); revisit at hundreds of cards (`docs/scheduling.md`).
- A retention change does not reschedule existing cards. A look-ahead answer never reschedules a card. Fading is three good-or-easy
  answers. Notes are at most 280 characters. Notes and pictures are per card.
- "Similars" is the one word for sounds and shapes that are mixed up, in every language.
- Avoid RTK Query for now: the device is the offline source of truth, and mutations are ordered all-or-nothing thunks.
- No `*Dependencies` bags: pure functions, plain effect functions, one `export const` runtime object per process.
- `content/` is transitional. Decks become user data (D1; `docs/decks.md`, `docs/online.md`), and the package dissolves into
  `shared/` (schema, note-to-cards rules) and language reference data. Use the app for real first.

## Next

1. **Try the daily-goal reminder on a real phone** (`docs/reminders.md`): run `pnpm --filter @flashcards/api vapid-keys`, set the
   three names in `.env.dev` and GitHub (`MANUAL-SETUP-STEPS.md` 4f), apply the migration (`db:migrate:local`, and the deploy), provision,
   then turn it on in settings. Built and green; never run against a real push service.

## Backlog

- [ ] Learner-made decks and adding to any deck (`docs/decks.md`), full stack on D1; then Japanese and Dutch cards, then the dictionary.
  Deferred: for now cards are added through Claude sessions, from a list the developer keeps in a notepad app.
- [ ] Sync is built, deployed and tried on two devices (`docs/sync.md`). Left: delete my data and JSON export. **Do before the app is
  opened to anyone beyond the sole OAuth test user.**

- [~] Storage (`docs/storage.md`): `idb` adopted, and IndexedDB and localStorage moved out of `redux/` into `webapp/src/storage/`.
  `fake-indexeddb` is in: the database upgrades, clearing and a record-then-load round trip run against it. Open: more of the real
  `storage/index-db/` modules (pictures, sync events and records) are still tested only through the in-memory stand-ins.
- [ ] Open content (`docs/open-content.md`, needs a decision on CC BY-SA): Tatoeba import tool, Dutch reading deck by spelling pattern
  (needs Dutch voices first), textbook-friendly learner cards for Korean and Dutch sentences.
- [x] Anki pronunciation packages (`docs/audio.md`): Azure chosen over the package audio (no licence); Korean pronunciation deck built from our own words.
- [ ] Pronunciation and "sounds alike" decks: a native reader to check the 84 words, the 13 pairs and their explanations; more pairs (the Anki list is unlicensed, so ours); whether the pairs should also be similars of the starter words.
- [ ] Grammar cards from sentences: the `grammar-check` skill proposes grammar cards with explainers (to `private-source/grammar/`); still to build: the grammar note type to import them into, and the in-app version (an API route with a spend guard).
- [ ] Browse: notes and pictures shown and editable there; add a card with a deck choice (needs learner-made decks).
- [ ] Sentence, grammar and cloze note types and their decks, from the learner's own writing; cloze rendering. Naver dictionary links
  need a licence and terms check first.
- [ ] Very basic Japanese sentences with a furigana or romaji toggle. Find out best modern romisation similar to Korean choice
- [ ] Dutch content and voices (`AzureVoices` joins `Language` when Dutch does).
- [ ] Romanisation: audit every `romanisation` in `content/` against the Revised Romanization as decks grow.
- [ ] Image resizing in the Worker.
- [ ] Sound similars for the extended katakana; the learner to listen to the dakuten, combined and extended kana recordings.
- [ ] Hiragana and katakana pairs and groups chosen for similars to be checked by deep web search.
- [ ] A "returning learner" fixture seed for the acceptance specs.
- [ ] Theme: the manifest's `theme_color` and `background_color` are static (dark); an explicit Light choice on a dark device flashes
  dark on load (needs a small inline script in `index.html`).
- [ ] Rethink precaching the service worker's 15 files if the app build grows; recordings are already outside it.
- [ ] A flake seen once and not reproduced: `tests/pwa/EditingACard` on mobile-pwa, after the Keep-offline change. If it returns, look at
  timing around the service worker taking control.
- [ ] README polish for the open-source release and case study on personal-website.
- [ ] Dependency bumps: check `pnpm outdated -r` and propose them. Hold TypeScript 7 (ESLint cannot read it), `@types/node` 26 (the
  runtime is Node 24) and the Alchemy 2.0 beta.
