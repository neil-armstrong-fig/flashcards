import {hasAdoptedRecords} from "@src/storage/local-storage/sync/records-adopted/HasAdoptedRecords";
import {keepRecordsAdopted} from "@src/storage/local-storage/sync/records-adopted/KeepRecordsAdopted";

it("remembers the adoption under the key devices already use", () => {
  expect(hasAdoptedRecords()).toBe(false);

  keepRecordsAdopted();

  expect(localStorage.getItem("flashcards.records-adopted.v1")).toBe("true");
  expect(hasAdoptedRecords()).toBe(true);
});
