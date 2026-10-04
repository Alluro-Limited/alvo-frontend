import {describe, expect, it} from "vite-plus/test";
import {parseWorkEmailDomains} from "../work-email-domains";

describe("parseWorkEmailDomains", () => {
  it("splits, trims and lowercases a comma-separated list, dropping blanks", () => {
    expect(parseWorkEmailDomains(" Allurro.com, alvo.com ,, ")).toEqual(["allurro.com", "alvo.com"]);
  });

  it("returns an empty list when nothing is configured", () => {
    expect(parseWorkEmailDomains(undefined)).toEqual([]);
    expect(parseWorkEmailDomains("")).toEqual([]);
  });
});
