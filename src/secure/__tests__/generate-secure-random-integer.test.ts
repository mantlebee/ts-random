import { List, numberIsInteger } from "@mantlebee/ts-core";

import { generateSecureRandomInteger } from "../generate-secure-random-integer";

describe("secure", () => {
  describe("generateSecureRandomInteger", () => {
    it("Generates integers between 0 and the given max value, max excluded", () => {
      const max = 7;
      const randoms: List<number> = [];
      for (let i = 0; i < 1000; ++i)
        randoms.push(generateSecureRandomInteger(max));
      expect(randoms.every((a) => a >= 0 && a < max)).toBeTruthy();
      expect(randoms.every(numberIsInteger)).toBeTruthy();
      expect(new Set(randoms).size).toBe(max);
    });
    it("Always returns 0 if max is 1", () => {
      for (let i = 0; i < 100; ++i)
        expect(generateSecureRandomInteger(1)).toBe(0);
    });
    it("Accepts 2^32 as max value", () => {
      const random = generateSecureRandomInteger(2 ** 32);
      expect(random >= 0 && random < 2 ** 32).toBeTruthy();
    });
    it("Throws a RangeError if max is not an integer between 1 and 2^32", () => {
      [0, -1, 1.5, NaN, Infinity, 2 ** 32 + 1].forEach((a) => {
        expect(() => generateSecureRandomInteger(a)).toThrow(RangeError);
      });
    });
  });
});
