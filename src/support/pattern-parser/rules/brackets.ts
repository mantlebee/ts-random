import { RuleBase } from "./base";

export class BracketsRule extends RuleBase {
  public constructor(updateResult: (value: string) => void) {
    super((text, currentIndex) => {
      if (text[currentIndex] === "(") {
        const endIndex = text.indexOf(")", currentIndex);
        if (endIndex === -1)
          throw new SyntaxError(
            `generateRandomStringFromPattern: closing bracket not found for the one at index ${currentIndex}`,
          );
        const match = text.substring(currentIndex, endIndex + 1);
        const value = text.substring(currentIndex + 1, endIndex);
        return { endIndex, match, value };
      }
      return null;
    }, updateResult);
  }
}
