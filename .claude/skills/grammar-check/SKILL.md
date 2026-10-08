---
name: grammar-check
description: Extract the grammar principles from Korean or Dutch sentences (a learner's own, or from a textbook) and propose flashcards for each principle, with a short explainer as the card's note. Use for one sentence or a file of them in batch. Not for Japanese yet.
---

# Grammar cards from sentences

The learner gives sentences they already know (typed from their textbooks, or written themselves). The job is **not to mark the
sentence**: it is to find the grammar principles in it and offer **new flashcards for those principles**, each with an explainer
the learner can read on the answer side. Sentences they know are the best examples to hang a rule on.

The in-app version (a learner submits a sentence and gets grammar cards offered) comes later (`docs/open-content.md`). This skill is
the terminal version, and can run over a whole file in batch.

## Input

- **One sentence** in the message, or
- **A file**: one sentence per line, or a TSV of `sentence<TAB>meaning`, or `sentence<TAB>meaning<TAB>source` where source is a
  book and chapter. Textbook material stays under `private-source/` (git-ignored); never copy it into `content/`, `docs/` or a commit.

Work out the language from the script: hangul is Korean, Latin letters are Dutch unless told otherwise. Japanese: say it is not
covered yet and stop. A mixed or unrecognisable line is reported, not guessed at.

## For each sentence

1. **Check it first, briefly.** If it is wrong, say what is wrong and give the right sentence, and take principles from the right
   one. Never teach a rule from a mistake. If it is right, say nothing about it.
2. **Find the principles.** Each distinct, teachable rule the sentence shows, at the size of one flashcard: one particle or ending
   and what it does (`-(으)면` if/when; `에서` the place where an action happens against `에` the destination), one word-order rule
   (Dutch: the verb second in a main clause, last in a subordinate one), one pattern (`het` words and their diminutives; a separable
   verb split across the clause). Two or three per sentence is plenty. **Skip** what a beginner would never study alone (the plain
   subject particle in the thousandth sentence), and what is just vocabulary. Prefer the rule that is hardest to see.
3. **Make a card for each principle.** See "A card" below. Use the sentence as the example if it shows the rule cleanly; otherwise
   write a plainer example of your own, and say which it is.
4. **Say how it is said**, for the example, where it helps the card:
   - Korean: the pronunciation in hangul where it differs from the spelling (표준 발음법; the rules are in
     `content/src/korean/pronunciation/`), and name the rule, so the learner can find it in the Korean pronunciation deck.
   - Dutch: a **respelling for an English reader**, not IPA (the learner does not read IPA): syllable by syllable, with English
     letters and the stressed syllable in capitals (`hoe gaat het` is `hoo KHAHT uht`). Say where an English letter is only close
     (the throaty `g`, `ui`, `eu`, `r`). One convention across a batch.

## A card

A grammar card is a principle with an example, and the explainer is the note on it. Each card has:

| Field         | What it holds                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `point`       | The principle's name, in the form the learner will meet it: `-(으)면`, `에서 vs 에`, `verb second in a main clause`.                                                                              |
| `kind`        | `cloze` (the example with the rule's word blanked, to recall it), `choose` (which of two forms fits), or `explain` (the point shown, say what it does). Prefer `cloze`; use the others where a blank would give no sense of the rule. |
| `front`       | For `cloze`, the example with the blank (`비가 오___ 집에 있을 거예요.`); otherwise the question.                                                                                                     |
| `back`        | The answer (`-(으)면`, `오면`) and the example in full, with its English.                                                                                                                         |
| `explainer`   | The note: 2 to 4 sentences in UK English. What it means, when to use it, the one thing that trips people up, and a comparison with its nearest neighbour (`에` against `에서`). Plain words; no grammar jargon without a gloss. |
| `example`     | `{text, translation, said}` where `said` is the hangul pronunciation (Korean) or the respelling (Dutch).                                                                                        |
| `level`       | Rough: CEFR A1 to B1 for Dutch; TOPIK 1 to 3 for Korean.                                                                                                                                        |
| `source`      | `sentence` (taken from the learner's sentence) or `ours` (an example we wrote), and the learner's `source` book and chapter if given.                                                          |
| `confidence`  | `sure`, or `unsure` with why (an exception, a regional or register point). Say `unsure` rather than sound certain: a learner will memorise this.                                                  |

## Output, and no duplicates

Write proposals to `private-source/grammar/<input name>.json`: `{sentences: [{sentence, language, verdict, corrected?, cards: [...]}]}`.
Then print a short table in the terminal (principle, kind, from which sentence, confidence) and the path.

**One card per principle, not per sentence.** Before proposing, read any `private-source/grammar/*.json` already there and the
grammar cards the project holds (once the grammar note type exists, in `content/`); where the principle is already proposed,
add the new sentence as another `example` on that card instead of making a second. Across a batch, merge the same way. List the
merges at the end.

Do not stop at the first wrong sentence; list the wrong ones at the end.

## Honesty

- **Do not invent sources, rules, or textbook page numbers.** If unsure whether something is idiomatic, or about an exception,
  mark it `unsure` and say why.
- Name principles by their standard names. Where a free reference helps, point to the Wikibooks Korean or Dutch course (CC BY-SA)
  by lesson, only for a page you were able to read. Do not paste passages from any source, and do not quote the learner's textbook
  back: explain in your own words.
- Dutch has a standard form and regional speech; teach the standard (Netherlands) one, and mention a Flemish difference only if asked.
- **This skill proposes. It does not change `content/`, add cards to the app, stage or commit.** The learner reviews the file
  and decides what becomes a card.
