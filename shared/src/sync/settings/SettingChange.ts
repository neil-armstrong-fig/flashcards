import {SYNCED_SETTING_NAMES} from "@flashcards/shared/sync/settings/SyncedSettingName";
import type {SyncedSettingName} from "@flashcards/shared/sync/settings/SyncedSettingName";

/** One setting as chosen at a moment: the value is `unknown` until the app that reads it has checked it against that setting's own limits. */
export interface SettingChange {
  readonly name: SyncedSettingName;
  readonly value: unknown;
  /** When the learner chose it, as an ISO timestamp. The later choice wins, wherever it was made. */
  readonly at: string;
}

/** A setting change from storage or the network, or `undefined` if what arrived is not one. */
export function readSettingChange(value: unknown): SettingChange | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const {name, value: chosen, at} = value as Record<string, unknown>;

  if (!SYNCED_SETTING_NAMES.some(known => known === name) || chosen === undefined) {
    return undefined;
  }

  if (typeof at !== "string" || Number.isNaN(new Date(at).getTime())) {
    return undefined;
  }

  return {name: name as SyncedSettingName, value: chosen, at};
}
