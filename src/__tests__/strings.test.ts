import {
  getLowercaseChars,
  getNumberChars,
  getUppercaseChars,
} from "@mantlebee/ts-core";

import {
  generateRandomStringFromChars,
  generateRandomStringFromPattern,
} from "../strings";

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
      describe("generateRandomStringFromPattern", () => {
        it("Generates a random phone number like +XXX-XXXXX", () => {
          const patterns = ["+000-00000", "+0{3}-0{5}"];
          patterns.forEach((a) => {
            const random = generateRandomStringFromPattern(a);
            expect(random).toMatch(/^\+\d{3}-\d{5}$/);
          });
        });
        it("Generates a random 5 chars lowercase string with first letter uppercase", () => {
          const patterns = ["Aaaaa", "Aa{4}"];
          patterns.forEach((a) => {
            const random = generateRandomStringFromPattern(a);
            expect(random).toMatch(/^[A-Z][a-z]{4}$/);
          });
        });
        it("Generates a random lowercase string with first letter uppercase; length is variable from 3 to 5", () => {
          const pattern = "Aa{3,5}";
          const random = generateRandomStringFromPattern(pattern);
          expect(random).toMatch(/^[A-Z][a-z]{3,5}$/);
        });
        it("Generates a random credit card compliant string", () => {
          const patterns = ["0000-0000-0000-0000", "0{4}-0{4}-0{4}-0{4}"];
          patterns.forEach((a) => {
            const random = generateRandomStringFromPattern(a);
            expect(random).toMatch(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/);
          });
        });
        it("Generates a random italian IBAN compliant string", () => {
          //IT60X0542811101000000123456
          const pattern = "(IT)00A0000000000000000000000";
          const random = generateRandomStringFromPattern(pattern);
          expect(random).toMatch(/^IT[0-9]{2}[A-Z][0-9]{22}$/);
        });
        it("Generates a random austrian IBAN compliant string", () => {
          // AT611904300234573201
          const pattern = "(AT)000000000000000000";
          const random = generateRandomStringFromPattern(pattern);
          expect(random).toMatch(/^AT[0-9]{18}$/);
        });
      });
    });
  });
});
