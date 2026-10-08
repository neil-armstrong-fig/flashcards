import type {PronunciationGroup} from "@flashcards/content/korean/pronunciation/types/PronunciationGroup";

/**
 * The sound changes of Korean, each with words that show it, in the order they are taught. The words and the explanations are our
 * own; the rules and the pronunciations follow the standard pronunciation rules (표준 발음법, National Institute of Korean Language),
 * checked against `koroman` in the test. The rows deserve a check by a Korean reader.
 */
export const PRONUNCIATION_GROUPS: readonly PronunciationGroup[] = [
  {
    rule: "Aspiration",
    explanation:
      "ㅎ next to ㄱ, ㄷ, ㅂ or ㅈ blends with it into the breathy ㅋ, ㅌ, ㅍ or ㅊ, whichever side the ㅎ is on.",
    words: [
      {id: "ko-pronunciation-jota", word: "좋다", said: "조타", romanisation: "jota"},
      {id: "ko-pronunciation-noko", word: "놓고", said: "노코", romanisation: "noko"},
      {id: "ko-pronunciation-eotteoke", word: "어떻게", said: "어떠케", romanisation: "eotteoke"},
      {id: "ko-pronunciation-geureochi", word: "그렇지", said: "그러치", romanisation: "geureochi"},
      {id: "ko-pronunciation-ipak", word: "입학", said: "이팍", romanisation: "ipak"},
      {id: "ko-pronunciation-chuka", word: "축하", said: "추카", romanisation: "chuka"},
      {id: "ko-pronunciation-manta", word: "많다", said: "만타", romanisation: "manta"},
      {id: "ko-pronunciation-nata", word: "낳다", said: "나타", romanisation: "nata"},
    ],
  },
  {
    rule: "Liaison",
    explanation:
      "A final consonant followed by a vowel moves across to start the next syllable. The ㅇ that starts that syllable is silent.",
    words: [
      {id: "ko-pronunciation-eumak", word: "음악", said: "으막", romanisation: "eumak"},
      {id: "ko-pronunciation-hangugeo", word: "한국어", said: "한구거", romanisation: "hangugeo"},
      {id: "ko-pronunciation-ilgeoyo", word: "읽어요", said: "일거요", romanisation: "ilgeoyo"},
      {id: "ko-pronunciation-meogeoyo", word: "먹어요", said: "머거요", romanisation: "meogeoyo"},
      {id: "ko-pronunciation-kkochi", word: "꽃이", said: "꼬치", romanisation: "kkochi"},
      {id: "ko-pronunciation-anjayo", word: "앉아요", said: "안자요", romanisation: "anjayo"},
      {id: "ko-pronunciation-osi", word: "옷이", said: "오시", romanisation: "osi"},
      {id: "ko-pronunciation-sibo", word: "십오", said: "시보", romanisation: "sibo"},
    ],
  },
  {
    rule: "Nasalisation",
    explanation: "Before ㄴ or ㅁ, a final that sounds like ㄱ, ㄷ or ㅂ becomes ㅇ, ㄴ or ㅁ.",
    words: [
      {id: "ko-pronunciation-hangungmal", word: "한국말", said: "한궁말", romanisation: "hangungmal"},
      {id: "ko-pronunciation-hamnida", word: "합니다", said: "함니다", romanisation: "hamnida"},
      {id: "ko-pronunciation-meongneun", word: "먹는", said: "멍는", romanisation: "meongneun"},
      {id: "ko-pronunciation-simman", word: "십만", said: "심만", romanisation: "simman"},
      {id: "ko-pronunciation-jangnyeon", word: "작년", said: "장년", romanisation: "jangnyeon"},
      {id: "ko-pronunciation-danneun", word: "닫는", said: "단는", romanisation: "danneun"},
      {id: "ko-pronunciation-ammun", word: "앞문", said: "암문", romanisation: "ammun"},
      {id: "ko-pronunciation-binmul", word: "빗물", said: "빈물", romanisation: "binmul"},
    ],
  },
  {
    rule: "ㄴ and ㄹ",
    explanation: "ㄴ beside ㄹ becomes ㄹ, so 신라 is said 실라.",
    words: [
      {id: "ko-pronunciation-silla", word: "신라", said: "실라", romanisation: "silla"},
      {id: "ko-pronunciation-pyeolli", word: "편리", said: "펼리", romanisation: "pyeolli"},
      {id: "ko-pronunciation-yeollak", word: "연락", said: "열락", romanisation: "yeollak"},
      {id: "ko-pronunciation-seollal", word: "설날", said: "설랄", romanisation: "seollal"},
      {id: "ko-pronunciation-kallal", word: "칼날", said: "칼랄", romanisation: "kallal"},
      {id: "ko-pronunciation-sillae", word: "실내", said: "실래", romanisation: "sillae"},
    ],
  },
  {
    rule: "ㄹ after other finals",
    explanation: "After any final except ㄹ, a ㄹ is said as ㄴ, and a final ㄱ or ㅂ before it becomes ㅇ or ㅁ.",
    words: [
      {id: "ko-pronunciation-jongno", word: "종로", said: "종노", romanisation: "jongno"},
      {id: "ko-pronunciation-simni", word: "심리", said: "심니", romanisation: "simni"},
      {id: "ko-pronunciation-jeongni", word: "정리", said: "정니", romanisation: "jeongni"},
      {id: "ko-pronunciation-chimnyak", word: "침략", said: "침냑", romanisation: "chimnyak"},
      {id: "ko-pronunciation-hyeomnyeok", word: "협력", said: "혐녁", romanisation: "hyeomnyeok"},
      {id: "ko-pronunciation-daetongnyeong", word: "대통령", said: "대통녕", romanisation: "daetongnyeong"},
    ],
  },
  {
    rule: "Tensing",
    explanation:
      "After a final that sounds like ㄱ, ㄷ or ㅂ, the next ㄱ, ㄷ, ㅂ, ㅅ or ㅈ is said tense (ㄲ, ㄸ, ㅃ, ㅆ, ㅉ). So is the ending after a verb stem ending in ㄴ or ㅁ (신다, 앉다). The spelling does not show it.",
    words: [
      {id: "ko-pronunciation-hakgyo", word: "학교", said: "학꾜", romanisation: "hakgyo"},
      {id: "ko-pronunciation-meokda", word: "먹다", said: "먹따", romanisation: "meokda"},
      {id: "ko-pronunciation-gukbap", word: "국밥", said: "국빱", romanisation: "gukbap"},
      {id: "ko-pronunciation-bapsang", word: "밥상", said: "밥쌍", romanisation: "bapsang"},
      {id: "ko-pronunciation-itda", word: "있다", said: "읻따", romanisation: "itda"},
      {id: "ko-pronunciation-gapjagi", word: "갑자기", said: "갑짜기", romanisation: "gapjagi"},
      {id: "ko-pronunciation-apgil", word: "앞길", said: "압낄", romanisation: "apgil"},
      {id: "ko-pronunciation-mitda", word: "믿다", said: "믿따", romanisation: "mitda"},
      {id: "ko-pronunciation-haksaeng", word: "학생", said: "학쌩", romanisation: "haksaeng"},
      {id: "ko-pronunciation-deutgo", word: "듣고", said: "듣꼬", romanisation: "deutgo"},
      {id: "ko-pronunciation-japda", word: "잡다", said: "잡따", romanisation: "japda"},
      {id: "ko-pronunciation-anda", word: "앉다", said: "안따", romanisation: "anda"},
      {id: "ko-pronunciation-sinda", word: "신다", said: "신따", romanisation: "sinda"},
    ],
  },
  {
    rule: "Palatalisation",
    explanation: "A final ㄷ or ㅌ followed by 이 is said ㅈ or ㅊ, so 같이 is said 가치.",
    words: [
      {id: "ko-pronunciation-gachi", word: "같이", said: "가치", romanisation: "gachi"},
      {id: "ko-pronunciation-guji", word: "굳이", said: "구지", romanisation: "guji"},
      {id: "ko-pronunciation-haedoji", word: "해돋이", said: "해도지", romanisation: "haedoji"},
      {id: "ko-pronunciation-maji", word: "맏이", said: "마지", romanisation: "maji"},
      {id: "ko-pronunciation-buchida", word: "붙이다", said: "부치다", romanisation: "buchida"},
      {id: "ko-pronunciation-kkeuchi", word: "끝이", said: "끄치", romanisation: "kkeuchi"},
    ],
  },
  {
    rule: "Weak ㅎ",
    explanation: "ㅎ is silent or nearly so after a vowel, ㄴ, ㄹ, ㅁ or ㅇ, and a final ㅎ vanishes before a vowel.",
    words: [
      {id: "ko-pronunciation-joayo", word: "좋아요", said: "조아요", romanisation: "joayo"},
      {id: "ko-pronunciation-gwaenchanayo", word: "괜찮아요", said: "괜차나요", romanisation: "gwaenchanayo"},
      {id: "ko-pronunciation-sireoyo", word: "싫어요", said: "시러요", romanisation: "sireoyo"},
      {id: "ko-pronunciation-manayo", word: "많아요", said: "마나요", romanisation: "manayo"},
    ],
  },
  {
    rule: "Final sounds",
    explanation:
      "At the end of a word, or before a consonant, a final is one of seven sounds: ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ or ㅇ. ㅋ and ㄲ say ㄱ; ㅅ, ㅆ, ㅈ, ㅊ, ㅌ and ㅎ say ㄷ; ㅍ says ㅂ.",
    words: [
      {id: "ko-pronunciation-bueok", word: "부엌", said: "부억", romanisation: "bueok"},
      {id: "ko-pronunciation-kkot", word: "꽃", said: "꼳", romanisation: "kkot"},
      {id: "ko-pronunciation-ot", word: "옷", said: "옫", romanisation: "ot"},
      {id: "ko-pronunciation-bak", word: "밖", said: "박", romanisation: "bak"},
      {id: "ko-pronunciation-nat", word: "낮", said: "낟", romanisation: "nat"},
      {id: "ko-pronunciation-ap", word: "앞", said: "압", romanisation: "ap"},
      {id: "ko-pronunciation-sup", word: "숲", said: "숩", romanisation: "sup"},
      {id: "ko-pronunciation-bit", word: "빛", said: "빋", romanisation: "bit"},
    ],
  },
  {
    rule: "Two finals",
    explanation:
      "Only one of two final consonants is said: usually the first (넓다 is 널따, 값 is 갑), but ㄺ, ㄻ and ㄿ keep the second (닭 is 닥, 삶 is 삼).",
    words: [
      {id: "ko-pronunciation-gap", word: "값", said: "갑", romanisation: "gap"},
      {id: "ko-pronunciation-eopda", word: "없다", said: "업따", romanisation: "eopda"},
      {id: "ko-pronunciation-ikda", word: "읽다", said: "익따", romanisation: "ikda"},
      {id: "ko-pronunciation-dak", word: "닭", said: "닥", romanisation: "dak"},
      {id: "ko-pronunciation-sam", word: "삶", said: "삼", romanisation: "sam"},
      {id: "ko-pronunciation-neolda", word: "넓다", said: "널따", romanisation: "neolda"},
      {id: "ko-pronunciation-yeodeol", word: "여덟", said: "여덜", romanisation: "yeodeol"},
    ],
  },
  {
    rule: "Added ㄴ",
    explanation:
      "In a compound, or after a prefix, an ㄴ is added when the first part ends in a consonant and the next begins with 이, 야, 여, 요 or 유 (한여름 is said 한녀름). It then spreads as above.",
    words: [
      {id: "ko-pronunciation-hannyeoreum", word: "한여름", said: "한녀름", romanisation: "hannyeoreum"},
      {id: "ko-pronunciation-maennip", word: "맨입", said: "맨닙", romanisation: "maennip"},
      {id: "ko-pronunciation-somnibul", word: "솜이불", said: "솜니불", romanisation: "somnibul"},
      {id: "ko-pronunciation-damnyo", word: "담요", said: "담뇨", romanisation: "damnyo"},
      {id: "ko-pronunciation-nunnyogi", word: "눈요기", said: "눈뇨기", romanisation: "nunnyogi"},
      {id: "ko-pronunciation-saengnyeonpil", word: "색연필", said: "생년필", romanisation: "saengnyeonpil"},
      {id: "ko-pronunciation-yeongeomnyong", word: "영업용", said: "영엄뇽", romanisation: "yeongeomnyong"},
      {id: "ko-pronunciation-kkonnip", word: "꽃잎", said: "꼰닙", romanisation: "kkonnip"},
      {id: "ko-pronunciation-seoullyeok", word: "서울역", said: "서울력", romanisation: "seoullyeok"},
      {id: "ko-pronunciation-hwiballyu", word: "휘발유", said: "휘발류", romanisation: "hwiballyu"},
    ],
  },
];
