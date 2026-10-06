/** What a request asks for of a file: all of it, a stretch, from a point to the end, the last few bytes, or something that makes no sense. */
export type ByteRange =
  | {readonly kind: "whole"}
  | {readonly kind: "part"; readonly offset: number; readonly length: number}
  | {readonly kind: "from"; readonly offset: number}
  | {readonly kind: "last"; readonly length: number}
  | {readonly kind: "invalid"};
