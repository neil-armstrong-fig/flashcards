/**
 * What the fake audio element wrote down for one play: where it was asked to play from, and whether that could be fetched. Not
 * readonly: the fake fills `found` in once the fetch settles.
 */
export interface PlayedEntry {
  src: string;
  found?: boolean;
}
