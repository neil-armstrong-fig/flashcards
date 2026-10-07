import {setCardAside} from "@src/redux/slices/study/actions/setting-aside/thunks/SetCardAside";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Two ways to put the card away without answering it: until tomorrow, or until it is brought back from the settings. */
export function SetAsideButtons(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(state => state.study.session?.saving === true);

  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        data-testid="bury-card"
        disabled={saving}
        onClick={() => void dispatch(setCardAside("bury"))}
        className="flex min-h-12 items-center justify-center rounded-xl bg-ground px-4 py-3 disabled:opacity-50"
      >
        Bury until tomorrow
      </button>

      <button
        type="button"
        data-testid="suspend-card"
        disabled={saving}
        onClick={() => void dispatch(setCardAside("suspend"))}
        className="flex min-h-12 items-center justify-center rounded-xl bg-ground px-4 py-3 disabled:opacity-50"
      >
        Suspend
      </button>
    </div>
  );
}
