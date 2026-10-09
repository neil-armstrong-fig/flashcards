# AGENTS.md: content

The words to learn, as typed data, one folder per language (`korean/`, `japanese/` and `dutch/`), and
the manifest of recordings made for them. Plain TypeScript and data, no behaviour beyond turning a note into cards: it may not
import React or Redux, and it may import `@flashcards/shared` and nothing else in the workspace (lint enforces it). The
webapp, the audio tool and later an API all sit above it.

It is compiled as raw source by whoever imports it, like `shared`, so one folder here reaches another by the package's own name
(`@flashcards/content/types/Deck`), never `@src`, and a same-folder `./x` is fine.

```
src/types/     Deck, VocabNote (a word and the facts about it), DeckCard (one question made from a note)
src/cards/     CardOfNote, CardsOfNote and CardsOfDeck: how a note becomes cards, and the order a deck introduces them in
src/korean/    StarterDeck.ts and its test; `pronunciation/` (PronunciationDeck: the sound-change deck, with `PronunciationGroups.ts` holding its words by rule); `sounds-alike/` (SoundsAlikeDeck: pairs of words told apart by ear, `SoundsAlikePairs.ts` holding the pairs, `notes/NotesOfSoundsAlikePair` making a pair's two notes)
src/dutch/     StarterDeck.ts (100 everyday words, nouns without their article, no romanisation since Dutch is already Latin) and its test; `pronunciation/` (PronunciationDeck: words read from their spelling, `PronunciationGroups.ts` holding them by pattern, with a respelling for an English reader in `meaning`)
src/japanese/  Kana (the table; `kana-table/` holds the basic, voiced, combined and core groups), the five kana decks (core hiragana and katakana of 71 each, combined of 33 each, and `KatakanaForeignDeck` of 23, whose notes keep the ids they had in the two-deck days) and their test, shape-similars/ (the katakana pairs commonly confused by shape, and `shapeSimilarsOf`)
src/decks/     ShippedDecks: every deck the app ships, in introduction order (the app and the audio tool both read it)
src/audio/     AudioRecordings (the manifest as typed data), recordings.json. Reading the manifest (which file a text, voice and speed names) is the webapp's (`webapp/src/audio/audio-file/AudioFileOf`)
src/CardDirection.ts   the two directions a card asks
```

**A `kana` note** (`VocabNote.kind`) is a character and its sound: the sound in `meaning` is shown, never spoken, so its cards have no audio on that side. Ids are `ja-hiragana-<romaji>` and `ja-katakana-<romaji>` whichever deck the note is in, so moving a note between decks keeps a learner's progress.

**A `pronunciation` note** is a word read aloud from its spelling (좋다 is said 조타). It has **one card only** (`directionsOfNote`), by the
developer's design: the front is the spelling with no audio, so the learner reads it first; the answer shows the spelling, how it is
said (`meaning`, shown as `[조타]`), its romanisation and its English `translation`, and speaks the word. The translation is not spoken,
so `meaningIsSpoken` is false for it and it has no English recording. Its ids are written out (`ko-pronunciation-jota`), never worked
out from the word.
The words and the rule explanations are our own; the sounds follow the standard pronunciation rules (표준 발음법, `REFERENCES.md`).

**A `sounds-alike` note** is one of two words that differ by a sound (바르다 and 빠르다). A pair is **two notes, so two cards**, by the
developer's design: both show the same text, `바르다/빠르다` (`meaning`, the first word first whichever is said), and each says a different word.
The answer shows the text again with the word that was said in bold (`DeckCard.emphasis`, which is `word`), plays it again, and offers the other
word as its sound similar (`soundSimilars`) to compare in the usual panel. One direction only (`directionsOfNote`), and the English is not
spoken (`meaningIsSpoken`). A note's id is its pair's written-out id and `-a` or `-b` (`ko-sounds-alike-bareuda-ppareuda-a`). The pairs and their
explanations are ours, not the unlicensed Anki list's. The first note of every pair is introduced before any pair's second note, so the
two answers are kept apart.

**A `sheet-music` note** is one natural pitch drawn on a staff (`VocabNote.notation`: a clef and a pitch such as `C4`). `word` is the pitch's name and is what is played, so `language` is `music` (a `Subject`, beside the languages taught) and the audio manifest holds its tones under `music`. One card (`directionsOfNote`): the front has no text and shows the staff (`DeckCard.notation`), the answer shows the name and plays the note; there is no English (`meaningIsSpoken`). Ids are `music-<clef>-<pitch>` (`music-treble-c4`), so middle C has a card on each staff. The tones are generated, not spoken (`docs/audio.md`). The deck sets `Deck.offersVoiceAndSpeed: false`, which removes the voice and speed choices from its settings, its review screen and its browse list; any deck can do the same.

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
