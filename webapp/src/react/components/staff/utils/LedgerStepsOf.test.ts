import {ledgerStepsOf} from "@src/react/components/staff/utils/LedgerStepsOf";

it("needs none for a note on or inside the staff, or in the space just beyond it", () => {
  expect(ledgerStepsOf(0)).toEqual([]);
  expect(ledgerStepsOf(8)).toEqual([]);
  expect(ledgerStepsOf(-1)).toEqual([]);
  expect(ledgerStepsOf(9)).toEqual([]);
});

it("draws one through middle C under the treble staff", () => {
  expect(ledgerStepsOf(-2)).toEqual([-2]);
});

it("draws one under a note in the space below that, and two for the next line down", () => {
  expect(ledgerStepsOf(-3)).toEqual([-2]);
  expect(ledgerStepsOf(-4)).toEqual([-2, -4]);
});

it("draws them above the staff too", () => {
  expect(ledgerStepsOf(10)).toEqual([10]);
  expect(ledgerStepsOf(11)).toEqual([10]);
  expect(ledgerStepsOf(12)).toEqual([10, 12]);
});
