import type {SoundsAlikePair} from "@flashcards/content/korean/sounds-alike/types/SoundsAlikePair";

/**
 * Pairs of Korean words a learner hears as one. Ours: chosen and glossed by hand, with the sound that separates them named as
 * in the standard pronunciation rules. Plain, tense and aspirated are the three-way split English has no equivalent for.
 */
export const SOUNDS_ALIKE_PAIRS: readonly SoundsAlikePair[] = [
  {
    id: "bareuda-ppareuda",
    first: {word: "바르다", romanisation: "bareuda"},
    second: {word: "빠르다", romanisation: "ppareuda"},
    explanation:
      "바르다 is to spread on (cream, paint) and 빠르다 is to be fast. ㅂ is plain, said softly with little breath; ㅃ is tense, said with the throat tight and no puff of air.",
  },
  {
    id: "mul-bul",
    first: {word: "물", romanisation: "mul"},
    second: {word: "불", romanisation: "bul"},
    explanation:
      "물 is water and 불 is fire. ㅁ is said through the nose with the lips closed; ㅂ is the same lip shape with the nose closed off.",
  },
  {
    id: "bal-pal",
    first: {word: "발", romanisation: "bal"},
    second: {word: "팔", romanisation: "pal"},
    explanation:
      "발 is the foot and 팔 is the arm. ㅂ is plain; ㅍ is aspirated, with a clear puff of air as the lips open. Hold a hand in front of your mouth: you feel it for 팔.",
  },
  {
    id: "dal-ttal",
    first: {word: "달", romanisation: "dal"},
    second: {word: "딸", romanisation: "ttal"},
    explanation:
      "달 is the moon and 딸 is a daughter. ㄷ is plain; ㄸ is tense, with the throat tight, no puff of air and a higher start to the vowel.",
  },
  {
    id: "dal-tal",
    first: {word: "달", romanisation: "dal"},
    second: {word: "탈", romanisation: "tal"},
    explanation:
      "달 is the moon and 탈 is a mask. ㄷ is plain; ㅌ is aspirated, with a puff of air as the tongue lets go.",
  },
  {
    id: "sada-ssada",
    first: {word: "사다", romanisation: "sada"},
    second: {word: "싸다", romanisation: "ssada"},
    explanation:
      "사다 is to buy and 싸다 is to be cheap. ㅅ is soft and a little breathy; ㅆ is tense, a longer, sharper hiss.",
  },
  {
    id: "jada-chada",
    first: {word: "자다", romanisation: "jada"},
    second: {word: "차다", romanisation: "chada"},
    explanation:
      "자다 is to sleep and 차다 is to kick. ㅈ is plain; ㅊ is aspirated, with a puff of air after the first sound.",
  },
  {
    id: "bang-ppang",
    first: {word: "방", romanisation: "bang"},
    second: {word: "빵", romanisation: "ppang"},
    explanation:
      "방 is a room and 빵 is bread. ㅂ is plain; ㅃ is tense, said with the throat tight and no puff of air.",
  },
  {
    id: "sal-ssal",
    first: {word: "살", romanisation: "sal"},
    second: {word: "쌀", romanisation: "ssal"},
    explanation:
      "살 is flesh (or years of age) and 쌀 is uncooked rice. ㅅ is soft and a little breathy; ㅆ is tense, a longer, sharper hiss.",
  },
  {
    id: "gul-kkul",
    first: {word: "굴", romanisation: "gul"},
    second: {word: "꿀", romanisation: "kkul"},
    explanation:
      "굴 is an oyster and 꿀 is honey. ㄱ is plain; ㄲ is tense, said from a tight throat with no puff of air.",
  },
  {
    id: "bada-pada",
    first: {word: "바다", romanisation: "bada"},
    second: {word: "파다", romanisation: "pada"},
    explanation:
      "바다 is the sea and 파다 is to dig. ㅂ is plain; ㅍ is aspirated, with a puff of air as the lips open.",
  },
  {
    id: "bul-ppul",
    first: {word: "불", romanisation: "bul"},
    second: {word: "뿔", romanisation: "ppul"},
    explanation:
      "불 is fire and 뿔 is a horn. ㅂ is plain; ㅃ is tense, said with the throat tight and no puff of air.",
  },
  {
    id: "nun-non",
    first: {word: "눈", romanisation: "nun"},
    second: {word: "논", romanisation: "non"},
    explanation:
      "눈 is an eye (or snow) and 논 is a rice paddy. The vowels differ: ㅜ is like the oo in moon, ㅗ is like the o in so, and the jaw is a little more open for ㅗ.",
  },
];
