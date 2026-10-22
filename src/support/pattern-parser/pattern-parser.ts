import { Tokenizer } from "@mantlebee/ts-core";

import {
  BracketsRule,
  LiteralCharRule,
  MonthRule,
  RepeatableCharacterRule,
} from "./rules";

export class PatternParser {
  parse(pattern: string): string {
    let result = "";
    const updateResult = (a: string) => (result += a);
    const tokenizer = new Tokenizer([
      new BracketsRule(updateResult),
      new MonthRule(updateResult),
      new RepeatableCharacterRule("0", updateResult),
      new RepeatableCharacterRule("A", updateResult),
      new RepeatableCharacterRule("a", updateResult),
      new LiteralCharRule(updateResult),
    ]);
    tokenizer.tokenize(pattern);
    return result;
  }
}
