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
          const lengths = new Set<number>();
          for (let i = 0; i < 500; ++i) {
            const random = generateRandomStringFromPattern(pattern);
            expect(random).toMatch(/^[A-Z][a-z]{8,12}$/);
            lengths.add(random.length);
          }
          // The uppercase letter plus 8 to 12 lowercase letters, both included.
          expect([...lengths].sort((a, b) => a - b)).toEqual([
            9, 10, 11, 12, 13,
          ]);
        });
        it("Generates an empty string for a repeater of 0", () => {
          expect(generateRandomStringFromPattern("-a{0}-")).toBe("--");
        });
        it("Throws a RangeError if the min of a repeater is greater than its max", () => {
          expect(() => generateRandomStringFromPattern("a{12,8}")).toThrow(
            RangeError,
          );
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
          expect(random).toMatch(/^(0[1-9]|1[0-2])\/\d{2}$/);
        });
        it("Generates every month from 01 to 12, and nothing else", () => {
          const months = new Set<string>();
          for (let i = 0; i < 1000; ++i)
            months.add(generateRandomStringFromPattern("mm"));
          expect([...months].sort()).toEqual([
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12",
          ]);
        });
        it("Copies the chars that are not placeholders as they are", () => {
          expect(generateRandomStringFromPattern("x1-0")).toMatch(/^x1-\d$/);
          expect(generateRandomStringFromPattern("[0]")).toMatch(/^\[\d\]$/);
          expect(generateRandomStringFromPattern("m/Z")).toBe("m/Z");
          expect(generateRandomStringFromPattern("€ 😀")).toBe("€ 😀");
          // Brackets that are not repeaters are copied too.
          expect(generateRandomStringFromPattern("a{2}{3}")).toMatch(
            /^[a-z]{2}\{3\}$/,
          );
        });
        it("Copies the chars inside escape brackets as they are, placeholders included", () => {
          expect(generateRandomStringFromPattern("(Aa0mm{2})")).toBe(
            "Aa0mm{2}",
          );
          expect(generateRandomStringFromPattern("()0")).toMatch(/^\d$/);
        });
        it("Throws a SyntaxError if an escape bracket is not closed", () => {
          expect(() => generateRandomStringFromPattern("(IT00")).toThrow(
            SyntaxError,
          );
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
