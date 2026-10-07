import {Link} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";

export function BrowseButton(): React.JSX.Element {
  return (
    <Link
      to={ROUTES.browse}
      data-testid="open-browse"
      className="flex min-h-11 items-center self-start text-ink-muted underline"
    >
      Browse all cards
    </Link>
  );
}
