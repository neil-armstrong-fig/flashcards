import {romanisationOf} from "@language-learning/shared/language/RomanisationOf";

// Revised Romanization writes how a word is pronounced, not how it is spelt. Each row is a rule that a letter-for-letter
// transliteration gets wrong, so a change of version of the library that quietly drops one fails here.
it.each([
  ["학교", "hakgyo", "a final k before g"],
  ["한국", "hanguk", "a final g at the end"],
  ["같이", "gachi", "palatalisation of t before i"],
  ["좋아요", "joayo", "a silent h between vowels"],
  ["좋은", "joeun", "a silent h before a vowel"],
  ["좋다", "jota", "h and d joining into t"],
  ["신라", "silla", "n before l becoming l"],
  ["설날", "seollal", "n after l becoming l"],
  ["종로", "jongno", "l after ng becoming n"],
  ["독립", "dongnip", "l after a stop becoming n, the stop becoming ng"],
  ["국물", "gungmul", "a stop before m becoming ng"],
  ["합니다", "hamnida", "a stop before n becoming m"],
  ["먹는", "meongneun", "a stop before n becoming ng"],
  ["백마", "baengma", "a stop before m"],
  ["읽다", "ikda", "a double final consonant"],
  ["닭", "dak", "a double final consonant at the end"],
  ["값", "gap", "a double final consonant at the end"],
  ["앉아", "anja", "a double final consonant carried over"],
  ["많이", "mani", "a silent h in a double final"],
  ["꽃이", "kkochi", "a final carried over and palatalised"],
  ["옷이", "osi", "a final carried over"],
  ["있어요", "isseoyo", "a double consonant carried over"],
  ["괜찮아요", "gwaenchanayo", "a silent h in a double final"],
  ["해돋이", "haedoji", "palatalisation of d before i"],
  ["굳이", "guji", "palatalisation of d before i"],
  ["맛있다", "masitda", "a final before a vowel, then a final before d"],
  ["값어치", "gapseochi", "a final carried over a compound's edge, as it is said"],
  ["한국 사람", "hanguk saram", "two words, the space kept"],
  ["십오", "sibo", "a final carried over"],
  ["끝", "kkeut", "a final t at the end"],
  ["꽃", "kkot", "a final t at the end"],
  ["앞", "ap", "a final p at the end"],
  ["먹다", "meokda", "tensing is not written"],
  ["밭벼", "batbyeo", "a final t before b"],
  ["좋습니다", "joseumnida", "a silent h, then a stop before n becoming m"],
  ["한국말", "hangungmal", "a stop before m becoming ng"],
  ["듣는", "deunneun", "a stop before n becoming n"],
  ["법무", "beommu", "a stop before m becoming m"],
  ["실내", "sillae", "n after l becoming l"],
  ["북한", "bukan", "a stop before h becoming aspirated"],
  ["닫히다", "dachida", "t and h joining, then palatalised"],
  ["잡히다", "japida", "p and h joining"],
  ["입학", "ipak", "p and h joining"],
  ["곧이", "goji", "palatalisation of t before i"],
  ["나뭇잎", "namunnip", "n added in a compound, a stop before n becoming n"],
  ["색연필", "saengnyeonpil", "n added in a compound, a stop before n becoming ng"],
  ["꽃잎", "kkonnip", "n added in a compound"],
  ["막내", "mangnae", "a stop before n becoming ng"],
  ["국립", "gungnip", "l after a stop becoming n"],
  ["십리", "simni", "l after p becoming n"],
  ["협력", "hyeomnyeok", "l after m becoming n"],
  ["한라산", "hallasan", "n before l becoming l"],
  ["물약", "mullyak", "n added after l"],
])("writes %s as %s (%s)", (word, expected) => {
  expect(romanisationOf(word)).toBe(expected);
});

it("trims the word", () => {
  expect(romanisationOf(" 물 ")).toBe("mul");
});

it.each([
  ["nothing", ""],
  ["English", "water"],
  ["mixed", "물a"],
  ["markup", "물<b>"],
  ["too long", "가".repeat(13)],
])("has nothing to say for %s", (_name, text) => {
  expect(romanisationOf(text)).toBeUndefined();
});
