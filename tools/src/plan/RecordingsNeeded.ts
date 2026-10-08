import {AZURE_VOICES} from "@flashcards/shared/audio/azure/AzureVoices";
import {meaningIsSpoken} from "@flashcards/content/cards/MeaningIsSpoken";
import {ENGLISH_VARIANT, SINGLE_VARIANT} from "@flashcards/content/audio/RecordingVariantFor";
import {ENGLISH_VOICE} from "@flashcards/shared/audio/azure/EnglishVoice";
import {recordingFileOf} from "@src/naming/RecordingFileOf";
import {recordingVariantOf} from "@flashcards/shared/audio/RecordingVariantOf";
import {SPEED_RATES} from "@flashcards/shared/audio/azure/SpeedRates";
import {SPEEDS} from "@flashcards/shared/audio/Speed";
import {VOICES} from "@flashcards/shared/audio/Voice";
import type {Language} from "@flashcards/shared/language/Language";
import type {Deck} from "@flashcards/content/types/Deck";
import type {RecordingJob} from "@src/plan/types/RecordingJob";

const TONE = "tone";

/** Every recording the decks need: each word (or kana) and similar, once, in every voice at every speed, each English meaning in the one English voice, and each note of music as one tone (named `tone` where a spoken recording names its voice). The sound of a kana and the way a pronunciation is said are not spoken, so they need none. */
export function recordingsNeeded(decks: readonly Deck[]): RecordingJob[] {
  const jobs = new Map<string, RecordingJob>();

  for (const deck of decks) {
    for (const note of deck.notes) {
      if (note.language === "music") {
        const tone = toneJobOf(note.word);

        jobs.set(tone.file, tone);
        continue;
      }

      for (const text of [note.word, ...(note.soundSimilars ?? [])]) {
        for (const job of targetJobsOf(note.language, text)) {
          jobs.set(job.file, job);
        }
      }

      if (!meaningIsSpoken(note)) {
        continue;
      }

      const english = englishJobOf(note.meaning);

      jobs.set(english.file, english);
    }
  }

  return [...jobs.values()];
}

function targetJobsOf(language: Language, text: string): RecordingJob[] {
  const jobs: RecordingJob[] = [];

  for (const voice of VOICES) {
    for (const speed of SPEEDS) {
      const {name: voiceName, locale} = AZURE_VOICES[language][voice];
      const variant = recordingVariantOf(voice, speed);
      const rate = SPEED_RATES[speed];
      const file = recordingFileOf({language, variant, text, voiceName, rate});

      jobs.push({language, text, variant, voiceName, locale, rate, file});
    }
  }

  return jobs;
}

function toneJobOf(pitch: string): RecordingJob {
  const file = recordingFileOf({
    language: "music",
    variant: SINGLE_VARIANT,
    text: pitch,
    voiceName: TONE,
    rate: "default",
  });

  return {language: "music", text: pitch, variant: SINGLE_VARIANT, voiceName: TONE, locale: "", rate: "default", file};
}

function englishJobOf(text: string): RecordingJob {
  const {name: voiceName, locale} = ENGLISH_VOICE;
  const rate = SPEED_RATES.normal;
  const file = recordingFileOf({language: "en", variant: ENGLISH_VARIANT, text, voiceName, rate});

  return {language: "en", text, variant: ENGLISH_VARIANT, voiceName, locale, rate, file};
}
