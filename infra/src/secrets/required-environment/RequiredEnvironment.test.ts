import {requiredEnvironment} from "@src/secrets/required-environment/RequiredEnvironment";

it("gives the value of each name asked for", () => {
  expect(requiredEnvironment({A: "1", B: "2", C: "3"}, ["A", "B"])).toEqual({A: "1", B: "2"});
});

it("names every variable that is missing or empty, all at once", () => {
  expect(() => requiredEnvironment({A: "", C: "3"}, ["A", "B", "C"])).toThrow("Set A, B in the environment");
});
