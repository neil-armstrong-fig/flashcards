# Romanisation

The Revised Romanization of Korean (the South Korean standard) writes a word **as it is pronounced**, not as it is spelt: 학교 is
`hakgyo`, 한국 is `hanguk`, 같이 is `gachi`. A letter-for-letter transliteration gets these wrong, so the card form needs a library
that applies the sound changes.

## The choice

`koroman` (MIT, no dependencies, typed), behind `shared/src/language/RomanisationOf.ts`. Candidates were filtered on weekly npm
downloads (at least 1,000), a release in the last two years, and licence (all MIT), leaving `koroman` and `@romanize/korean`;
`romaja` was tried as well, as the one whose documentation promised the sound changes. Each was run over 42 words: the ten starter
words and 32 chosen to need a sound change.

| Package            | Matches | Where it went wrong                                                                               |
| ------------------ | ------- | ------------------------------------------------------------------------------------------------- |
| `koroman`          | 42      |                                                                                                   |
| `romaja`           | 34      | double final consonants (`dar`, `gabs`, `ana`, `irda`), `iteoyo`, `dongrip`, a spoken h in 좋아요 |
| `@romanize/korean` | 33      | spells rather than pronounces: `gati`, `jongro`, `seolnal`, `dal`, `joheun`, `gwaenchanhayo`      |

The expected values were written from the standard, not taken from an official table, so a few of the
harder rows deserve a check by someone who reads Korean. They are the rows of `RomanisationOf.test.ts`, which is what catches a
library upgrade that quietly changes an answer, and `content/src/korean/StarterDeck.test.ts` holds every starter note to it.

A second set came from the Korean Wiki Project's page on [consonant assimilation](https://www.koreanwikiproject.com/wiki/Category:Consonant_assimilation),
which gives each word's pronunciation in Hangul. They were turned into the Revised Romanization by its rules (which write the
sound changes but not tensing: 학기 is `hakgi` although it is said `학끼`) and run through `koroman`: 25 of them are now rows of
`RomanisationOf.test.ts`. It got all but two right (three, before a native ear settled 입학 and 값어치 in its favour).

**Known gaps**, rare enough to leave and worth knowing: an `n` added inside some compounds after a final that is not `ㄴ`, `ㄹ` or
`ㅁ` (부엌일 gives `bueokil`, should be `bueongnil`), and `ㅌ` before `ㄴ` after `ㄹ` (훑는 gives `hulneun`, should be `hulleun`).
The rest were checked by ear by a Korean reader: 입학 is `ipak` and 값어치 is `gapseochi`, as `koroman` writes them. The learner can correct the field.

## How it is used

The card form suggests the romanisation as the learner types the Korean, and stops following the word once they type over it
(clearing it hands the suggestion back). It is a suggestion to correct, not a fact: names and unusual words can differ. The API
checks only that what it is sent is Latin letters (`RomanisationText`), not that it is right.
