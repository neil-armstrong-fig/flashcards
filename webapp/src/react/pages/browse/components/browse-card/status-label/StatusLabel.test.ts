import {statusLabelOf} from "@src/react/pages/browse/components/browse-card/status-label/StatusLabel";

const DAY = 24 * 60 * 60 * 1000;

it.each([
  ["new", "New"],
  ["learning", "Learning"],
  ["due", "Due"],
  ["suspended", "Suspended"],
  ["buried", "Buried until tomorrow"],
] as const)("says %s as %s", (kind, label) => {
  expect(statusLabelOf({kind})).toBe(label);
});

it("says how long a scheduled card has to wait, as the rating buttons do", () => {
  expect(statusLabelOf({kind: "scheduled", dueInMs: 4 * DAY})).toBe("Due in 4d");
});
