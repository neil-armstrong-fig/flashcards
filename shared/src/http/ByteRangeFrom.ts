import type {ByteRange} from "@flashcards/shared/http/types/ByteRange";

const RANGE = /^bytes=(\d*)-(\d*)$/;

/** What a `Range` header asks for. iOS will not play audio it cannot ask for in parts, so this is not optional. One range only. */
export function byteRangeFrom(header: string | undefined): ByteRange {
  if (header === undefined) {
    return {kind: "whole"};
  }

  const match = RANGE.exec(header);

  if (match === null) {
    return {kind: "invalid"};
  }

  const [, first = "", last = ""] = match;

  if (first === "" && last === "") {
    return {kind: "invalid"};
  }

  if (first === "") {
    return {kind: "last", length: Number(last)};
  }

  if (last === "") {
    return {kind: "from", offset: Number(first)};
  }

  if (Number(last) < Number(first)) {
    return {kind: "invalid"};
  }

  return {kind: "part", offset: Number(first), length: Number(last) - Number(first) + 1};
}
