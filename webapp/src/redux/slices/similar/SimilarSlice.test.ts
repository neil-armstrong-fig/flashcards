import {
  addingFailed,
  addingStarted,
  similarReducer,
  wordAdded,
  wordRemoved,
} from "@src/redux/slices/similar/SimilarSlice";

it("starts with nothing added", () => {
  expect(similarReducer(undefined, {type: "unknown"})).toEqual({words: {}, adding: false});
});

it("keeps a word with the note it was added to, after any already there", () => {
  const first = similarReducer(undefined, wordAdded({noteId: "ko-vocab-water", text: "불"}));
  const second = similarReducer(first, wordAdded({noteId: "ko-vocab-water", text: "볼"}));

  expect(second.words).toEqual({"ko-vocab-water": ["불", "볼"]});
});

it("keeps words for different notes apart", () => {
  const state = similarReducer(undefined, wordAdded({noteId: "ko-vocab-water", text: "불"}));

  expect(similarReducer(state, wordAdded({noteId: "ko-vocab-rice", text: "방"})).words).toEqual({
    "ko-vocab-water": ["불"],
    "ko-vocab-rice": ["방"],
  });
});

it("is busy while adding, and clears an old error when it starts", () => {
  const failed = similarReducer(undefined, addingFailed("No."));

  expect(similarReducer(failed, addingStarted())).toMatchObject({adding: true, error: undefined});
});

it("is no longer busy once it has failed, and says why", () => {
  const busy = similarReducer(undefined, addingStarted());

  expect(similarReducer(busy, addingFailed("No."))).toMatchObject({adding: false, error: "No."});
});

it("removes a word from its note and leaves the others", () => {
  let state = similarReducer(undefined, wordAdded({noteId: "ko-vocab-water", text: "볼"}));
  state = similarReducer(state, wordAdded({noteId: "ko-vocab-water", text: "벌"}));

  expect(similarReducer(state, wordRemoved({noteId: "ko-vocab-water", text: "볼"})).words).toEqual({
    "ko-vocab-water": ["벌"],
  });
});
