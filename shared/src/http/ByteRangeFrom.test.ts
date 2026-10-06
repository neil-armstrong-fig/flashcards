import {byteRangeFrom} from "@flashcards/shared/http/ByteRangeFrom";

it("is none where no range was asked for", () => {
  expect(byteRangeFrom(undefined)).toEqual({kind: "whole"});
});

it("reads a start and an end, the end included", () => {
  expect(byteRangeFrom("bytes=0-99")).toEqual({kind: "part", offset: 0, length: 100});
});

it("reads an open end as the rest of the file", () => {
  expect(byteRangeFrom("bytes=100-")).toEqual({kind: "from", offset: 100});
});

it("reads a suffix as the last bytes", () => {
  expect(byteRangeFrom("bytes=-500")).toEqual({kind: "last", length: 500});
});

it.each([
  ["another unit", "items=0-9"],
  ["an end before the start", "bytes=9-0"],
  ["two ranges", "bytes=0-1,4-5"],
  ["no digits", "bytes=-"],
  ["nonsense", "bytes=a-b"],
])("refuses %s", (_name, header) => {
  expect(byteRangeFrom(header)).toEqual({kind: "invalid"});
});
