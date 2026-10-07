import {isLaterChoice} from "@flashcards/shared/sync/IsLaterChoice";
import {readSettings} from "@src/redux/slices/settings/storage/read/ReadSettings";
import type {SettingChange} from "@flashcards/shared/sync/settings/SettingChange";
import type {SettingTimes} from "@src/redux/slices/settings/sync/types/SettingTimes";
import type {TakenSettings} from "@src/redux/slices/settings/sync/types/TakenSettings";

/**
 * Which of the choices that came from the API are later than this device's own, to be taken: the later choice wins, wherever it
 * was made. Each value is read through the same checks as one kept on the device, so one that does not check out is the default.
 */
export function takeLaterSettings(incoming: readonly SettingChange[], times: SettingTimes): TakenSettings {
  const chosen: Partial<Record<string, unknown>> = {};
  const taken: Partial<Record<string, string>> = {...times};

  for (const {name, value, at} of incoming) {
    if (isLaterChoice(at, times[name])) {
      chosen[name] = readSettings({[name]: value})[name];
      taken[name] = at;
    }
  }

  return {chosen: chosen as TakenSettings["chosen"], times: taken};
}
