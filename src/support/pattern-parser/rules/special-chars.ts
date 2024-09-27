import { getSpecialChars } from "@mantlebee/ts-core";

import { RuleBase } from "./base";

export class SpecialCharRule extends RuleBase {
  public constructor(updateResult: (value: string) => void) {
    super((text, currentIndex) => {
      const specialChars = getSpecialChars();
      const char = text[currentIndex];
      if (specialChars.includes(char))
        return { endIndex: currentIndex, match: char, value: char };
      return null;
    }, updateResult);
  }
}
