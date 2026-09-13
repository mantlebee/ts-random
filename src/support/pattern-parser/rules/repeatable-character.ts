import {
  getLowercaseChars,
  getNumberChars,
  getUppercaseChars,
} from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers";
import { generateRandomStringFromChars } from "@/support/chars"; // "Circular dependencies" error if imported from `@/support`

import { RuleBase } from "./base";

const CHARS_MAP: Record<string, string> = {
  "0": getNumberChars(),
  A: getUppercaseChars(),
  a: getLowercaseChars(),
};

const getRandomChars = (char: string, length: number) => {
  const chars = CHARS_MAP[char];
  return generateRandomStringFromChars(chars, length);
};

const getRepeat = (match: string) => {
  if (/,/.test(match)) {
    const range = match
      .substring(2, match.length)
      .split(",")
      .map((a) => parseInt(a));
    return generateRandomNumber(range[1], range[0]);
  }
  return parseInt(match.substring(2, match.length));
};

export class RepeatableCharacterRule extends RuleBase {
  public constructor(char: string, updateResult: (value: string) => void) {
    super((text, currentIndex) => {
      if (text[currentIndex] === char) {
        if (/^.\{\d+(,\d+)?\}/.test(text.substring(currentIndex))) {
          const endIndex = text.indexOf("}", currentIndex);
          if (endIndex === -1)
            throw "RepeatableCharacterRule ERROR: closing repeat bracket not found!";
          const match = text.substring(currentIndex, endIndex + 1);
          const repeat = getRepeat(match);
          const value = getRandomChars(char, repeat);
          return { endIndex, match, value };
        }
        const value = getRandomChars(char, 1);
        return { endIndex: currentIndex, match: char, value };
      }
      return null;
    }, updateResult);
  }
}
