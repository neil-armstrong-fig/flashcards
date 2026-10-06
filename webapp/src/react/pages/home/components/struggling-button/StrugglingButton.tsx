import {Link} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";
import {selectStrugglingCount} from "@src/redux/shared/struggling/SelectStrugglingCount";
import {useAppSelector} from "@src/redux/shared/Hooks";

/** Opens the cards the learner keeps forgetting, with how many there are. */
export function StrugglingButton(): React.JSX.Element {
  const count = useAppSelector(selectStrugglingCount);

  return (
    <Link to={ROUTES.struggling} data-testid="open-struggling" className="self-start text-ink-muted underline">
      Struggling (<span data-testid="struggling-count">{count}</span>)
    </Link>
  );
}
