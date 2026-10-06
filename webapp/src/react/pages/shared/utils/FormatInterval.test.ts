import {formatInterval} from "@src/react/pages/shared/utils/FormatInterval";

const minutes = (count: number): number => count * 60 * 1000;
const days = (count: number): number => count * 24 * 60 * minutes(1);

it.each([
  [minutes(1), "1m"],
  [minutes(10), "10m"],
  [minutes(0.2), "1m"],
  [minutes(180), "3h"],
  [days(1), "1d"],
  [days(15), "15d"],
  [days(45), "1.5mo"],
  [days(60), "2mo"],
  [days(730), "2y"],
])("says %d milliseconds as %s", (milliseconds, expected) => {
  expect(formatInterval(milliseconds)).toBe(expected);
});
