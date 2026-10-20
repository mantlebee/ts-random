import { RuleBase } from "./base";

/**
 * Copies the current char as it is. It must be the last rule, so it applies
 * only to the chars that are not placeholders, brackets or repeaters.
 */
export class LiteralCharRule extends RuleBase {
  public constructor(updateResult: (value: string) => void) {
    super((text, currentIndex) => {
      const char = text[currentIndex];
      return { endIndex: currentIndex, match: char, value: char };
    }, updateResult);
  }
}
