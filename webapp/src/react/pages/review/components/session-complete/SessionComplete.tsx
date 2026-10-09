import {endSession} from "@src/redux/slices/study/actions/session/thunks/EndSession";
import {selectStrugglingCount} from "@src/redux/shared/struggling/SelectStrugglingCount";
import {useLeaveSession} from "@src/react/pages/review/hooks/use-leave-session/UseLeaveSession";
import {useNavigate} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** Shown instead of a card when nothing is left to do today, with a pointer to the Struggling list when there is something on it. */
export function SessionComplete(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const backToHome = useLeaveSession();
  const struggling = useAppSelector(selectStrugglingCount);

  function seeStruggling(): void {
    dispatch(endSession());
    void navigate(ROUTES.struggling, {replace: true});
  }

  return (
    <section data-testid="session-complete" className="flex flex-1 flex-col items-center justify-center gap-6">
      <p className="text-2xl">All done for now</p>

      {struggling > 0 && (
        <button
          type="button"
          data-testid="review-struggling"
          onClick={seeStruggling}
          className="text-ink-muted underline"
        >
          <span data-testid="struggling-notice-count">{struggling}</span> {struggling === 1 ? "card is" : "cards are"}{" "}
          struggling. See {struggling === 1 ? "it" : "them"}
        </button>
      )}

      <button
        type="button"
        data-testid="finish-session"
        onClick={backToHome}
        className="rounded-xl bg-accent px-6 py-3 text-lg font-semibold text-ground"
      >
        Back to home
      </button>
    </section>
  );
}
