import {useEffect, useMemo} from "react";
import {Provider} from "react-redux";
import {createAppRouter} from "@src/react/routes/CreateAppRouter";
import {RouterProvider} from "react-router";
import {ThemeApplier} from "@src/react/components/theme-applier/ThemeApplier";
import {ReleaseUpdate} from "@src/react/components/release-update/ReleaseUpdate";
import {loadAccountAndSync} from "@src/react/audio/sync/LoadAccountAndSync";
import {keepProgressSynced} from "@src/react/audio/sync/KeepProgressSynced";
import {loadCardPictures} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/LoadCardPictures";
import {loadOfflineStatus} from "@src/react/audio/offline/LoadOfflineStatus";
import {loadStudy} from "@src/redux/slices/study/actions/session/thunks/LoadStudy";
import type {AppStore} from "@src/redux/Store";

interface Props {
  readonly store: AppStore;
}

/** The shell: the store for every component, and saved progress loaded once on start. */
export function App({store}: Props): React.JSX.Element {
  useEffect(() => {
    void store.dispatch(loadStudy());
    void loadAccountAndSync(store);
    void store.dispatch(loadCardPictures());
    void loadOfflineStatus(store.dispatch);

    return keepProgressSynced(store);
  }, [store]);

  const router = useMemo(() => createAppRouter(store), [store]);

  return (
    <Provider store={store}>
      <ThemeApplier />

      <RouterProvider router={router} />

      <ReleaseUpdate />
    </Provider>
  );
}
