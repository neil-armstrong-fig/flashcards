import {AZURE_VOICES} from "@language-learning/shared/audio/azure/AzureVoices";
import type {AzureVoice} from "@language-learning/shared/audio/azure/AzureVoice";
import {ENGLISH_VOICE} from "@language-learning/shared/audio/azure/EnglishVoice";
import {SPEED_RATES} from "@language-learning/shared/audio/azure/SpeedRates";
import {ssmlOf} from "@language-learning/shared/audio/azure/SsmlOf";
import type {SpeechRequest} from "@src/speech/types/SpeechRequest";

interface Azure {
  readonly region: string;
  readonly key: string;
}

const OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";

/** Asks Azure AI Speech to say the Korean in the voice and speed given, or the English in its one voice, and hands back its response unread. */
export async function synthesiseSpeech(
  {region, key}: Azure,
  {language, text, voice, speed}: SpeechRequest,
): Promise<Response> {
  const {name: voiceName, locale} = voiceOf({language, voice});

  return await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": OUTPUT_FORMAT,
      "User-Agent": "flashcards-api",
    },
    body: ssmlOf({text, voiceName, locale, rate: SPEED_RATES[speed]}),
  });
}

function voiceOf({language, voice}: Pick<SpeechRequest, "language" | "voice">): AzureVoice {
  if (language === "en") {
    return ENGLISH_VOICE;
  }

  return AZURE_VOICES[language][voice];
}
