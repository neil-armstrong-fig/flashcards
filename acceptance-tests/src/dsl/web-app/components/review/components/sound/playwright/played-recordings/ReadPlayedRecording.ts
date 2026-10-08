import {SPEEDS} from "@flashcards/shared/audio/Speed";
import {LANGUAGES} from "@flashcards/shared/language/Language";
import {VOICES} from "@flashcards/shared/audio/Voice";
import type {PlayedEntry} from "@src/dsl/web-app/types/PlayedEntry";
import type {PlayedRecording} from "@src/dsl/web-app/components/review/components/sound/types/PlayedRecording";
import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";
import type {Speed} from "@flashcards/shared/audio/Speed";
import type {Voice} from "@flashcards/shared/audio/Voice";

const SPOKEN_LANGUAGES: readonly SpokenLanguage[] = [...LANGUAGES, "en", "music"];

const RECORDING_PATH = /audio\/(?<file>(?<language>[a-z]+)\/(?<voice>[a-z]+)-(?<speed>[a-z]+)\/[^/]+\.mp3)$/;

/** Reads a recording's voice and speed from the path the app played, which is how the files are laid out. */
export function readPlayedRecording(entry: PlayedEntry): PlayedRecording {
  const groups = RECORDING_PATH.exec(entry.src)?.groups;
  const file = groups?.["file"];
  const language = readOneOf(groups?.["language"], SPOKEN_LANGUAGES);
  const voice = readOneOf(groups?.["voice"], VOICES);
  const speed = readOneOf(groups?.["speed"], SPEEDS);

  if (file === undefined || language === undefined || voice === undefined || speed === undefined) {
    throw new Error(
      `The app played "${entry.src}", which is not a recording path (audio/<language>/<voice>-<speed>/<name>.mp3)`,
    );
  }

  return {language, file, voice, speed, found: entry.found === true};
}

function readOneOf<Item extends Voice | Speed | SpokenLanguage>(
  value: unknown,
  items: readonly Item[],
): Item | undefined {
  return items.find(item => item === value);
}
