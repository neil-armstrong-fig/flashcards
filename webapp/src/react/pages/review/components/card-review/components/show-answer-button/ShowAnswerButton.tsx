import {showAnswer} from "@src/redux/slices/study/actions/answering/thunks/ShowAnswer";
import {useAppDispatch} from "@src/redux/shared/Hooks";

export function ShowAnswerButton(): React.JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      data-testid="show-answer"
      onClick={() => dispatch(showAnswer())}
      className="rounded-xl bg-accent px-4 py-4 text-lg font-semibold text-ground"
    >
      Show answer
    </button>
  );
}
