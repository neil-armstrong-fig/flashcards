import {deckRecordingPaths} from "@src/audio/deck-recordings/DeckRecordingPaths";
import {keepDeckOffline} from "@src/react/audio/offline/KeepDeckOffline";
import {loadOfflineStatus} from "@src/react/audio/offline/LoadOfflineStatus";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("starts by counting what each deck has and what is kept: nothing", async () => {
  const {store} = await openedStudyStore();

  await loadOfflineStatus(store.dispatch);

  expect(starterPaths().length).toBeGreaterThan(0);
  expect(store.getState().offline.decks["ko-starter"]).toEqual({
    kept: 0,
    total: starterPaths().length,
    working: false,
    incomplete: false,
  });
});

it("fetches every recording of the deck, and only that deck's, and says they are all kept", async () => {
  const {store, recordings} = await openedStudyStore();

  await keepDeckOffline(store, "ko-starter");

  expect([...recordings.kept].sort()).toEqual([...starterPaths()].sort());
  expect(store.getState().offline.decks["ko-starter"]).toEqual({
    kept: starterPaths().length,
    total: starterPaths().length,
    working: false,
    incomplete: false,
  });
});

it("does not fetch again what is kept, so keeping a deck twice costs nothing the second time", async () => {
  const {store, recordings} = await openedStudyStore();

  await keepDeckOffline(store, "ko-starter");
  recordings.fetched.length = 0;
  await keepDeckOffline(store, "ko-starter");

  expect(recordings.fetched).toEqual([]);
});

it("leaves the deck incomplete where recordings could not be fetched, so the learner can try again", async () => {
  const {store, recordings} = await openedStudyStore();

  recordings.failing = true;
  await keepDeckOffline(store, "ko-starter");

  expect(store.getState().offline.decks["ko-starter"]).toMatchObject({kept: 0, working: false, incomplete: true});

  recordings.failing = false;
  await keepDeckOffline(store, "ko-starter");

  expect(store.getState().offline.decks["ko-starter"]).toMatchObject({kept: starterPaths().length, incomplete: false});
});

it("counts what was kept as the learner played, before they asked for anything", async () => {
  const {store, recordings} = await openedStudyStore();

  await recordings.ensure(starterPaths()[0] ?? "");
  await loadOfflineStatus(store.dispatch);

  expect(store.getState().offline.decks["ko-starter"]?.kept).toBe(1);
});

/** Read when a test runs, not when the file loads: the test recordings are put in place before each test. */
function starterPaths(): string[] {
  return deckRecordingPaths("ko-starter");
}
