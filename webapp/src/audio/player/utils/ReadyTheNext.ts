import {ensureRecording} from "@src/audio/recordings/EnsureRecording";

/** The elements loading the recordings that are next, held so the browser does not drop them before they are played. */
const loading = new Map<string, HTMLAudioElement>();

/**
 * Gets the recordings that are waiting their turn ready: kept on the device, then loaded by an element of their own, which leaves
 * the browser's media cache holding them for the player's element. Never throws, and one that cannot be fetched is left for the player to report.
 */
export async function readyTheNext(urls: readonly string[]): Promise<void> {
  await Promise.all(urls.map(async url => await ready(url)));
}

async function ready(url: string): Promise<void> {
  if (!url.startsWith("audio/") || loading.has(url) || !(await ensureRecording(url))) {
    return;
  }

  const element = new Audio();

  element.preload = "auto";
  element.src = url;
  element.load();
  loading.set(url, element);
  element.onloadeddata = () => loading.delete(url);
  element.onerror = () => loading.delete(url);
}
