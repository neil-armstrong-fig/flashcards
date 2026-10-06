/**
 * Sounds a learner takes for one another when they hear them, in groups of romaji (as a kana's sound is given in `Kana`):
 * each kana is heard beside the others in its groups. Voiced and plain pairs (か and が, は and ば and ぱ) are the main cause;
 * then sounds that are written differently and said the same (じ and ぢ, ず and づ, お and を); then sounds an English ear
 * blurs (し and ち, つ and す).
 */
export const SOUND_SIMILAR_GROUPS: readonly (readonly string[])[] = [
  ["ka", "ga"],
  ["ki", "gi"],
  ["ku", "gu"],
  ["ke", "ge"],
  ["ko", "go"],
  ["sa", "za"],
  ["shi", "ji"],
  ["su", "zu"],
  ["se", "ze"],
  ["so", "zo"],
  ["ta", "da"],
  ["chi", "dji"],
  ["tsu", "dzu"],
  ["te", "de"],
  ["to", "do"],
  ["ha", "ba", "pa"],
  ["hi", "bi", "pi"],
  ["fu", "bu", "pu"],
  ["he", "be", "pe"],
  ["ho", "bo", "po"],
  ["kya", "gya"],
  ["kyu", "gyu"],
  ["kyo", "gyo"],
  ["sha", "ja"],
  ["shu", "ju"],
  ["sho", "jo"],
  ["hya", "bya", "pya"],
  ["hyu", "byu", "pyu"],
  ["hyo", "byo", "pyo"],
  ["ji", "dji"],
  ["zu", "dzu"],
  ["o", "wo"],
  ["shi", "chi"],
  ["tsu", "su"],
];
