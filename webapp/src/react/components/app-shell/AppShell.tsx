import {Navigate, Outlet, useLocation} from "react-router";
import {LoginPage} from "@src/react/pages/login/LoginPage";
import {ROUTES} from "@src/react/routes/Routes";
import {selectAccess} from "@src/redux/slices/account/selectors/SelectAccess";
import {useAppSelector} from "@src/redux/shared/Hooks";
import {useTimeRefresh} from "@src/react/components/app-shell/hooks/use-time-refresh/UseTimeRefresh";

/** The page is drawn to the screen's edges (`viewport-fit=cover`), so it keeps out of the notch, the home bar and a rounded corner. */
const SAFE_AREA =
  "pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]";

/**
 * The layout every screen sits in. The whole app is behind Google sign-in (`SelectAccess`): until the learner is let in, the only
 * screen is the sign-in one. A review session takes over the page, and it is the store that says whether there is one, so starting a
 * session goes to the review screen. Ending one goes where the learner chose, which is the job of what ends it.
 */
export function AppShell(): React.JSX.Element | undefined {
  useTimeRefresh();

  const {pathname} = useLocation();
  const access = useAppSelector(selectAccess);
  const ready = useAppSelector(state => state.study.status === "ready");
  const reviewing = useAppSelector(state => state.study.session !== undefined);

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

  if (reviewing && pathname !== ROUTES.review) {
    return <Navigate to={ROUTES.review} replace />;
  }

  return (
    <div data-testid="app-ready" className={SAFE_AREA}>
      <Outlet />
    </div>
  );
}
