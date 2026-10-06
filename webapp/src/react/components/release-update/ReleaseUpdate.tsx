import {useReleaseUpdate} from "@src/react/components/release-update/hooks/use-release-update/UseReleaseUpdate";

/** A waiting release, kept compact and optional so it never gets in the way of a card. At the top, clear of the rating buttons. */
export function ReleaseUpdate(): React.JSX.Element | undefined {
  const {available, leaveUntilLater, refresh} = useReleaseUpdate();

  if (!available) {
    return undefined;
  }

  return (
    <aside
      data-testid="release-update"
      role="status"
      aria-live="polite"
      className="fixed inset-x-2 top-[max(0.5rem,env(safe-area-inset-top))] z-40 mx-auto flex max-w-md items-center gap-2 rounded-2xl bg-ground-raised p-3 shadow-2xl"
    >
      <p className="min-w-0 flex-1 text-sm font-medium">A new version is ready</p>

      <button
        type="button"
        data-testid="release-update-refresh"
        onClick={() => void refresh()}
        className="min-h-11 rounded-xl bg-accent px-3 text-sm font-semibold text-ground"
      >
        Refresh
      </button>

      <button
        type="button"
        data-testid="release-update-later"
        onClick={leaveUntilLater}
        className="min-h-11 rounded-xl px-3 text-sm font-semibold text-ink-muted"
      >
        Later
      </button>
    </aside>
  );
}
