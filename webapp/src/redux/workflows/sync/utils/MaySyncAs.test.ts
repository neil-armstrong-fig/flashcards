import {maySyncAs} from "@src/redux/workflows/sync/utils/MaySyncAs";

it("lets any account sync a device nobody has synced yet", () => {
  expect(maySyncAs(undefined, "a@example.com")).toBe(true);
});

it("lets the account that synced the device sync it again, and no other", () => {
  expect(maySyncAs("a@example.com", "a@example.com")).toBe(true);
  expect(maySyncAs("a@example.com", "b@example.com")).toBe(false);
});
