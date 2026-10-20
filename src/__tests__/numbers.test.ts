import { List, numberIsInteger } from "@mantlebee/ts-core";

import { generateRandomNumber } from "../numbers";

describe("common", () => {
  describe("utils", () => {
    describe("numbers", () => {
      describe("generateRandomNumber", () => {
        it("Generates an integer random number between 0 and the given max value, max included", () => {
          const max = 12;
          const randoms: List<number> = [];
          for (let i = 0; i < 100; ++i) randoms.push(generateRandomNumber(max));
          expect(randoms.every((a) => a <= max)).toBeTruthy();
          expect(randoms.every(numberIsInteger)).toBeTruthy();
        });
        it("Generates an integer random number in the given range, min and max included", () => {
          const max = 12;
          const min = 10;
          const randoms: List<number> = [];
          for (let i = 0; i < 100; ++i)
            randoms.push(generateRandomNumber(max, min));
          expect(randoms.every((a) => a >= min && a <= max)).toBeTruthy();
          expect(randoms.every(numberIsInteger)).toBeTruthy();
        });
        it("Generates a float (2 digits) random number in the given range, min and max included", () => {
          const decimals = 2;
          const max = 12;
          const min = 10;
          const randoms: List<number> = [];
          for (let i = 0; i < 100; ++i)
            randoms.push(generateRandomNumber(max, min, decimals));
          expect(randoms.every((a) => a >= min && a <= max)).toBeTruthy();
          expect(randoms.some((a) => `${a}`.length === 5)).toBeTruthy();
          expect(randoms.some((a) => !numberIsInteger(a))).toBeTruthy();
        });
        it("Generates every float with the given decimals with the same chance, max included", () => {
          // 0, 0.1, ..., 1: 11 values, ~909 each over 10000 numbers.
          const counts = new Map<number, number>();
          for (let i = 0; i < 10000; ++i) {
            const random = generateRandomNumber(1, 0, 1);
            counts.set(random, (counts.get(random) ?? 0) + 1);
          }
          expect([...counts.keys()].sort()).toEqual([
            0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
          ]);
          counts.forEach((a) => {
            expect(a).toBeGreaterThan(909 * 0.75);
            expect(a).toBeLessThan(909 * 1.25);
          });
        });
        it("Includes min and max with decimals affected by floating point noise", () => {
          // 1.1 * 100 = 110.00000000000001, 2.3 * 100 = 229.99999999999997
          const randoms = new Set<number>();
          for (let i = 0; i < 2000; ++i)
            randoms.add(generateRandomNumber(1.2, 1.1, 2));
          expect(randoms.has(1.1)).toBeTruthy();
          expect(randoms.has(1.2)).toBeTruthy();
          for (let i = 0; i < 100; ++i)
            expect(generateRandomNumber(2.3, 2.3, 2)).toBe(2.3);
        });
        it("Returns min if it is equal to max", () => {
          expect(generateRandomNumber(5, 5)).toBe(5);
          expect(generateRandomNumber(2 ** 50 + 1, 2 ** 50 + 1)).toBe(
            2 ** 50 + 1,
          );
          expect(generateRandomNumber(0.25, 0.25, 2)).toBe(0.25);
        });
        it("Throws a RangeError if min is greater than max", () => {
          expect(() => generateRandomNumber(0, 1)).toThrow(RangeError);
          expect(() => generateRandomNumber(0, 1, 2)).toThrow(RangeError);
          expect(() => generateRandomNumber(-1)).toThrow(RangeError);
          expect(() => generateRandomNumber(NaN)).toThrow(RangeError);
        });
        it("Throws a RangeError if decimals is not a non-negative integer", () => {
          [-1, 1.5, NaN].forEach((a) => {
            expect(() => generateRandomNumber(1, 0, a)).toThrow(RangeError);
          });
        });
        it("Throws a RangeError if no number with the given decimals is in the range", () => {
          expect(() => generateRandomNumber(1.9, 1.1)).toThrow(RangeError);
          expect(() => generateRandomNumber(0.129, 0.121, 2)).toThrow(
            RangeError,
          );
        });
      });
    });
  });
});
