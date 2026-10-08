import {recordingKeyFrom} from "@src/router/routes/audio/recording-key/RecordingKeyFrom";

it.each([
  ["ko/female-normal/c2f16032c0b9c1ea.mp3"],
  ["ja/male-slower/a1a05b6c2399ecbf.mp3"],
  ["en/female-normal/0123456789abcdef.mp3"],
  ["music/female-normal/0123456789abcdef.mp3"],
])("takes %s, a recording the app names", name => {
  expect(recordingKeyFrom(name)).toBe(name);
});

it.each([
  ["a path out of the folder", "../secret.mp3"],
  ["a path that climbs back out", "ko/female-normal/../../x.mp3"],
  ["a language that is not spoken here", "fr/female-normal/c2f16032c0b9c1ea.mp3"],
  ["a name that is not a recording's hash", "ko/female-normal/water.mp3"],
  ["a hash that is too short", "ko/female-normal/c2f1.mp3"],
  ["upper case letters", "ko/female-normal/C2F16032C0B9C1EA.mp3"],
  ["another file type", "ko/female-normal/c2f16032c0b9c1ea.wav"],
  ["an encoded slash", "ko%2Ffemale-normal/c2f16032c0b9c1ea.mp3"],
  ["nothing", ""],
])("refuses %s", (_name, name) => {
  expect(recordingKeyFrom(name)).toBeUndefined();
});
