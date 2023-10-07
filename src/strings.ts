import {
  getLowercaseChars,
  getNumberChars,
  getUppercaseChars,
} from "@mantlebee/ts-core";

import { generateRandomNumber } from "./numbers";

/**
 * Generates a random string from the given chars and of the given length.
 * @example
 * // Generates a random string of 5 chars chosen between X and Y.
 * generateRandomStringFromChars("XY", 5)
 * @param chars List of chars from which to generate the string.
 * @param length Length of the string to generate.
 * @returns a random string from the given chars and of the given length.
 */
export function generateRandomStringFromChars(
  chars: string,
  length: number
): string {
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

/**
 * Generates a random string from the given pattern. The length of the string depends on pattern itself.
 * Patterns allow to generate strings like telephone numbers, credit card numbers, banking IBAN, ecc.
 * Patterns are defined by special chars, escape brackets and repeater brackets:
 *    Special Chars:
 *      - A     : random uppercase letter
 *      - a     : random lowercase letter
 *      - 0     : random integer number
 *    Escape brackets:
 *      - ()    : chars inside are not considered special chars
 *    Repeater brackets:
 *      - {n}   : repeats previous special char n-1 times
 *      - {n,M} : repeats previous special char between n and M times minus one
 * @example
 * // Generates a random telephone number.
 * generateRandomStringFromPattern("+000-00000") // or "+0{3}-0{5}"
 * @example
 * // Generates a random credit card number.
 * generateRandomStringFromPattern("0000-0000-0000-0000") // or "0{4}-0{4}-0{4}-0{4}"
 * @example
 * // Generates a random italian IBAN compliant string.
 * generateRandomStringFromPattern("(IT)00A0{22}")
 * @example
 * // Generates a random lowercase string with first letter uppercase and length variable between 8 and 12 chars.
 * generateRandomStringFromPattern("Aa{8,12}")
 * @param pattern Pattern for the random string.
 * @returns a random string from the given pattern.
 */
export function generateRandomStringFromPattern(pattern: string): string {
  const chars = pattern.split("");
  let skipReplace = false;
  let repeats = 1;
  chars.forEach((char, index) => {
    // (, {
      // if open bracket, skips special chars replacement
    if (/\(|\{/.test(char)) skipReplace = true;
    // ), }
    // if close bracket, returns to replace special chars
    else if (/\)|\}/.test(char)) skipReplace = false;
    // a, A, 0
    // if special chars, replaces it (and repeats it, if next chars are Repeater brackets)
    else if (/[aA0]/.test(char) && !skipReplace) {
      // get next chars to update the repeats variable
      const nextChars = chars.slice(index + 1).join("");
      // {n,M}
      if (/^\{\d*,\d*\}/.test(nextChars)) {
        const range = nextChars.replace(/\{|\}/g, "").split(",");
        const max = parseInt(range[0]);
        const min = parseInt(range[1]);
        repeats = generateRandomNumber(max, min);
      } // {n}
      else if (/^\{\d*\}/.test(nextChars))
        repeats = parseInt(nextChars.replace(/\{|\}/g, ""));
      // repleaces the special char
      let replaceWith = "";
      for (let i = 0; i < repeats; ++i)
        switch (char) {
          case "a":
            replaceWith += generateRandomStringFromChars(
              getLowercaseChars(),
              1
            );
            break;
          case "A":
            replaceWith += generateRandomStringFromChars(
              getUppercaseChars(),
              1
            );
            break;
          case "0":
            replaceWith += generateRandomStringFromChars(getNumberChars(), 1);
            break;
        }
      chars[index] = replaceWith;
      repeats = 1;
    }
  });
  return chars.join("").replace(/\(|\)|\{\d*\}|\{\d*,\d*\}/g, "");
}
