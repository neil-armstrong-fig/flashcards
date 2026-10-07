import {similarRecordId} from "@src/redux/shared/sync-records/builders/SimilarRecordId";

it("is the card and the word, so the same word on the same card is one record", () => {
  expect(similarRecordId("ko-vocab-water", "볼")).toBe("ko-vocab-water|볼");
});
