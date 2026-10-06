/** A save that failed is reported and then ignored: the learner carries on, and the progress is simply not kept. */
export function reportUnsaved(error: unknown): void {
  console.error("Progress could not be saved.", error);
}
