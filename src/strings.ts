import {
  getLowercaseChars,
  getNumberChars,
  getUppercaseChars,
} from "@mantlebee/ts-core";
import { generateRandomNumber } from "./numbers";

/**
 * Generates a random string from the given chars and of the given length.
 * @param chars List of chars from which to generate the string.
 * @param length Length of the string to generate.
 * @returns a random string.
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

export function generateRandomStringFromPattern(pattern: string): string {
  const chars = pattern.split("");
  let skipReplace = false;
  let muliplier = 1;
  chars.forEach((char, index) => {
    // (, {
    if (/\(|\{/.test(char)) skipReplace = true;
    // ), }
    else if (/\)|\}/.test(char)) skipReplace = false;
    // a, A, 0
    else if (/[aA0]/.test(char) && !skipReplace) {
      const nextChars = chars.slice(index + 1).join("");
      if (/^\{\d*\}/.test(nextChars)) {
        muliplier = parseInt(nextChars.replace(/\{|\}/g, ""));
      }
      if (/^\{\d*,\d*\}/.test(nextChars)) {
        const range = nextChars.replace(/\{|\}/g, "").split(",");
        const max = parseInt(range[0]);
        const min = parseInt(range[1]);
        muliplier = generateRandomNumber(max, min);
      }
      let replaceWith = "";
      for (let i = 0; i < muliplier; ++i)
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
      muliplier = 1;
    }
  });
  return chars.join("").replace(/\(|\)|\{\d*\}|\{\d*,\d*\}/g, "");
}
