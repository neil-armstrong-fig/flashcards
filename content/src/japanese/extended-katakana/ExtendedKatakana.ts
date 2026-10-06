/** A katakana made last century for a sound of foreign words that Japanese kana did not cover, with why it exists. They have no hiragana. */
interface ExtendedKatakana {
  readonly romaji: string;
  readonly katakana: string;
  readonly explanation: string;
}

/**
 * The 23 extended katakana: a full-size kana and a small vowel (ァ ィ ゥ ェ ォ), read as one syllable. They turn up only in
 * loanwords and names, so they come after everything else and each says why it is there. ゐ, ゑ, ヰ and ヱ are left out: they
 * left the language in 1946 and `ウィ` and `ウェ` now do their work. Sources in `REFERENCES.md`.
 */
export const EXTENDED_KATAKANA: readonly ExtendedKatakana[] = [
  {
    romaji: "fa",
    katakana: "ファ",
    explanation:
      "Written for foreign words: Japanese has only fu, so a small vowel is added to give the f of fa, fi, fe and fo. Seen in ファン (fan).",
  },
  {
    romaji: "fi",
    katakana: "フィ",
    explanation:
      "Written for foreign words: Japanese has only fu, so a small vowel is added to give the f of fa, fi, fe and fo. Seen in フィルム (film).",
  },
  {
    romaji: "fe",
    katakana: "フェ",
    explanation:
      "Written for foreign words: Japanese has only fu, so a small vowel is added to give the f of fa, fi, fe and fo. Seen in カフェ (café).",
  },
  {
    romaji: "fo",
    katakana: "フォ",
    explanation:
      "Written for foreign words: Japanese has only fu, so a small vowel is added to give the f of fa, fi, fe and fo. Seen in フォーク (fork).",
  },
  {
    romaji: "vu",
    katakana: "ヴ",
    explanation:
      "Written for the v of foreign words, which Japanese lacks: ヴ is ウ with dakuten, and many speakers say it as b. Seen in ヴァ, ヴィ, ヴェ and ヴォ, since it rarely stands alone.",
  },
  {
    romaji: "va",
    katakana: "ヴァ",
    explanation:
      "Written for the v of foreign words, which Japanese lacks: ヴ is ウ with dakuten, and many speakers say it as b. Seen in ヴァイオリン (violin), often written バイオリン.",
  },
  {
    romaji: "vi",
    katakana: "ヴィ",
    explanation:
      "Written for the v of foreign words, which Japanese lacks: ヴ is ウ with dakuten, and many speakers say it as b. Seen in ヴィーナス (Venus).",
  },
  {
    romaji: "ve",
    katakana: "ヴェ",
    explanation:
      "Written for the v of foreign words, which Japanese lacks: ヴ is ウ with dakuten, and many speakers say it as b. Seen in ヴェール (veil).",
  },
  {
    romaji: "vo",
    katakana: "ヴォ",
    explanation:
      "Written for the v of foreign words, which Japanese lacks: ヴ is ウ with dakuten, and many speakers say it as b. Seen in ヴォーカル (vocal), often written ボーカル.",
  },
  {
    romaji: "wi",
    katakana: "ウィ",
    explanation:
      "Written for foreign words with w before i, e or o, which Japanese kept only before a. Said with a quick oo glide at the start. Seen in ウィキペディア (Wikipedia).",
  },
  {
    romaji: "we",
    katakana: "ウェ",
    explanation:
      "Written for foreign words with w before i, e or o, which Japanese kept only before a. Said with a quick oo glide at the start. Seen in ウェブ (web).",
  },
  {
    romaji: "uo",
    katakana: "ウォ",
    explanation:
      "Written for foreign words with w before i, e or o, which Japanese kept only before a. Said with a quick oo glide at the start. Its sound is wo, spelt uo here so it is not mistaken for ヲ Seen in ウォーター (water).",
  },
  {
    romaji: "ti",
    katakana: "ティ",
    explanation:
      "Written for foreign sounds Japanese spells with a different kana: a small vowel shifts the vowel of a kana from the t or d row. Seen in パーティー (party).",
  },
  {
    romaji: "di",
    katakana: "ディ",
    explanation:
      "Written for foreign sounds Japanese spells with a different kana: a small vowel shifts the vowel of a kana from the t or d row. Seen in ディスク (disc).",
  },
  {
    romaji: "tu",
    katakana: "トゥ",
    explanation:
      "Written for foreign sounds Japanese spells with a different kana: a small vowel shifts the vowel of a kana from the t or d row. It is rare Seen in words from English such as トゥルー (true).",
  },
  {
    romaji: "du",
    katakana: "ドゥ",
    explanation:
      "Written for foreign sounds Japanese spells with a different kana: a small vowel shifts the vowel of a kana from the t or d row. It is rare Seen in words from English such as ドゥー (do).",
  },
  {
    romaji: "che",
    katakana: "チェ",
    explanation:
      "Written for sounds foreign words need that older Japanese had no kana for: a small ェ gives the e after a kana from the ch, sh or j row. Seen in チェック (check).",
  },
  {
    romaji: "she",
    katakana: "シェ",
    explanation:
      "Written for sounds foreign words need that older Japanese had no kana for: a small ェ gives the e after a kana from the ch, sh or j row. Seen in シェフ (chef).",
  },
  {
    romaji: "je",
    katakana: "ジェ",
    explanation:
      "Written for sounds foreign words need that older Japanese had no kana for: a small ェ gives the e after a kana from the ch, sh or j row. Seen in ジェット (jet).",
  },
  {
    romaji: "tsa",
    katakana: "ツァ",
    explanation:
      "Written for the ts of names and words from German and Italian, before a vowel other than u. Rare. Seen in モーツァルト (Mozart).",
  },
  {
    romaji: "tse",
    katakana: "ツェ",
    explanation:
      "Written for the ts of names and words from German and Italian, before a vowel other than u. Rare. Seen in ツェッペリン (Zeppelin).",
  },
  {
    romaji: "tso",
    katakana: "ツォ",
    explanation:
      "Written for the ts of names and words from German and Italian, before a vowel other than u. Rare. Seen in カンツォーネ (canzone).",
  },
  {
    romaji: "ye",
    katakana: "イェ",
    explanation:
      "Written for the ye of foreign words, which modern Japanese lacks (it has ya, yu and yo). Rare. Seen in a few names and loanwords.",
  },
];
