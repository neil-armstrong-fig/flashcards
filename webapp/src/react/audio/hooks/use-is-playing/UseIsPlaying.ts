import {isPlaying} from "@src/audio/player/IsPlaying";
import {subscribeToPlaying} from "@src/audio/player/SubscribeToPlaying";
import {useSyncExternalStore} from "react";

/** Whether a recording is sounding now, so what plays it can show that it is. */
export function useIsPlaying(): boolean {
  return useSyncExternalStore(subscribeToPlaying, isPlaying);
}
