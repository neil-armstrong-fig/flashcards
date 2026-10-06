import {useEffect} from "react";
import {refreshTime} from "@src/redux/slices/study/actions/session/thunks/RefreshTime";
import {useAppDispatch} from "@src/redux/shared/Hooks";

const MINUTE_IN_MS = 60 * 1000;

/**
 * Keeps what is due up to date while the app stays open: every minute, and the moment a hidden tab is shown again, since a
 * timer in a background tab may not have run for hours. Without it a phone left open overnight shows yesterday's count.
 */
export function useTimeRefresh(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    function refresh(): void {
      dispatch(refreshTime());
    }

    function refreshWhenShown(): void {
      if (document.visibilityState === "visible") {
        refresh();
      }
    }

    const timer = window.setInterval(refresh, MINUTE_IN_MS);
    document.addEventListener("visibilitychange", refreshWhenShown);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refreshWhenShown);
    };
  }, [dispatch]);
}
