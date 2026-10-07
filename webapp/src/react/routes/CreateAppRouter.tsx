import {createHashRouter, redirect} from "react-router";
import {AppShell} from "@src/react/components/app-shell/AppShell";
import {BrowsePage} from "@src/react/pages/browse/BrowsePage";
import {DeckSettingsPage} from "@src/react/pages/deck-settings/DeckSettingsPage";
import {HomePage} from "@src/react/pages/home/HomePage";
import {ReviewPage} from "@src/react/pages/review/ReviewPage";
import {ROUTES} from "@src/react/routes/Routes";
import {SettingsPage} from "@src/react/pages/settings/SettingsPage";
import {StrugglingPage} from "@src/react/pages/struggling/StrugglingPage";
import type {AppStore} from "@src/redux/Store";

/**
 * The screens. Hash routes, so GitHub Pages and the service worker need no fallback for a path they do not have, and Back works.
 * `AppShell` is the layout every screen sits in: it lets the learner in and takes them to the review screen when a session starts.
 * A review session is not kept between visits, so the review address with no session (a reload, or an old link) goes home.
 */
export function createAppRouter(store: AppStore): ReturnType<typeof createHashRouter> {
  return createHashRouter([
    {
      element: <AppShell />,
      children: [
        {path: ROUTES.home, element: <HomePage />},
        {path: ROUTES.settings, element: <SettingsPage />},
        {path: ROUTES.deckSettings, element: <DeckSettingsPage />},
        {path: ROUTES.browse, element: <BrowsePage />},
        {path: ROUTES.struggling, element: <StrugglingPage />},
        {
          path: ROUTES.review,
          element: <ReviewPage />,
          loader: () => {
            if (store.getState().study.session === undefined) {
              return redirect(ROUTES.home);
            }

            return null;
          },
        },
      ],
    },
  ]);
}
