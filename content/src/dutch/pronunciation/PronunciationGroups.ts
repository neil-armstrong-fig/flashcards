import type {PronunciationGroup} from "@flashcards/content/dutch/pronunciation/types/PronunciationGroup";

/**
 * The spelling patterns of Dutch, each with words that show it, in the order they are taught (`docs/open-content.md`). The words
 * and the explanations are our own. The respellings are for an English reader, not IPA: syllables apart, the stressed one in
 * capitals, `kh` for the throaty `g` and `ch` (as in Scottish "loch"), `ay`, `oh` and `ah` for the long vowels, `uh` for the
 * unstressed `e`, and `ow` for `au`, `ou` and `ui`. English has no exact match for several Dutch sounds (`u`, `eu`, `ui`, `r`), so
 * each is only close. The rows deserve a check by a Dutch reader.
 */
export const PRONUNCIATION_GROUPS: readonly PronunciationGroup[] = [
  {
    rule: "Short and long vowels",
    explanation:
      "A vowel closed in by a consonant is short (bed, bos). A single vowel that ends a syllable is long (ma-ken, bo-men), which is why the long vowel is not doubled in writing there.",
    words: [
      {id: "nl-pronunciation-bed", word: "bed", said: "bet", translation: "bed"},
      {id: "nl-pronunciation-bos", word: "bos", said: "boss", translation: "forest"},
      {id: "nl-pronunciation-kat", word: "kat", said: "kat", translation: "cat"},
      {id: "nl-pronunciation-maken", word: "maken", said: "MAH kuhn", translation: "to make"},
      {id: "nl-pronunciation-meten", word: "meten", said: "MAY tuhn", translation: "to measure"},
      {id: "nl-pronunciation-bomen", word: "bomen", said: "BOH muhn", translation: "trees"},
      {id: "nl-pronunciation-lopen", word: "lopen", said: "LOH puhn", translation: "to walk"},
      {id: "nl-pronunciation-zeven", word: "zeven", said: "ZAY vuhn", translation: "seven"},
    ],
  },
  {
    rule: "Doubled vowels",
    explanation:
      "At the end of a syllable that a consonant closes, a long vowel is written twice: aa, ee, oo, uu. It is one long sound, not two.",
    words: [
      {id: "nl-pronunciation-maan", word: "maan", said: "mahn", translation: "moon"},
      {id: "nl-pronunciation-zee", word: "zee", said: "zay", translation: "sea"},
      {id: "nl-pronunciation-boom", word: "boom", said: "bohm", translation: "tree"},
      {id: "nl-pronunciation-vuur", word: "vuur", said: "vewr", translation: "fire"},
      {id: "nl-pronunciation-kaas", word: "kaas", said: "kahss", translation: "cheese"},
      {id: "nl-pronunciation-twee", word: "twee", said: "tvay", translation: "two"},
      {id: "nl-pronunciation-ook", word: "ook", said: "ohk", translation: "also"},
      {id: "nl-pronunciation-aan", word: "aan", said: "ahn", translation: "on, at"},
    ],
  },
  {
    rule: "ei and ij",
    explanation: 'ei and ij are two spellings of one sound, a little like the English word "eye" but opening wider.',
    words: [
      {id: "nl-pronunciation-tijd", word: "tijd", said: "tite", translation: "time"},
      {id: "nl-pronunciation-ijs", word: "ijs", said: "ice", translation: "ice, ice cream"},
      {id: "nl-pronunciation-mijn", word: "mijn", said: "mine", translation: "my"},
      {id: "nl-pronunciation-wijn", word: "wijn", said: "vine", translation: "wine"},
      {id: "nl-pronunciation-trein", word: "trein", said: "trine", translation: "train"},
      {id: "nl-pronunciation-klein", word: "klein", said: "kline", translation: "small"},
      {id: "nl-pronunciation-ei", word: "ei", said: "eye", translation: "egg"},
    ],
  },
  {
    rule: "au and ou",
    explanation: 'au and ou are two spellings of one sound, close to the "ow" of the English word "cow".',
    words: [
      {id: "nl-pronunciation-oud", word: "oud", said: "owt", translation: "old"},
      {id: "nl-pronunciation-koud", word: "koud", said: "kowt", translation: "cold"},
      {id: "nl-pronunciation-hout", word: "hout", said: "howt", translation: "wood"},
      {id: "nl-pronunciation-zout", word: "zout", said: "zowt", translation: "salt"},
      {id: "nl-pronunciation-blauw", word: "blauw", said: "blow", translation: "blue"},
      {id: "nl-pronunciation-vrouw", word: "vrouw", said: "vrow", translation: "woman"},
      {id: "nl-pronunciation-auto", word: "auto", said: "OW toh", translation: "car"},
    ],
  },
  {
    rule: "ui",
    explanation:
      'ui is like au and ou, but said with the lips rounded and pushed forward. English has no sound for it, so "ow" is only close.',
    words: [
      {id: "nl-pronunciation-huis", word: "huis", said: "howss", translation: "house"},
      {id: "nl-pronunciation-uit", word: "uit", said: "owt", translation: "out"},
      {id: "nl-pronunciation-tuin", word: "tuin", said: "town", translation: "garden"},
      {id: "nl-pronunciation-kruis", word: "kruis", said: "krowss", translation: "cross"},
      {id: "nl-pronunciation-buiten", word: "buiten", said: "BOW tuhn", translation: "outside"},
      {id: "nl-pronunciation-zuid", word: "zuid", said: "zowt", translation: "south"},
    ],
  },
  {
    rule: "eu",
    explanation:
      'eu is a rounded vowel with no English equivalent. Say the "ay" of "day" with the lips rounded as for "oh". "ur" is only close.',
    words: [
      {id: "nl-pronunciation-deur", word: "deur", said: "dur", translation: "door"},
      {id: "nl-pronunciation-neus", word: "neus", said: "nurss", translation: "nose"},
      {id: "nl-pronunciation-leuk", word: "leuk", said: "lurk", translation: "nice, fun"},
      {id: "nl-pronunciation-keuken", word: "keuken", said: "KUR kuhn", translation: "kitchen"},
      {id: "nl-pronunciation-reus", word: "reus", said: "rurss", translation: "giant"},
    ],
  },
  {
    rule: "oe",
    explanation: 'oe is the "oo" of "moon", never the "oh" of "toe".',
    words: [
      {id: "nl-pronunciation-goed", word: "goed", said: "khoot", translation: "good"},
      {id: "nl-pronunciation-boek", word: "boek", said: "book", translation: "book"},
      {id: "nl-pronunciation-voet", word: "voet", said: "voot", translation: "foot"},
      {id: "nl-pronunciation-stoel", word: "stoel", said: "stool", translation: "chair"},
      {id: "nl-pronunciation-hoe", word: "hoe", said: "hoo", translation: "how"},
      {id: "nl-pronunciation-doen", word: "doen", said: "doon", translation: "to do"},
      {id: "nl-pronunciation-moeder", word: "moeder", said: "MOO dur", translation: "mother"},
      {id: "nl-pronunciation-zoeken", word: "zoeken", said: "ZOO kuhn", translation: "to look for"},
    ],
  },
  {
    rule: "g and ch",
    explanation:
      'g and ch are both the throaty sound of "loch" in Scottish English, made with the back of the tongue. It is never the English "g", and the sound is written kh here.',
    words: [
      {id: "nl-pronunciation-gaan", word: "gaan", said: "khahn", translation: "to go"},
      {id: "nl-pronunciation-nacht", word: "nacht", said: "nakht", translation: "night"},
      {id: "nl-pronunciation-acht", word: "acht", said: "akht", translation: "eight"},
      {id: "nl-pronunciation-licht", word: "licht", said: "likht", translation: "light"},
      {id: "nl-pronunciation-lachen", word: "lachen", said: "LAKH uhn", translation: "to laugh"},
      {id: "nl-pronunciation-mogen", word: "mogen", said: "MOH khuhn", translation: "may, to be allowed"},
      {id: "nl-pronunciation-negen", word: "negen", said: "NAY khuhn", translation: "nine"},
    ],
  },
  {
    rule: "sch, sj and tj",
    explanation:
      'sch is s followed by the throaty kh, said quickly. sj is the English "sh". tj is a soft "ch", written "ty" here, and often turns up in small words ending in -tje.',
    words: [
      {id: "nl-pronunciation-school", word: "school", said: "skhohl", translation: "school"},
      {id: "nl-pronunciation-schip", word: "schip", said: "skhip", translation: "ship"},
      {id: "nl-pronunciation-schrijven", word: "schrijven", said: "SKHRY vuhn", translation: "to write"},
      {id: "nl-pronunciation-sjaal", word: "sjaal", said: "shahl", translation: "scarf"},
      {id: "nl-pronunciation-sjouwen", word: "sjouwen", said: "SHOW uhn", translation: "to lug"},
      {id: "nl-pronunciation-katje", word: "katje", said: "KAT yuh", translation: "kitten"},
    ],
  },
  {
    rule: "ng and nk",
    explanation:
      'ng is one sound as in "sing", never with a hard g after it. nk is that sound followed by k, as in "bank".',
    words: [
      {id: "nl-pronunciation-lang", word: "lang", said: "lang", translation: "long"},
      {id: "nl-pronunciation-ding", word: "ding", said: "ding", translation: "thing"},
      {id: "nl-pronunciation-bank", word: "bank", said: "bank", translation: "bank, sofa"},
      {id: "nl-pronunciation-denken", word: "denken", said: "DEN kuhn", translation: "to think"},
      {id: "nl-pronunciation-drinken", word: "drinken", said: "DRIN kuhn", translation: "to drink"},
    ],
  },
  {
    rule: "w and v",
    explanation:
      "Dutch w is softer than the English w, close to a v made with the lips only slightly touching. Dutch v is close to f, but voiced a little more.",
    words: [
      {id: "nl-pronunciation-water", word: "water", said: "VAH tur", translation: "water"},
      {id: "nl-pronunciation-wat", word: "wat", said: "vat", translation: "what"},
      {id: "nl-pronunciation-wie", word: "wie", said: "vee", translation: "who"},
      {id: "nl-pronunciation-werk", word: "werk", said: "verk", translation: "work"},
      {id: "nl-pronunciation-vader", word: "vader", said: "FAH dur", translation: "father"},
      {id: "nl-pronunciation-vis", word: "vis", said: "fiss", translation: "fish"},
    ],
  },
  {
    rule: "Final d and b",
    explanation:
      'A d at the end of a word is said t, and a b at the end is said p, although both go back to their usual sound when something is added: hond is said "hont", but honden "HON duhn".',
    words: [
      {id: "nl-pronunciation-hond", word: "hond", said: "hont", translation: "dog"},
      {id: "nl-pronunciation-brood", word: "brood", said: "broht", translation: "bread"},
      {id: "nl-pronunciation-rood", word: "rood", said: "roht", translation: "red"},
      {id: "nl-pronunciation-hard", word: "hard", said: "hart", translation: "hard, loud"},
      {id: "nl-pronunciation-web", word: "web", said: "vep", translation: "web"},
      {id: "nl-pronunciation-honden", word: "honden", said: "HON duhn", translation: "dogs"},
    ],
  },
  {
    rule: "The unstressed e",
    explanation:
      'An e in a syllable without stress is a weak "uh", like the last sound of "sofa". It is how de, een, het and the endings -en and -e are said. The prefixes ge- and be- are weak too.',
    words: [
      {id: "nl-pronunciation-de", word: "de", said: "duh", translation: "the"},
      {id: "nl-pronunciation-een", word: "een", said: "uhn", translation: "a, an"},
      {id: "nl-pronunciation-het", word: "het", said: "uht", translation: "the, it"},
      {id: "nl-pronunciation-mensen", word: "mensen", said: "MEN suhn", translation: "people"},
      {id: "nl-pronunciation-gedaan", word: "gedaan", said: "khuh DAHN", translation: "done"},
      {id: "nl-pronunciation-bedankt", word: "bedankt", said: "buh DANKT", translation: "thanks"},
    ],
  },
  {
    rule: "Endings and prefixes",
    explanation:
      '-tie is said "tsee", -ig is a weak "ukh", and -lijk is a weak "luhk", all without stress. ver- is said "vur".',
    words: [
      {id: "nl-pronunciation-politie", word: "politie", said: "poh LEE tsee", translation: "police"},
      {id: "nl-pronunciation-informatie", word: "informatie", said: "in for MAH tsee", translation: "information"},
      {id: "nl-pronunciation-gezellig", word: "gezellig", said: "khuh ZEL ukh", translation: "cosy, pleasant"},
      {id: "nl-pronunciation-vriendelijk", word: "vriendelijk", said: "VREEN duh luhk", translation: "friendly"},
      {id: "nl-pronunciation-natuurlijk", word: "natuurlijk", said: "nah TEWR luhk", translation: "of course"},
      {id: "nl-pronunciation-verjaardag", word: "verjaardag", said: "vur YAHR dakh", translation: "birthday"},
    ],
  },
];
