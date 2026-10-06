import {reviewsLinkedToNewCards} from "@src/redux/slices/settings/limits/ReviewsLinkedToNewCards";

it("is ten reviews for each new card", () => {
  expect(reviewsLinkedToNewCards(20, 7)).toBe(200);
  expect(reviewsLinkedToNewCards(3, 200)).toBe(30);
});

it("leaves the reviews as they are when there are no new cards, so pausing new words does not stop the reviews", () => {
  expect(reviewsLinkedToNewCards(0, 200)).toBe(200);
});

it("stays within the most reviews a day allows", () => {
  expect(reviewsLinkedToNewCards(999, 0)).toBe(9990);
  expect(reviewsLinkedToNewCards(5000, 0)).toBe(9999);
});
