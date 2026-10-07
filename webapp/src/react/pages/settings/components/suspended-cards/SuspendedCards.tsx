import {selectSuspendedCount} from "@src/redux/slices/study/selectors/SelectSuspendedCount";
import {unsuspendAll} from "@src/redux/slices/study/actions/setting-aside/thunks/UnsuspendAll";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** The cards put away until the learner brings them back, and the way to do that. */
export function SuspendedCards(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectSuspendedCount);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-ground-raised p-4">
      <p>
        Suspended cards: <span data-testid="suspended-count">{count}</span>
      </p>

      <button
        type="button"
        data-testid="unsuspend-all"
        disabled={count === 0}
        onClick={() => void dispatch(unsuspendAll())}
        className="min-h-11 underline disabled:text-ink-muted disabled:no-underline"
      >
        Bring them back
      </button>
    </div>
  );
}
