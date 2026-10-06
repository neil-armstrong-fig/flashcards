import {listFrom} from "@src/router/cors/ListFrom";

it("reads a setting as a list, ignoring spaces and gaps", () => {
  expect(listFrom(" https://a.example , ,http://b.example")).toEqual(["https://a.example", "http://b.example"]);
});

it("is empty when the setting is missing", () => {
  expect(listFrom(undefined)).toEqual([]);
});
