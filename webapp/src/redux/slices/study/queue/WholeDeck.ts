import type {SessionFocus} from "@src/redux/slices/study/types/SessionFocus";

/** The focus of a session that studies all of a deck's day: the threshold does not matter, since nothing is picked out by it. */
export const WHOLE_DECK: SessionFocus = {kind: "all", strugglingAfter: 1};
