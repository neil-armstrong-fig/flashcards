import {createStore} from "@src/redux/Store";
import {loadStudy} from "@src/redux/slices/study/actions/session/thunks/LoadStudy";
import {testEnvironment} from "@src/testing/environment/TestEnvironment";
import {STARTER_DECK} from "@flashcards/content/korean/StarterDeck";
import {startSession} from "@src/redux/slices/study/actions/session/thunks/StartSession";
import type {AppStore} from "@src/redux/Store";
import type {MemoryRecordLog} from "@src/testing/environment/records/MemoryRecordLog";
import type {FakeAccountApi} from "@src/testing/environment/account/FakeAccountApi";
import type {FakeKeptAudio} from "@src/testing/environment/audio/FakeKeptAudio";
import type {MemoryCardPictures} from "@src/testing/environment/pictures/MemoryCardPictures";
import type {MemoryRecordingKeeper} from "@src/testing/environment/audio/MemoryRecordingKeeper";
import type {MemoryStudyStorage} from "@src/testing/environment/study/MemoryStudyStorage";
import type {RecordingAudioPlayer} from "@src/testing/environment/audio/RecordingAudioPlayer";

/** What a test gets back: the store, and what the browser and the API hold behind it, so a test can look at what was kept and played. */
export interface OpenedStudyStore {
  readonly store: AppStore;
  readonly storage: MemoryStudyStorage;
  readonly audio: RecordingAudioPlayer;
  readonly recordings: MemoryRecordingKeeper;
  readonly keptAudio: FakeKeptAudio;
  readonly pictures: MemoryCardPictures;
  readonly accountApi: FakeAccountApi;
  /** What the app kept to send the API of what the learner made, in order. */
  readonly records: MemoryRecordLog;
}

/** A store with the app loaded and a session started, over what `testEnvironment` holds: opened again in the same test, it finds the same progress. */
export async function openedStudyStore(): Promise<OpenedStudyStore> {
  const store = createStore();

  await store.dispatch(loadStudy());
  store.dispatch(startSession(STARTER_DECK.id));

  return {
    store,
    storage: testEnvironment.studyStorage,
    audio: testEnvironment.audio,
    recordings: testEnvironment.recordings,
    keptAudio: testEnvironment.keptAudio,
    pictures: testEnvironment.pictures,
    accountApi: testEnvironment.accountApi,
    records: testEnvironment.records,
  };
}
