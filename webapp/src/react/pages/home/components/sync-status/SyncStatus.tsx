import {selectSignedIn} from "@src/redux/slices/account/selectors/SelectSignedIn";
import {useAppSelector} from "@src/redux/shared/Hooks";
import type {SyncStatus as Status} from "@src/redux/slices/sync/types/SyncStatus";

const WORDS: Readonly<Record<Status, string>> = {
  "not-synced": "Not synced yet",
  syncing: "Syncing…",
  synced: "Synced with your other devices",
};

/** Whether this device has caught up with the account, so a learner who has just answered on a phone knows when the laptop will agree. */
export function SyncStatus(): React.JSX.Element | undefined {
  const signedIn = useAppSelector(selectSignedIn);
  const status = useAppSelector(state => state.sync.status);

  if (!signedIn) {
    return undefined;
  }

  return (
    <p data-testid="sync-status" data-state={status} className="text-sm text-ink-muted">
      {WORDS[status]}
    </p>
  );
}
