import {staffStepsOf} from "@src/react/components/staff/utils/StaffStepsOf";

it("puts middle C two steps below the treble staff and the bottom line, E4, on 0", () => {
  expect(staffStepsOf("treble", "C4")).toBe(-2);
  expect(staffStepsOf("treble", "E4")).toBe(0);
});

it("puts the treble staff's top line, F5, on 8 and C6 on 12", () => {
  expect(staffStepsOf("treble", "F5")).toBe(8);
  expect(staffStepsOf("treble", "C6")).toBe(12);
});

it("puts the bass staff's bottom line, G2, on 0, its top line, A3, on 8 and middle C above it on 10", () => {
  expect(staffStepsOf("bass", "G2")).toBe(0);
  expect(staffStepsOf("bass", "A3")).toBe(8);
  expect(staffStepsOf("bass", "C4")).toBe(10);
  expect(staffStepsOf("bass", "C2")).toBe(-4);
});

it("has no place for a pitch that is not a natural note", () => {
  expect(staffStepsOf("treble", "C#4")).toBeUndefined();
});
