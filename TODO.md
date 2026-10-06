# TODO

Task tracker. Design and rationale are in `docs/PLAN.md`; credits are in `REFERENCES.md`.

- `[ ]` todo, `[~]` in progress, `[x]` done. Update this file in the same change as the work.
- ATDD: write the acceptance spec first, watch it fail for the right reason, then implement. Mutation-check after-the-fact tests.
- A phase is done only when `pnpm checks` and the acceptance suite are green against the production build.
- Ask before adding or upgrading any dependency. Staging, committing and pushing are the developer's job.

## Where we are

Everything listed as done is built and green: `pnpm checks` in every package, the acceptance suite on desktop and Pixel 5, and the
service-worker project (`pnpm acceptance-tests:pwa`). Nothing is deployed. Run the suite with `pnpm start:preview`, then
`pnpm acceptance-tests`. `pnpm start:local` runs the API and the app together.

**Works today:**

- Three decks (Korean starter words, Japanese hiragana with 104 notes, Japanese katakana with 127), each studied both ways and each in
  its own session with its own limits.
- Review loop: four ratings, learning steps and learn-ahead, interval labels on the buttons, keyboard shortcuts, suspend and bury,
  look ahead, and studying only new or only struggling cards.
- One daily goal in cards; desired retention (70 to 97 percent); colours (Match device, Light, Dark); PNG app icons.
- Struggling cards (lapse threshold, clearing by three good answers, optional auto-suspend, "This is hard", a Struggling list) and
  memory aids (a note and a picture per card, fading, a prompt on a struggling card).
- The learner's own Korean cards (browse screen, signed in only), with the romanisation suggested (`docs/romanisation.md`), kept
  online per account and on the device.
- Similars: words a learner mixes up, shipped for Korean sounds and Japanese shapes and sounds, and added by the learner.
- Audio end to end (`docs/audio.md`): 978 recordings, played on show with replay, listen-only, voice and speed settings.
- Online-served model (`docs/online.md`): recordings in a private R2 bucket behind `GET /api/audio/*`, kept on the device as they are
  played, with an opt-in Keep offline per deck. Google sign-in gates the whole app.

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
  `shared/` (schema, note-to-cards rules) and language reference data. Deploy and use the app for real first.

## Next

1. **Deploy** (`MANUAL-SETUP-STEPS.md`): first commit and the GitHub repository, Pages and DNS, then `provision`, the Worker's custom
   domain, `upload-audio -- --remote` and the Actions secrets. Never run for real, so expect to fix the first deploy.
2. **Learner-made decks and adding to any deck** (`docs/decks.md`), full stack on D1; then Japanese and Dutch cards, then the dictionary.
3. **Sync** (`docs/sync.md`): four decisions are open at the end of that document.
4. **Daily-goal reminder** (Web Push, a cron-triggered Worker; needs the deployed API) with a setting to turn it off or move it.

## Backlog

- [ ] Browse: notes and pictures shown and editable there; add a card with a deck choice (needs learner-made decks).
- [ ] Sentence, grammar and cloze note types and their decks, from the learner's own writing; cloze rendering. Naver dictionary links
  need a licence and terms check first.
- [ ] Very basic Japanese sentences with a furigana or romaji toggle.
- [ ] Dutch content and voices (`AzureVoices` joins `Language` when Dutch does).
- [ ] Romanisation: audit every `romanisation` in `content/` against the Revised Romanization as decks grow.
- [ ] Image resizing (in the Worker, once it is deployed).
- [ ] Sound similars for the extended katakana; the learner to listen to the dakuten, combined and extended kana recordings.
- [ ] Hiragana and katakana pairs and groups chosen for similars to be checked by someone who reads Japanese.
- [ ] A "returning learner" fixture seed for the acceptance specs.
- [ ] Theme: the manifest's `theme_color` and `background_color` are static (dark); an explicit Light choice on a dark device flashes
  dark on load (needs a small inline script in `index.html`).
- [ ] Pictures are not resized, only refused over 5 MB.
- [ ] Rethink precaching the service worker's 15 files if the app build grows; recordings are already outside it.
- [ ] A flake seen once and not reproduced: `tests/pwa/EditingACard` on mobile-pwa, after the Keep-offline change. If it returns, look at
  timing around the service worker taking control.
- [ ] SEO and README polish for the open-source release.
- [ ] Dependency bumps: check `pnpm outdated -r` and propose them. Hold TypeScript 7 (ESLint cannot read it), `@types/node` 26 (the
  runtime is Node 24) and the Alchemy 2.0 beta.
