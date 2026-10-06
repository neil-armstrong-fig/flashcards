import type {StudyState} from "@src/redux/slices/study/types/StudyState";

export const INITIAL_STUDY_STATE: StudyState = {
  status: "loading",
  cardOrder: [],
  cards: {},
  log: [],
  now: new Date(0).toISOString(),
};
