import {useEffect, useRef, useState} from "react";
import {useServiceWorkerRegistration} from "@src/react/components/release-update/hooks/use-release-update/service-worker-registration/UseServiceWorkerRegistration";
import {watchForRelease} from "@src/react/components/release-update/hooks/use-release-update/watch-for-release/WatchForRelease";

interface ReleaseUpdateState {
  readonly available: boolean;
  readonly leaveUntilLater: () => void;
  readonly refresh: () => Promise<void>;
}

/** Registers the worker and turns its waiting release into state for the notice. */
export function useReleaseUpdate(): ReleaseUpdateState {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const [leftUntilLater, setLeftUntilLater] = useState(false);
  const reloadingRef = useRef(false);
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useServiceWorkerRegistration({
    immediate: true,
    onRegisteredSW: (_scriptUrl, registered) => setRegistration(registered),
  });

  useEffect(() => {
    if (!registration) {
      return;
    }

    return watchForRelease(registration);
  }, [registration]);

  async function refresh(): Promise<void> {
    navigator.serviceWorker.addEventListener("controllerchange", reloadPage, {once: true});

    try {
      await updateServiceWorker();
    } catch (error) {
      navigator.serviceWorker.removeEventListener("controllerchange", reloadPage);
      throw error;
    }
  }

  function leaveUntilLater(): void {
    setLeftUntilLater(true);
  }

  function reloadPage(): void {
    if (reloadingRef.current) {
      return;
    }

    reloadingRef.current = true;
    location.reload();
  }

  return {available: needRefresh && !leftUntilLater, leaveUntilLater, refresh};
}
