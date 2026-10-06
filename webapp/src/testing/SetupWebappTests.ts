import {afterEach, beforeEach, vi} from "vitest";
import type {KeptNote} from "@src/redux/slices/account/types/KeptNote";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {SpokenLanguage} from "@language-learning/shared/language/SpokenLanguage";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";
import {MemoryLocalStorage} from "@src/testing/environment/browser/MemoryLocalStorage";
import {runtime} from "@src/environment/Runtime";
import {TEST_AUDIO_RECORDINGS} from "@src/testing/audio-recordings/TestAudioRecordings";
import {resetTestEnvironment} from "@src/testing/environment/TestEnvironment";
import {TEST_NOW} from "@src/testing/time/TestNow";

vi.mock("@src/redux/slices/study/storage/LoadStoredStudy", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {loadStoredStudy: async () => await testEnvironment.studyStorage.load()};
});
vi.mock("@src/redux/slices/study/storage/RecordAnswer", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    recordAnswer: async (card: StudyCard, entry: ReviewLogEntry) => {
      await testEnvironment.studyStorage.recordAnswer(card, entry);
    },
  };
});
vi.mock("@src/redux/slices/study/storage/SaveCard", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    saveCard: async (card: StudyCard) => {
      await testEnvironment.studyStorage.saveCard(card);
    },
  };
});
vi.mock("@src/redux/slices/card-pictures/storage/LoadStoredPictures", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {loadStoredPictures: async () => await testEnvironment.pictures.load()};
});
vi.mock("@src/redux/slices/card-pictures/storage/StorePicture", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    storePicture: async (cardId: string, picture: Blob, addedAt: string) => {
      return await testEnvironment.pictures.keep(cardId, picture, addedAt);
    },
  };
});
vi.mock("@src/redux/slices/card-pictures/storage/RenewStoredPicture", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    renewStoredPicture: async (cardId: string, addedAt: string) => {
      await testEnvironment.pictures.renew(cardId, addedAt);
    },
  };
});
vi.mock("@src/redux/slices/card-pictures/storage/ForgetStoredPicture", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    forgetStoredPicture: async (cardId: string) => {
      await testEnvironment.pictures.remove(cardId);
    },
  };
});
vi.mock("@src/audio/player/PlayRecording", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {playRecording: (url: string) => testEnvironment.audio.play(url)};
});
vi.mock("@src/audio/player/PlayRecordingsInOrder", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {playRecordingsInOrder: (urls: readonly string[]) => testEnvironment.audio.playInOrder(urls)};
});
vi.mock("@src/audio/recordings/EnsureRecording", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {ensureRecording: async (path: string) => await testEnvironment.recordings.ensure(path)};
});
vi.mock("@src/audio/recordings/CountKeptRecordings", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {countKeptRecordings: async (paths: readonly string[]) => await testEnvironment.recordings.countKept(paths)};
});
vi.mock("@src/audio/recordings/ForgetAllRecordings", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    forgetAllRecordings: async () => {
      await testEnvironment.recordings.forgetAll();
    },
  };
});
vi.mock("@src/audio/kept/HasKeptAudio", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    hasKeptAudio: async (language: SpokenLanguage, text: string) => await testEnvironment.keptAudio.has(language, text),
  };
});
vi.mock("@src/audio/kept/KeepAudio", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    keepAudio: async (language: SpokenLanguage, text: string) => {
      await testEnvironment.keptAudio.keep(language, text);
    },
  };
});

vi.mock("@src/redux/api/RedirectToSignIn", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {redirectToSignIn: () => testEnvironment.accountApi.signIn()};
});
vi.mock("@src/redux/api/ReadSignedInEmail", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {readSignedInEmail: async () => await testEnvironment.accountApi.readMe()};
});
vi.mock("@src/redux/api/EndApiSession", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    endApiSession: async () => {
      await testEnvironment.accountApi.signOut();
    },
  };
});
vi.mock("@src/redux/api/ReadKeptSimilar", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {readKeptSimilar: async () => await testEnvironment.accountApi.readSimilar()};
});
vi.mock("@src/redux/api/AddKeptSimilar", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    addKeptSimilar: async (noteId: string, text: string) => {
      await testEnvironment.accountApi.addSimilar(noteId, text);
    },
  };
});
vi.mock("@src/redux/api/RemoveKeptSimilar", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    removeKeptSimilar: async (noteId: string, text: string) => {
      await testEnvironment.accountApi.removeSimilar(noteId, text);
    },
  };
});
vi.mock("@src/redux/api/ReadKeptNotes", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {readKeptNotes: async () => await testEnvironment.accountApi.readNotes()};
});
vi.mock("@src/redux/api/AddKeptNote", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    addKeptNote: async (note: KeptNote) => {
      await testEnvironment.accountApi.addNote(note);
    },
  };
});
vi.mock("@src/redux/api/EditKeptNote", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    editKeptNote: async (note: KeptNote) => {
      await testEnvironment.accountApi.editNote(note);
    },
  };
});
vi.mock("@src/redux/api/RemoveKeptNote", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    removeKeptNote: async (id: string) => {
      await testEnvironment.accountApi.removeNote(id);
    },
  };
});

/**
 * Runs before every test file (`vitest.config.ts`). The app reaches for the time, a fresh id and what it is told it can say, so
 * each test starts at a fixed moment, with ids counting up from `test-1` and the small manifest of recordings in the runtime.
 */
beforeEach(() => {
  let made = 0;

  resetTestEnvironment();
  vi.useFakeTimers({toFake: ["Date"], now: TEST_NOW});
  vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
    made += 1;

    // Not a UUID: the id of a card the learner makes is `ko-custom-` and this, which reads better in an expectation.
    return `test-${made}` as ReturnType<typeof crypto.randomUUID>;
  });
  vi.stubGlobal("localStorage", new MemoryLocalStorage());
  runtime.audioRecordings = TEST_AUDIO_RECORDINGS;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
