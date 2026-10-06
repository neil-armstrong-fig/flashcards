import {Link} from "react-router";
import {ROUTES} from "@src/react/routes/Routes";

export function SettingsButton(): React.JSX.Element {
  return (
    <Link to={ROUTES.settings} data-testid="open-settings" className="self-start text-ink-muted underline">
      Settings
    </Link>
  );
}
