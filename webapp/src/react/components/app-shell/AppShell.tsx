import {Outlet} from "react-router";
import {LoginPage} from "@src/react/pages/login/LoginPage";
import {selectAccess} from "@src/redux/slices/account/selectors/SelectAccess";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useTimeRefresh} from "@src/react/components/app-shell/hooks/use-time-refresh/UseTimeRefresh";

/** The page is drawn to the screen's edges (`viewport-fit=cover`), so it keeps out of the notch, the home bar and a rounded corner. */
const SAFE_AREA =
  "pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]";

/**
 * The layout every screen sits in. The whole app is behind Google sign-in (`SelectAccess`): until the learner is let in, the only
 * screen is the sign-in one. Screen changes belong to the controls that cause them, so browser Back and Forward keep their usual
 * meaning.
 */
export function AppShell(): React.JSX.Element | undefined {
  useTimeRefresh();

  const access = useAppSelector(selectAccess);
  const ready = useAppSelector(state => state.study.status === "ready");

  if (access === "checking") {
    return undefined;
  }

  if (access === "signIn" || access === "unreachable") {
    return (
      <div data-testid="app-ready" className={SAFE_AREA}>
        <LoginPage reason={access} />
      </div>
    );
  }

  if (!ready) {
    return undefined;
  }

  return (
    <div data-testid="app-ready" className={SAFE_AREA}>
      <Outlet />
    </div>
  );
}
