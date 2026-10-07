import {useMemo} from "react";
import {bringCardBack} from "@src/redux/slices/study/actions/setting-aside/thunks/BringCardBack";
import {selectCards} from "@src/redux/slices/deck/selectors/SelectCards";
import {Link} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";
import {strugglingRowsOf} from "@src/redux/shared/struggling/StrugglingRowsOf";
import {useAppDispatch, useAppSelector} from "@src/redux/shared/Hooks";

/** The cards the learner keeps forgetting. A card leaves the list by being remembered, and comes back if it is forgotten again. */
export function StrugglingPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const cards = useAppSelector(selectCards);
  const states = useAppSelector(state => state.study.cards);
  const log = useAppSelector(state => state.study.log);
  const threshold = useAppSelector(state => state.settings.strugglingAfter);
  const rows = useMemo(() => strugglingRowsOf({cards, states, log, threshold}), [cards, states, log, threshold]);

  return (
    <main data-testid="struggling-screen" className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Struggling</h1>

        <Link
          to={ROUTES.home}
          data-testid="close-struggling"
          className="flex min-h-11 items-center px-2 text-ink-muted underline"
        >
          Done
        </Link>
      </header>

      <p className="text-sm text-ink-muted">
        Cards you have forgotten {threshold} {threshold === 1 ? "time" : "times"} or more. Three good answers in a row
        clear a card from this list.
      </p>

      {rows.length === 0 && (
        <p data-testid="struggling-empty" className="text-ink-muted">
          No card is struggling.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {rows.map(row => (
          <li
            key={row.id}
            data-testid="struggling-card"
            className="flex flex-col gap-1 rounded-xl bg-ground-raised p-4"
          >
            <p className="flex items-baseline gap-3">
              <span data-testid="struggling-card-front" className="text-2xl">
                {row.front}
              </span>

              <span aria-hidden="true" className="text-ink-muted">
                to
              </span>

              <span data-testid="struggling-card-back" className="text-lg text-ink-muted">
                {row.back}
              </span>
            </p>

            <p className="flex gap-3 text-sm text-ink-muted">
              <span>
                Forgotten <span data-testid="struggling-card-lapses">{row.lapses}</span>
              </span>

              <span data-testid="struggling-card-status">{row.suspended ? "Suspended" : ""}</span>

              {row.suspended && (
                <button
                  type="button"
                  data-testid="struggling-card-bring-back"
                  onClick={() => void dispatch(bringCardBack(row.id))}
                  className="underline"
                >
                  Bring back
                </button>
              )}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
