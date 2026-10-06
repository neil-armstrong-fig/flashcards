/** What decides what a key means: whether there is a card to answer, and whether its answer is up, and whether the session is only a look ahead (no answers kept, nothing set aside). */
export interface ReviewScreenState {
  readonly hasCard: boolean;
  readonly answerShown: boolean;
  readonly lookingAhead: boolean;
}
