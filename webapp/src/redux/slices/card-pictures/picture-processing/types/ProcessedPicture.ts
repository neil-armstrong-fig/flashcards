/** What making a chosen file ready to keep gave: the picture to keep, or the reason it cannot be kept, in words for the learner. */
export interface ProcessedPicture {
  readonly picture?: Blob;
  readonly refusal?: string;
}
