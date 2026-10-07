# Decks the learner makes, and adding to any deck

Status: **design, decided with the developer on 2026-10-06; build in the slices at the end.** The decks shipped today (the Korean
starter words, the kana) are fixed and the learner's own cards are Korean only and always join the starter deck
(`deckIdOfCard`). This changes that.

## What the developer asked for

- The learner can add cards to **any** deck, and can **lock** a deck so that a fixed set (the kana) is not added to by accident.
- The learner can **create decks** from a list of target languages: **Korean, Japanese, Dutch**.
- The developer picks the audio sources (`docs/audio.md`); the learner then types only the words, sentences or notes to learn.
- The "Make a card" form gains a **deck** choice and **generic** placeholders. It fills in the Latin letters and an English
  meaning itself where it can, from a dictionary, **both ways**: type the English first or the target word first.

## Decks

A deck is `{id, name, language, locked}`, and it is either **shipped** (in `content/`, same for everyone) or **made** (by the
learner, kept per account in D1 and on the device, ids `deck-<uuid>`).

- **Locking.** A locked deck has no way to add a card to it: it is missing from the deck choice and its Browse view shows no form.
  Shipped decks start locked (the kana, the starter words), made decks start unlocked, and a switch on each deck's row in the
  settings changes either. It stops accidents; it is not security.
- **Creating.** A small form (name, language) on the home screen. The language decides the voices, the romanisation and
  the dictionary. A made deck has its own session and limits like any other (`DeckLimits`), and appears on the home screen.
- **Cards.** A made note carries `deckId` and `language`. Existing made notes (all Korean, ids `ko-custom-<uuid>`) are read as
  belonging to `ko-starter`, so nothing the learner has made moves.
- **Deleting a deck** removes its notes, their similars, memory aids and recordings kept for them, after a confirmation that says
  how many cards it holds. Shipped decks cannot be deleted.

## The "Make a card" form

One form on Browse, reached from the all-cards view or from one deck's view. The deck choice defaults to the deck being browsed and
can always be changed; unlocked decks only. The three fields are named for what they hold, not for a language:

| Field                | Placeholder (UK English)                          | Filled in from                                                          |
| -------------------- | ------------------------------------------------- | ----------------------------------------------------------------------- |
| The word or sentence | "A word or sentence in <language>"               | The learner.                                                            |
| What it means        | "What it means in English"                        | The learner, or the dictionary (below).                                 |
| How it is said       | "How it is said, in Latin letters" (shown only for Korean and Japanese) | The romanisation rules (below), editable.                |

Typing in either of the first two fields looks the other up. A suggestion fills the empty field and is plainly marked as a
suggestion; the learner may change anything. Nothing is saved until Add. A lookup that finds nothing says so and leaves the
fields alone.

## Latin letters

- **Korean:** the Revised Romanization, already built (`koroman`, `docs/romanisation.md`).
- **Japanese:** a pure function from kana to Hepburn (the same table as `Kana`), in `shared/`. Kanji cannot be read by a rule: the
  reading comes with the dictionary entry (JMdict gives it in kana), and the function turns that into letters. A kanji word typed
  with no dictionary match asks the learner for the reading.
- **Dutch:** already Latin, so there is no field.

## The dictionary, both ways

The lookup must be offline-capable for a card already made, and must not depend on a site that forbids it. Naver's dictionary
(`korean.dict.naver.com`) has no public interface and its terms do not allow copying its
entries, so it is **not** a data source; a learner may be shown a link to it, nothing more.

These are ideas to use, not decisions. Nothing is imported yet, and the approach for each (what is stored, how the credit is shown,
how share-alike is honoured) will be worked out so the app stays in good standing with every licence. Each licence is read before
use, and `REFERENCES.md` credits what is used:

| Language | Source                                                   | Licence                                                        | Notes                                                                                                  |
| -------- | -------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Japanese | JMdict (EDRDG)                                           | CC BY-SA 4.0: use in an app is allowed with acknowledgement   | Readings in kana, so it also gives the Latin letters. The licence page says to credit it in the app.   |
| Dutch    | English Wiktionary, as extracted by wiktextract (kaikki.org) | CC BY-SA 4.0 and GFDL                                      | Dutch entries with English glosses. Share-alike applies to the data, not to the app's code.            |
| Korean   | English Wiktionary (kaikki.org); or KRDict, from Korea's National Institute of Korean Language | Wiktionary as above; KRDict's open licence to be read | KENGDIC's licence was not found. Wiktionary is the safe default; KRDict is richer if its terms allow. |

Shape: a one-off importer in `tools/` builds a compact index per language from the dump, **headword to English
glosses, and English word to headwords**, which is what makes it work both ways. The index is served by the Worker
(`GET /api/lookup?language=ko&q=...`) from D1, and the answer for a word the learner kept is stored with the card, so a made card
works offline. Only a lookup *while making a card* needs the network.

## Audio

Voices exist for all three languages (`AzureVoices`). The speech endpoint today takes Korean (and English meanings); it grows to
take Japanese and Dutch text, with the same checks (length, characters allowed for that language), cache and spend guard. A made
card is recorded before the card exists, as now, so it is never silent offline.

## What changes in the API and the app

- D1: a `decks` table; `deckId` and `language` in the payload of a `note` record (`docs/sync.md`).
- The check of a `note` record (`readRecordChange`) is by the deck's language, not Korean only (`KoreanText` becomes a per-language check in `shared/`).
- `webapp/src/redux/slices/deck/`: made decks beside shipped ones (`SelectDecks`), `deckIdOfCard` reads a note's own `deckId`, the home deck
  list and the settings limits list made decks, and a `locked` setting per deck.
- Specs: creating a deck, adding to a chosen deck, a locked deck missing from the choice, the lookup filling either field (against
  the fake API), a deck deleted with its cards.

## Slices, in order

1. **Decks and the form, no dictionary.** The model, create and delete a deck, lock, deck choice and generic placeholders, Korean
   still the only language that speaks. Specs first.
2. **Japanese and Dutch notes**: per-language text checks, the speech endpoint, Japanese romanisation.
3. **The lookup**: the importer, the index, `/api/lookup`, the form's suggestions, attribution on screen.

## Decisions still open (none blocks slice 1)

1. **Korean source:** Wiktionary (safe) or KRDict (richer, licence to read).
2. **Where the index lives:** D1 (simplest, free tier is ample for three languages) or static files in R2 fetched per word.
3. **Sentences:** a dictionary finds words, not sentences. Recommended: a card for a sentence takes its meaning by hand, and the
   lookup only suggests for something that looks like one word.

## Decision: `content/` is transitional (2026-10-07)

Decks are meant to be fully user driven, so the decks the app ships today are a stepping stone. When slice 1 lands, the shipped decks
and `audio/recordings.json` leave `content/` and the package dissolves: the schema and the note-to-cards rules move to `shared/` (the API
must validate decks and may import nothing else), and language reference data (the kana table, the similar pairs, later the dictionaries)
goes to a `language/` package or `shared/language/`, depending on how large the dictionaries are. Voices, romanisation and the text checks
are already in `shared/` and stay, to be tuned as languages are added. A shipped deck, if wanted, becomes an optional template a learner imports.

Not started on purpose: deploy and use the app for real first. The cost to plan for is the acceptance specs, which name the starter deck's
words and start every run with it, and would need decks seeded through the fake API.
