import {splitAtEmphasis} from "@src/react/pages/review/components/card-review/components/card-face/utils/SplitAtEmphasis";

it("cuts the text around the emphasised part", () => {
  expect(splitAtEmphasis("바르다/빠르다", "빠르다")).toEqual({before: "바르다/", bold: "빠르다", after: ""});
  expect(splitAtEmphasis("바르다/빠르다", "바르다")).toEqual({before: "", bold: "바르다", after: "/빠르다"});
});

it("cuts at the first place it appears", () => {
  expect(splitAtEmphasis("달/딸 달", "달")).toEqual({before: "", bold: "달", after: "/딸 달"});
});

it("leaves the text whole when there is nothing to emphasise or it is not there", () => {
  expect(splitAtEmphasis("물", undefined)).toEqual({before: "물", bold: "", after: ""});
  expect(splitAtEmphasis("물", "")).toEqual({before: "물", bold: "", after: ""});
  expect(splitAtEmphasis("물", "불")).toEqual({before: "물", bold: "", after: ""});
});
