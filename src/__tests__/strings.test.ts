import { generateRandomStringFromPattern } from "../strings";

describe("common", () => {
  describe("utils", () => {
    describe("strings", () => {
      describe("generateRandomStringFromPattern", () => {
        it("Generates a random code XXXX-XXXX-XXXX-XXXX", () => {
          const pattern = "0000-0000-0000-0000";
          const random = generateRandomStringFromPattern(pattern);
          expect(random).toMatch(/^\d{4}-\d{4}-\d{4}-\d{4}$/);
          expect(random).not.toBe(pattern);
        });
        it("Generates a random phone number like +XXX-XXXXX", () => {
          const patterns = ["+000-00000", "+0{3}-0{5}"];
          patterns.forEach((a) => {
            const random = generateRandomStringFromPattern(a);
            expect(random).toMatch(/^\+\d{3}-\d{5}$/);
            expect(random).not.toBe(a);
          });
        });
        it("Generates a random 5 chars lowercase string with first letter uppercase", () => {
          const patterns = ["Aaaaa", "Aa{4}"];
          patterns.forEach((a) => {
            const random = generateRandomStringFromPattern(a);
            expect(random).toMatch(/^[A-Z][a-z]{4}$/);
          });
        });
        it("Generates a random lowercase string with first letter uppercase; length is variable from 8 to 12", () => {
          const pattern = "Aa{8,12}";
          const random = generateRandomStringFromPattern(pattern);
          expect(random).toMatch(/^[A-Z][a-z]{8,12}$/);
        });
        it("Generates a random credit card compliant string", () => {
          const patterns = ["0000-0000-0000-0000", "0{4}-0{4}-0{4}-0{4}"];
          patterns.forEach((a) => {
            const random = generateRandomStringFromPattern(a);
            expect(random).toMatch(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/);
          });
        });
        it("Generates a valid credit card due date", () => {
          const pattern = "mm/00";
          const random = generateRandomStringFromPattern(pattern);
          expect(random).toMatch(/^[0-1][1-9]\/\d{2}$/);
        });
        it("Generates a random italian IBAN compliant string", () => {
          //IT60X0542811101000000123456
          const patterns = ["(IT)00A0000000000000000000000", "(IT)00A0{22}"];
          patterns.forEach((a) => {
            const random = generateRandomStringFromPattern(a);
            expect(random).toMatch(/^IT[0-9]{2}[A-Z][0-9]{22}$/);
          });
        });
        it("Generates a random austrian IBAN compliant string", () => {
          // AT611904300234573201
          const patterns = ["(AT)000000000000000000", "(AT)0{18}"];
          patterns.forEach((a) => {
            const random = generateRandomStringFromPattern(a);
            expect(random).toMatch(/^AT[0-9]{18}$/);
          });
        });
      });
    });
  });
});
