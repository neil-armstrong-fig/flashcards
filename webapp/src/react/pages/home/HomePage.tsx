import {BrowseButton} from "@src/react/pages/home/components/browse-button/BrowseButton";
import {StrugglingButton} from "@src/react/pages/home/components/struggling-button/StrugglingButton";
import {SettingsButton} from "@src/react/pages/home/components/settings-button/SettingsButton";
import {DeckList} from "@src/react/pages/home/components/deck-list/DeckList";
import {StudySummary} from "@src/react/pages/home/components/study-summary/StudySummary";

export function HomePage(): React.JSX.Element {
  return (
    <main data-testid="app-home" className="mx-auto flex max-w-xl flex-col gap-6 p-4">
      <h1 className="text-2xl font-semibold">Language Learning</h1>

      <StudySummary />

      <DeckList />

      <BrowseButton />

      <StrugglingButton />

      <SettingsButton />
    </main>
  );
}
