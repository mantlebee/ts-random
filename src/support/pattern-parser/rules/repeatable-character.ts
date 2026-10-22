import {
  getLowercaseChars,
  getNumberChars,
  getUppercaseChars,
} from "@mantlebee/ts-core";

import { generateRandomNumber } from "@/numbers";
// Not from `@/strings`, which imports the pattern parser: it would be a cycle.
import { generateRandomStringFromChars } from "@/strings/generate-random-string-from-chars";

import { RuleBase } from "./base";

type RepeatableCharacter = "0" | "A" | "a";

// Getters, not their results: calling them here would run code at module load,
// which bundlers treat as a side effect and never tree-shake.
const CharsMap: Record<RepeatableCharacter, () => string> = {
  "0": getNumberChars,
  A: getUppercaseChars,
  a: getLowercaseChars,
};

const getRandomChars = (char: RepeatableCharacter, length: number) => {
  const chars = CharsMap[char]();
  return generateRandomStringFromChars(chars, length);
};

/**
 * Number of chars of a repeater, `X{n}` or `X{n,M}`: the regex of the rule
 * guarantees one or two numbers. `parseInt` ignores the closing bracket.
 */
const getRepeat = (match: string) => {
  const [min, max = min] = match
    .substring(2)
    .split(",")
    .map((a) => parseInt(a)) as [number, number?];
  return generateRandomNumber(max, min);
};

export class RepeatableCharacterRule extends RuleBase {
  public constructor(
    char: RepeatableCharacter,
    updateResult: (value: string) => void,
  ) {
    super((text, currentIndex) => {
      if (text[currentIndex] === char) {
        if (/^.\{\d+(,\d+)?\}/.test(text.substring(currentIndex))) {
          // The regex guarantees the closing bracket.
          const endIndex = text.indexOf("}", currentIndex);
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
