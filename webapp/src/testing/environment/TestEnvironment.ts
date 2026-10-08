import {FakeAccountApi} from "@src/testing/environment/account/FakeAccountApi";
import {FakeKeptAudio} from "@src/testing/environment/audio/FakeKeptAudio";
import {FakeReminders} from "@src/testing/environment/reminders/FakeReminders";
import {MemoryCardPictures} from "@src/testing/environment/pictures/MemoryCardPictures";
import {MemoryRecordLog} from "@src/testing/environment/records/MemoryRecordLog";
import {MemoryRecordingKeeper} from "@src/testing/environment/audio/MemoryRecordingKeeper";
import {MemoryStudyStorage} from "@src/testing/environment/study/MemoryStudyStorage";
import {RecordingAudioPlayer} from "@src/testing/environment/audio/RecordingAudioPlayer";

interface TestEnvironment {
  studyStorage: MemoryStudyStorage;
  pictures: MemoryCardPictures;
  audio: RecordingAudioPlayer;
  recordings: MemoryRecordingKeeper;
  keptAudio: FakeKeptAudio;
  accountApi: FakeAccountApi;
  records: MemoryRecordLog;
  reminders: FakeReminders;
}

/**
 * What the browser and the API hold, in memory, for the test that is running. The effect modules are replaced by ones that read and
 * write this (`SetupWebappTests.ts`), so a test sets it up before it opens the store, and looks at it afterwards.
 */
export const testEnvironment: TestEnvironment = {
  studyStorage: new MemoryStudyStorage(),
  pictures: new MemoryCardPictures(),
  audio: new RecordingAudioPlayer(),
  recordings: new MemoryRecordingKeeper(),
  keptAudio: new FakeKeptAudio(),
  accountApi: new FakeAccountApi(),
  records: new MemoryRecordLog(),
  reminders: new FakeReminders(),
};

/** An environment with nothing in it: every test starts here. */
export function resetTestEnvironment(): void {
  testEnvironment.studyStorage = new MemoryStudyStorage();
  testEnvironment.pictures = new MemoryCardPictures();
  testEnvironment.audio = new RecordingAudioPlayer();
  testEnvironment.recordings = new MemoryRecordingKeeper();
  testEnvironment.keptAudio = new FakeKeptAudio();
  testEnvironment.accountApi = new FakeAccountApi();
  testEnvironment.records = new MemoryRecordLog();
  testEnvironment.reminders = new FakeReminders();
}
