import {returnAddress} from "@src/router/sign-in/start-sign-in/utils/ReturnAddress";

const SITES = ["https://site.example", "http://localhost:3000"];

it("brings the person back to where the app asked, on an allowed site", () => {
  expect(returnAddress("http://localhost:3000/settings?a=1", SITES)).toBe("http://localhost:3000/settings?a=1");
});

it.each([
  ["a site that is not allowed", "https://evil.example/"],
  ["a longer address that starts like an allowed one", "https://site.example.evil.example/"],
  ["something that is not an address", "not a url"],
  ["nothing asked", undefined],
])("falls back to the first site for %s", (_name, asked) => {
  expect(returnAddress(asked, SITES)).toBe("https://site.example/");
});
