import { generateRandomNumber } from "@/numbers";
import { RuleBase } from "./base";

export class MonthRule extends RuleBase {
  public constructor(updateResult: (value: string) => void) {
    super((text, currentIndex) => {
      if (/^mm$/.test(text.substring(currentIndex, currentIndex + 2))) {
        const endIndex = currentIndex + 1;
        const value = `${generateRandomNumber(1)}${generateRandomNumber(9, 1)}`;
        return { endIndex, match: "mm", value };
      }
      return null;
    }, updateResult);
  }
}
