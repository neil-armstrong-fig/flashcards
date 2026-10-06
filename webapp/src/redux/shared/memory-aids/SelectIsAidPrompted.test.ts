import {addCardPicture} from "@src/redux/slices/card-pictures/actions/card-picture/thunks/AddCardPicture";
import {markCardHard} from "@src/redux/slices/study/actions/setting-aside/thunks/MarkCardHard";
import {selectIsAidPrompted} from "@src/redux/shared/memory-aids/SelectIsAidPrompted";
import {writeCardNote} from "@src/redux/slices/card-notes/actions/card-note/thunks/WriteCardNote";
import {openedStudyStore} from "@src/testing/OpenedStudyStore";

it("does not prompt for a card that is not struggling", async () => {
  const {store} = await openedStudyStore();

  expect(selectIsAidPrompted(store.getState())).toBe(false);
});

it("prompts for a struggling card with no note and no picture", async () => {
  const {store} = await openedStudyStore();
  await store.dispatch(markCardHard());

  expect(selectIsAidPrompted(store.getState())).toBe(true);
});

it("stops prompting once the card has a note", async () => {
  const {store} = await openedStudyStore();
  await store.dispatch(markCardHard());
  store.dispatch(writeCardNote("like a mule"));

  expect(selectIsAidPrompted(store.getState())).toBe(false);
});

it("stops prompting once the card has a picture", async () => {
  const {store} = await openedStudyStore();
  await store.dispatch(markCardHard());
  await store.dispatch(addCardPicture(new File(["x"], "mule.png", {type: "image/png"})));

  expect(selectIsAidPrompted(store.getState())).toBe(false);
});
