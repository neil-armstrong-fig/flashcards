import {testEnvironment} from "@src/testing/environment/TestEnvironment";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("carries on, unsaved, when storage cannot be read", async () => {
  vi.spyOn(testEnvironment.studyStorage, "load").mockRejectedValue(new Error("blocked"));
  vi.spyOn(console, "error").mockImplementation(() => undefined);

  const {store} = await openedStudyStore();

  expect(store.getState().study.status).toBe("ready");
});
