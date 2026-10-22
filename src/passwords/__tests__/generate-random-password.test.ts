import {
  Exception,
  getLowercaseChars,
  getNumberChars,
  getUppercaseChars,
  IPasswordRequirement,
  List,
  PasswordRequirementIncludesLowercaseLetter,
  PasswordRequirementIncludesNumber,
  PasswordRequirementIncludesSymbol,
  PasswordRequirementIncludesUppercaseLetter,
  PasswordRequirementLength,
  PasswordRequirementMatchPassword,
  PasswordRequirementNoWhitespaces,
  PasswordRequirementsDefault,
  PasswordSymbolsDefault,
  validatePassword,
} from "@mantlebee/ts-core";

import {
  GenerateRandomPasswordExceptionCodes,
  NoAllowedCharsException,
  UnsatisfiableRequirementsException,
} from "../exceptions";
import { generateRandomPassword } from "../generate-random-password";

const generateRandomPasswords = (
  count: number,
  ...args: Parameters<typeof generateRandomPassword>
): List<string> =>
  Array.from({ length: count }, () => generateRandomPassword(...args));

const getCategory = (char: string): string => {
  if (getLowercaseChars().includes(char)) return "lowercase";
  if (getUppercaseChars().includes(char)) return "uppercase";
  if (getNumberChars().includes(char)) return "number";
  if (PasswordSymbolsDefault.includes(char)) return "symbol";
  return "other";
};

const expectException = (
  requirements: List<IPasswordRequirement>,
  exceptionClass: new () => Exception,
  code: GenerateRandomPasswordExceptionCodes,
) => {
  let error: unknown;
  try {
    generateRandomPassword(requirements);
  } catch (e) {
    error = e;
  }
  expect(error).toBeInstanceOf(exceptionClass);
  expect(error).toBeInstanceOf(Exception);
  expect((error as Exception).code).toBe(code);
};

describe("passwords", () => {
  describe("generateRandomPassword", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("Generates valid passwords of the minimum length with the default requirements", () => {
      const passwords = generateRandomPasswords(1000);
      passwords.forEach((a) => {
        expect(a).toHaveLength(8);
        expect(validatePassword(a).isValid).toBeTruthy();
        expect(a).toMatch(/[a-z]/);
        expect(a).toMatch(/[A-Z]/);
        expect(a).toMatch(/[0-9]/);
        expect(
          Array.from(a).some((b) => PasswordSymbolsDefault.includes(b)),
        ).toBeTruthy();
        expect(a).not.toMatch(/\s/);
      });
    });

    it("Generates passwords of the length defined by the requirements", () => {
      const requirements = [
        new PasswordRequirementLength(12, 12),
        new PasswordRequirementIncludesLowercaseLetter(),
      ];
      generateRandomPasswords(100, requirements).forEach((a) => {
        expect(a).toHaveLength(12);
        expect(a).toMatch(/^[a-z]{12}$/);
      });
    });

    it("Generates passwords with one char per requirement when there is no length requirement", () => {
      const requirements = [
        new PasswordRequirementIncludesLowercaseLetter(),
        new PasswordRequirementIncludesNumber(),
      ];
      generateRandomPasswords(100, requirements).forEach((a) => {
        expect(a).toHaveLength(2);
        expect(validatePassword(a, requirements).isValid).toBeTruthy();
      });
    });

    it("Uses only the given custom symbols", () => {
      const requirements = [
        new PasswordRequirementIncludesLowercaseLetter(),
        new PasswordRequirementIncludesSymbol("-_"),
      ];
      generateRandomPasswords(500, requirements).forEach((a) => {
        expect(a).toMatch(/^[a-z_-]+$/);
        expect(a).toMatch(/[-_]/);
        expect(validatePassword(a, requirements).isValid).toBeTruthy();
      });
    });

    it("Shuffles the chars, so the first one is not always of the same category", () => {
      const categories = new Set(
        generateRandomPasswords(200).map((a) => getCategory(a.charAt(0))),
      );
      expect(categories.size).toBeGreaterThan(1);
      expect(categories.has("other")).toBeFalsy();
    });

    it("Picks the filling chars uniformly from the distinct union of the allowed chars", () => {
      // The old algorithm picked a requirement first, so digits (10) came out
      // as often as lowercase letters (26): each digit 2.6 times more than a
      // letter. Now every char has the same chance.
      const requirements = [
        new PasswordRequirementIncludesLowercaseLetter(),
        new PasswordRequirementIncludesNumber(),
        // Overlaps with the lowercase letters: they must not count twice.
        new PasswordRequirementIncludesSymbol("abc"),
        new PasswordRequirementLength(100, 100),
      ];
      const passwords = generateRandomPasswords(200, requirements);
      const counts = new Map<string, number>();
      passwords.forEach((a) => {
        Array.from(a).forEach((b) => counts.set(b, (counts.get(b) ?? 0) + 1));
      });
      const alphabet = getLowercaseChars() + getNumberChars();
      expect(counts.size).toBe(alphabet.length);
      // 20000 chars over 36 distinct chars: ~556 each, std dev ~23.
      const expected = (passwords.length * 100) / alphabet.length;
      Array.from(alphabet).forEach((a) => {
        const count = counts.get(a) ?? 0;
        expect(count).toBeGreaterThan(expected * 0.75);
        expect(count).toBeLessThan(expected * 1.25);
      });
    });

    it("Uses the crypto random generator and never Math.random", () => {
      const mathRandomSpy = jest.spyOn(Math, "random");
      const getRandomValuesSpy = jest.spyOn(
        globalThis.crypto,
        "getRandomValues",
      );
      generateRandomPasswords(10);
      expect(mathRandomSpy).not.toHaveBeenCalled();
      expect(getRandomValuesSpy).toHaveBeenCalled();
    });

    it("Throws if the requirements are empty", () => {
      expectException(
        [],
        NoAllowedCharsException,
        GenerateRandomPasswordExceptionCodes.NoAllowedChars,
      );
    });

    it("Throws if no requirement has allowed chars", () => {
      expectException(
        [
          new PasswordRequirementLength(8, 30),
          new PasswordRequirementNoWhitespaces(),
        ],
        NoAllowedCharsException,
        GenerateRandomPasswordExceptionCodes.NoAllowedChars,
      );
    });

    it("Throws if there is a match password requirement", () => {
      expectException(
        [
          ...PasswordRequirementsDefault(),
          new PasswordRequirementMatchPassword(() => "Password1!"),
        ],
        UnsatisfiableRequirementsException,
        GenerateRandomPasswordExceptionCodes.UnsatisfiableRequirements,
      );
    });

    it("Throws if the minimum length is greater than the maximum length", () => {
      expectException(
        [
          new PasswordRequirementLength(10),
          new PasswordRequirementLength(1, 5),
          new PasswordRequirementIncludesLowercaseLetter(),
        ],
        UnsatisfiableRequirementsException,
        GenerateRandomPasswordExceptionCodes.UnsatisfiableRequirements,
      );
    });

    it("Throws if the maximum length is less than the required categories", () => {
      expectException(
        [
          new PasswordRequirementLength(1, 2),
          new PasswordRequirementIncludesLowercaseLetter(),
          new PasswordRequirementIncludesUppercaseLetter(),
          new PasswordRequirementIncludesNumber(),
        ],
        UnsatisfiableRequirementsException,
        GenerateRandomPasswordExceptionCodes.UnsatisfiableRequirements,
      );
    });
  });
});
