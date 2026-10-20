import {
  getLowercaseChars,
  getNumberChars,
  getUppercaseChars,
} from "@mantlebee/ts-core";

import { generateRandomStringFromChars } from "../utils";

describe("common", () => {
  describe("utils", () => {
    describe("strings", () => {
      describe("generateRandomStringFromChars", () => {
        it("Generates `aaa`", () => {
          const random = generateRandomStringFromChars("a", 3);
          expect(random).toBe("aaa");
        });
        it("Generates a string of 5 numbers", () => {
          const chars = getNumberChars();
          const random = generateRandomStringFromChars(chars, 5);
          expect(/^[0-9]{5}$/.test(random)).toBeTruthy();
        });
        it("Generates a string of 10 letters, upper and lower case", () => {
          const chars = getLowercaseChars() + getUppercaseChars();
          const random = generateRandomStringFromChars(chars, 10);
          expect(/^([a-z]|[A-Z]){10}$/.test(random)).toBeTruthy();
        });
        it("Picks every given char", () => {
          const chars = "abcdef";
          const random = generateRandomStringFromChars(chars, 500);
          expect(new Set(random)).toEqual(new Set(chars));
        });
        it("Keeps the chars outside the BMP, such as emojis, whole", () => {
          const chars = "😀🎉a";
          const random = generateRandomStringFromChars(chars, 100);
          const randomChars = Array.from(random);
          expect(randomChars).toHaveLength(100);
          randomChars.forEach((a) => {
            expect(["😀", "🎉", "a"]).toContain(a);
          });
        });
        it("Returns an empty string if chars or length are empty", () => {
          expect(generateRandomStringFromChars("", 5)).toBe("");
          expect(generateRandomStringFromChars("abc", 0)).toBe("");
        });
      });
    });
  });
});
