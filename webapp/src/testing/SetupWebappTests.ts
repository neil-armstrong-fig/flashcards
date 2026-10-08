import "fake-indexeddb/auto";
import {afterEach, beforeEach, vi} from "vitest";
import type {RecordChange} from "@flashcards/shared/sync/records/RecordChange";
import type {ReviewLogEntry} from "@src/spaced-repetition/scheduling/types/ReviewLogEntry";
import type {SpokenLanguage} from "@flashcards/shared/language/SpokenLanguage";
import type {StudyCard} from "@src/spaced-repetition/card/types/StudyCard";
import {MemoryLocalStorage} from "@src/testing/environment/browser/MemoryLocalStorage";
import {runtime} from "@src/environment/Runtime";
import {TEST_AUDIO_RECORDINGS} from "@src/testing/audio-recordings/TestAudioRecordings";
import {resetTestEnvironment} from "@src/testing/environment/TestEnvironment";
import {TEST_NOW} from "@src/testing/time/TestNow";

vi.mock("@src/storage/clear-all/ClearAllStoredData", () => ({clearAllStoredData: vi.fn(async () => undefined)}));
vi.mock("@src/storage/index-db/study/LoadStoredStudy", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {loadStoredStudy: async () => await testEnvironment.studyStorage.load()};
});
vi.mock("@src/storage/index-db/study/RecordAnswer", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    recordAnswer: async (card: StudyCard, entry: ReviewLogEntry) => {
      await testEnvironment.studyStorage.recordAnswer(card, entry);
    },
  };
});
vi.mock("@src/storage/index-db/study/SaveCard", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    saveCard: async (card: StudyCard) => {
      await testEnvironment.studyStorage.saveCard(card);
    },
  };
});
vi.mock("@src/storage/index-db/pictures/LoadStoredPictures", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {loadStoredPictures: async () => await testEnvironment.pictures.load()};
});
vi.mock("@src/storage/index-db/pictures/StorePicture", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    storePicture: async (cardId: string, picture: Blob, addedAt: string) => {
      return await testEnvironment.pictures.keep(cardId, picture, addedAt);
    },
  };
});
vi.mock("@src/storage/index-db/pictures/RenewStoredPicture", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    renewStoredPicture: async (cardId: string, addedAt: string) => {
      return await testEnvironment.pictures.renew(cardId, addedAt);
    },
  };
});
vi.mock("@src/storage/index-db/pictures/ForgetStoredPicture", async () => {
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
vi.mock("@src/storage/index-db/sync/records/KeepLocalRecord", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    keepLocalRecord: async (change: RecordChange) => {
      await testEnvironment.records.keep(change);
    },
  };
});
vi.mock("@src/storage/index-db/sync/records/ReadLocalRecord", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {readLocalRecord: async (kind: string, id: string) => await testEnvironment.records.read(kind, id)};
});
vi.mock("@src/storage/index-db/sync/records/KeepHeardRecord", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {
    keepHeardRecord: async (change: RecordChange) => {
      await testEnvironment.records.hear(change);
    },
  };
});
vi.mock("@src/redux/api/DownloadPicture", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {downloadPicture: async (hash: string) => await testEnvironment.records.download(hash)};
});
vi.mock("@src/storage/index-db/pictures/ReadKeptPicture", async () => {
  const {testEnvironment} = await import("@src/testing/environment/TestEnvironment");

  return {readKeptPicture: async (cardId: string) => await testEnvironment.pictures.read(cardId)};
});
vi.mock("@src/redux/slices/card-pictures/picture-processing/HashOfPicture", () => ({
  // Not a real hash: the size, in the 64 hexadecimal digits a hash is, so two pictures of different sizes differ.
  hashOfPicture: async (picture: Blob) => String(picture.size).padStart(64, "0"),
}));
vi.mock("@src/redux/slices/card-pictures/picture-processing/ProcessPicture", () => ({
  // A browser makes the picture small; here a picture of a kind that is kept is kept as it is, and anything else is refused.
  processPicture: async (file: Blob) => {
    if (["image/webp", "image/jpeg", "image/png"].includes(file.type)) {
      return {picture: file};
    }

    return {refusal: "That file is not a picture."};
  },
}));

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
