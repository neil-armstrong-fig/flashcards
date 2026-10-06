import type {AudioManifest} from "@flashcards/content/audio/types/AudioManifest";

/** Recordings for the first two words of the starter deck (물, 밥), and 불 which sounds like 물, in every voice and speed, and their English, so a test does not depend on what has been generated. */
export const TEST_AUDIO_RECORDINGS: AudioManifest = {
  ko: {
    물: {
      "female-normal": "ko/female-normal/water.mp3",
      "female-slower": "ko/female-slower/water.mp3",
      "male-normal": "ko/male-normal/water.mp3",
      "male-slower": "ko/male-slower/water.mp3",
    },
    불: {
      "female-normal": "ko/female-normal/fire.mp3",
      "female-slower": "ko/female-slower/fire.mp3",
      "male-normal": "ko/male-normal/fire.mp3",
      "male-slower": "ko/male-slower/fire.mp3",
    },
    밥: {
      "female-normal": "ko/female-normal/rice.mp3",
      "female-slower": "ko/female-slower/rice.mp3",
      "male-normal": "ko/male-normal/rice.mp3",
      "male-slower": "ko/male-slower/rice.mp3",
    },
  },
  en: {
    water: {"female-normal": "en/female-normal/water.mp3"},
    "rice, a meal": {"female-normal": "en/female-normal/rice.mp3"},
  },
};
