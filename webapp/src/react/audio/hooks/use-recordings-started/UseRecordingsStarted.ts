import {countRecordingsStarted} from "@src/audio/player/CountRecordingsStarted";
import {subscribeToPlaying} from "@src/audio/player/SubscribeToPlaying";
import {useSyncExternalStore} from "react";

/** How many recordings have been started, which changes at each start, so the screen can show it. */
export function useRecordingsStarted(): number {
  return useSyncExternalStore(subscribeToPlaying, countRecordingsStarted);
}
