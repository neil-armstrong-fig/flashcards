# Openly licensed sentences and grammar, and Dutch reading cards

## Decided (2026-10-08, by the developer)

- **Tatoeba** is the source of beginner sentences. Not built yet.
- **Textbooks:** the developer will supply them so the sentences can be entered for them, which is quicker than typing them in the app.
  They are copyrighted: keep them under `private-source/` (git-ignored), and the cards that come from them are the developer's own
  (learner-made, in their account), not shipped in `content/`.
- **Dutch pronunciation is shown as a respelling for an English reader, not IPA** ("as it would be spelt if sounded in English",
  syllable by syllable, stressed syllable in capitals: `hoe gaat het` is `hoo KHAHT uht`). Where an English letter is only close
  (the throaty `g`, `ui`, `eu`, `r`) the card says so. The respelling is data like the Korean romanisation, not a computed field,
  until a rule set is checked against enough words.
- **Grammar from sentences** (corrected 2026-10-08): the aim is not to mark a sentence but to **extract the grammar principles from it
  and offer new flashcards for them, with a short explainer as the card's note.** It is a terminal skill that can run over a file of
  sentences in batch: the project skill `grammar-check` (`.claude/skills/grammar-check/SKILL.md`), which writes proposals to
  `private-source/grammar/` for the developer to review; it adds nothing to the app. One card per principle (a new sentence becomes
  another example on an existing card). The cards need a **grammar note type** (a cloze, a choice, or an explanation, with the
  explainer as `explanation`), which is the Backlog item for sentence, grammar and cloze notes. The in-app version (an API route that
  asks a model, with a spend guard like the audio one) comes later.
- **Korean pronunciation deck** is built (see `docs/audio.md`); the Dutch counterpart is the "reading" deck below.

Sections below were written before those decisions.

Exploration only; nothing has been added to `content/` from these sources. Korean and Dutch only (Japanese waits until the learner can read it
again). Licence statements below were read on the source pages on 2026-10-08; recheck the page before importing.

## The one thing to decide first: share-alike

Most open text is **CC BY-SA 4.0** (Wikibooks, Wiktionary). The decks are public in this repository. Anything adapted from a
BY-SA source must be published under BY-SA too, with attribution. That is acceptable for sentence data kept in its own folder
with its own licence note, but it should not be mixed into code or the existing hand-written decks without a decision. **CC BY**
sources (Tatoeba) only need attribution.

## Sources

| Source | Covers | Licence | Notes |
| --- | --- | --- | --- |
| [Tatoeba](https://tatoeba.org/en/downloads) | Many short sentences with translations, Korean and Dutch both, plus Korean to Dutch pairs | **CC BY 2.0 FR** (part also CC0). Audio is licensed per contributor; with no licence it must not be reused | Best fit for beginner sentences. The "Sentence pairs" export gives Korean with its English translation. Attribution: sentence author and Tatoeba. Quality varies, so filter by length (short) and review each; `tools/` should do the filtering, a human the choosing. Take the text only, and generate our own audio (Azure). |
| [Wikibooks: Korean](https://en.wikibooks.org/wiki/Korean) | A 10-lesson beginner conversation track (greeting, forming sentences, particles, family, shopping...), alphabet and pronunciation pages, grammar pages | CC BY-SA 4.0 | Marked about 75% complete; the beginner level exists, later levels do not. Good source of graded dialogues and grammar notes. |
| [Wikibooks: Dutch](https://en.wikibooks.org/wiki/Dutch) | Complete beginner level: 8 lessons, practice pages, number and colour vocabulary (just over 1000 terms), an alphabet and an "Uitspraak" pronunciation page | CC BY-SA 4.0 | Marked 100% developed for beginner. Fits grammar notes and graded sentences. |
| Wiktionary | IPA and example sentences for single words | CC BY-SA 4.0 | Useful for checking a pronunciation or finding words for a spelling pattern (below). Not for bulk copying. |

Not usable: sites that say "free" but are all-rights-reserved (for example heardutchhere.net is free to read, not to reuse), and
any commercial textbook. A "CC BY 4.0 Korean worksheets" listing turned up with two different publishers named, so its
provenance is doubtful: skip it.

I did not find a modern, openly licensed Korean grammar *course* beyond Wikibooks; NIKL (National Institute of Korean Language)
word lists exist but their terms were not checked.

## Your textbooks

These are the better source for *your* learning (things you already met, so the cards jog memory), and typing is what makes it
work. They are copyrighted, so the right shape is **learner-made cards**, which the app already supports for Korean (browse
screen, kept per account in D1, not in the public repo). A sentence you type from a textbook then never enters `content/` or git.
Needed to make that comfortable:

1. Sentence and cloze note types (already in the Backlog), since a textbook page is mostly sentences.
2. Learner-made cards for Dutch, which needs the Dutch voices and `AzureVoices` joining `Language`. The Azure Dutch voices were
   already tried in `private-source/azure-ja-nl-test/dutch/` (Fenna, Colette, Maarten).
3. A way to tag a card with its book and chapter so they can be studied in book order.

Do not commit textbook text or the PDFs; keep any scratch copy in `private-source/`.

## Dutch reading cards (pronunciation first)

Agreed that decoding is worth having before vocabulary: read the word aloud, then hear it. Dutch spelling is regular enough
that a small set of patterns covers most of it, so a "reading" deck is **pattern then words**, not meanings first.

Proposed card, now with a respelling in place of IPA: the front is a Dutch word with no English; the back plays the recording and shows the respelling. Nothing to translate.
That is a new **reading** note type (one direction only, unlike the usual two) and fits `content/` as typed data.

Patterns to cover, in this order (the spellings are standard Dutch orthography; the words are ours to write, so they carry no
licence issue):

1. Short vowels in closed syllables: a e i o u (`bad`, `bed`, `bit`, `bos`, `bus`), and long vowels in open syllables
   (`ma-ken`, `me-ten`, `bo-men`): the checked and free vowel rule.
2. Doubled vowels at the end of a syllable: aa ee oo uu (`maan`, `zee`, `boom`, `vuur`).
3. The diphthongs: ei / ij (one sound), au / ou (one sound), eu, ui, oe.
4. `g` and `ch` (the hard, throaty sound), `sch`, `sj`, `tj`, and `ng` / `nk`.
5. `w` and `v` (Dutch `w` is not English `w`), final-consonant devoicing (`hond`, `bed` end in `t`), `r` in any position.
6. The unstressed `e` (schwa) in `de`, `een`, `-en`, `-e`.
7. Loan words and `-tie`, `-ig`, `-lijk`, `ge-` and `be-` prefixes.

A start: about 10 to 15 words per pattern, hand-chosen, each tagged with its pattern so a struggling card can show the rule. Check
every word's pronunciation against Wiktionary's IPA (CC BY-SA, so cite it in `REFERENCES.md`, but the IPA of a word is a fact),
and have the learner listen to the generated audio before trusting it. The Korean version of this card now exists (`PronunciationDeck`): spelling and no audio on the front; the spelling, the sound in hangul and the audio on the back. Dutch reuses the `pronunciation` note kind with the respelling in `meaning` (to be built when Dutch voices are chosen).

Same idea for Korean already exists (the hangul and sound-similar decks), so this is the Dutch counterpart.

## Suggested order

1. Dutch reading deck (hand-written words, no licence work). Needs Dutch voices, so do `AzureVoices` first.
2. Tatoeba import tool in `tools/` (Korean first), writing a reviewed sentence file with attribution; sentence note type.
3. Textbook-friendly learner cards for Dutch and Korean sentences; tagging by book.
4. Wikibooks lessons only if you want their text in the app; a link out is free of any licence question.

Each point there needs your decision before work starts.
