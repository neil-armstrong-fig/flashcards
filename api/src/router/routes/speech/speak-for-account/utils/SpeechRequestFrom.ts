import {englishMeaningFrom} from "@language-learning/shared/language/EnglishText";
import {koreanWordFrom} from "@language-learning/shared/language/KoreanText";
import {SPEEDS} from "@language-learning/shared/audio/Speed";
import {VOICES} from "@language-learning/shared/audio/Voice";
import type {SpeechRequest} from "@src/speech/types/SpeechRequest";

/** A request body that has been checked, or `undefined` for anything else. Nothing in it is trusted until it is. */
export function speechRequestFrom(body: unknown): SpeechRequest | undefined {
  if (typeof body !== "object" || body === null) {
    return undefined;
  }

  const {language, text} = body as Record<string, unknown>;

  if (typeof text !== "string") {
    return undefined;
  }

  if (language === "en") {
    return englishRequestFrom(text);
  }

  if (language === "ko") {
    return koreanRequestFrom(text, body as Record<string, unknown>);
  }

  return undefined;
}

function englishRequestFrom(text: string): SpeechRequest | undefined {
  const meaning = englishMeaningFrom(text);

  if (meaning === undefined) {
    return undefined;
  }

  return {language: "en", text: meaning, voice: "female", speed: "normal"};
}

function koreanRequestFrom(text: string, {voice, speed}: Record<string, unknown>): SpeechRequest | undefined {
  const chosenVoice = VOICES.find(item => item === voice);
  const chosenSpeed = SPEEDS.find(item => item === speed);
  const word = koreanWordFrom(text);

  if (chosenVoice === undefined || chosenSpeed === undefined || word === undefined) {
    return undefined;
  }

  return {language: "ko", text: word, voice: chosenVoice, speed: chosenSpeed};
}
