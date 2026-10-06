import {markCardHard} from "@src/redux/slices/study/actions/setting-aside/thunks/MarkCardHard";
import {selectIsStruggling} from "@src/redux/shared/struggling/SelectIsStruggling";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Says so when the card is on the Struggling list, and otherwise lets the learner say a card is hard, putting it on the Struggling list now rather than after it has been forgotten enough times. */
export function MarkHardButton(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(state => state.study.session?.saving === true);
  const struggling = useAppSelector(state => {
    const id = state.study.session?.currentCardId;

    return id !== undefined && selectIsStruggling(state, id);
  });

  if (struggling) {
    return (
      <p data-testid="marked-hard" className="text-center text-sm text-ink-muted">
        On your Struggling list
      </p>
    );
  }

  return (
    <button
      type="button"
      data-testid="mark-hard"
      disabled={saving}
      onClick={() => void dispatch(markCardHard())}
      className="self-center text-sm text-ink-muted underline"
    >
      This is hard
    </button>
  );
}
