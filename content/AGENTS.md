# AGENTS.md: content

The words to learn, as typed data, one folder per language (`korean/` now; `japanese/` and `dutch/` as their phases land), and
the manifest of recordings made for them. Plain TypeScript and data, no behaviour beyond turning a note into cards: it may not
import React or Redux, and it may import `@flashcards/shared` and nothing else in the workspace (lint enforces it). The
webapp, the audio tool and later an API all sit above it.

It is compiled as raw source by whoever imports it, like `shared`, so one folder here reaches another by the package's own name
(`@flashcards/content/types/Deck`), never `@src`, and a same-folder `./x` is fine.

```
src/types/     Deck, VocabNote (a word and the facts about it), DeckCard (one question made from a note)
src/cards/     CardOfNote, CardsOfNote and CardsOfDeck: how a note becomes cards, and the order a deck introduces them in
src/korean/    StarterDeck.ts and its test
src/japanese/  Kana (the table), HiraganaDeck, KatakanaDeck and their test, shape-similars/ (the katakana pairs commonly confused by shape, and `shapeSimilarsOf`)
src/decks/     ShippedDecks: every deck the app ships, in introduction order (the app and the audio tool both read it)
src/audio/     AudioRecordings (the manifest as typed data), recordings.json. Reading the manifest (which file a text, voice and speed names) is the webapp's (`webapp/src/audio/audio-file/AudioFileOf`)
src/CardDirection.ts   the two directions a card asks
```

**A `kana` note** (`VocabNote.kind`) is a character and its sound: the sound in `meaning` is shown, never spoken, so its cards have no audio on that side. Ids are `ja-hiragana-<romaji>` and `ja-katakana-<romaji>`.

**A note is not a card.** A word is stored once, as a `VocabNote`, and studied as **two cards: target language to English
(reading it) and English to target language (saying it).** Every note type that follows (sentences, grammar, kana) generates
both directions unless there is a stated reason not to. All of a deck's cards one way come before any the other way, so a
word's two cards are never next to each other and seeing one is not the answer to the other.

- **Ids are for ever.** Learner progress is stored by card id, so a deck update may add notes and cards but must never
  change, reuse or remove an id that has shipped. A note's id is `<language>-<kind>-<slug>` (`ko-vocab-water`), and a card's id
  is the note's and its direction (`ko-vocab-water/to-english`), so the note's id must never change either.
- **Deck order is the order new cards are introduced in.**
- **Every deck has a test** that note ids and card ids are unique and well formed.
- **Provenance goes in `REFERENCES.md` in the same change.** Anything copied or adapted from a dataset, word list or recording
  records its source, licence and attribution there. Do not paste from a source whose licence is unknown.
- **A card the learner makes is not deck content.** It is a `VocabNote` with id `ko-custom-<token>` kept by the app and the API, not here, and
  becomes cards through `cardsOfNote` the same way. Nothing here may depend on one.
- **Shape similars** (`VocabNote.shapeSimilars`) are kana mixed up by their shape (シ and ツ). They are data only: shown once the answer is, never spoken, and have no recordings.
- **Similars** (`VocabNote.soundSimilars`) are words a learner mixes up with this one by ear (물 and 불). They get the same four
  recordings as a word, so the compare panel works offline; a learner adds their own through the API (`api/AGENTS.md`).
- Romanisation follows the Revised Romanization of Korean.
- **`recordings.json` is the audio tool's output** (`tools/`): never edit it by hand. It names recordings by language, then by
  the text spoken, then by variant, and the app is silent for anything it does not name. A new deck word has no recordings until
  the tool has been run for it (`docs/audio.md`).
