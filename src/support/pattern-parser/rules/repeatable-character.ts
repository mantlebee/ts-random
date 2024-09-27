import { generateRandomNumber } from "@/numbers";

import { RuleBase } from "./base";

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
        if (/^.\{\d{1,}(,\d{1,})?\}/.test(text.substring(currentIndex))) {
          const endIndex = text.indexOf("}", currentIndex);
          if (endIndex === -1)
            throw "RepeatableCharacterRule ERROR: closing repeat bracket not found!";
          const match = text.substring(currentIndex, endIndex + 1);
          const repeat = getRepeat(match);
          const value = Array.from({ length: repeat }, () => char).join("");
          return { endIndex, match, value };
        }
        return { endIndex: currentIndex, match: char, value: char };
      }
      return null;
    }, updateResult);
  }
}
