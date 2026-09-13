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
      });
    });
  });
});
