import {
  Nullable,
  TokenizerRule,
  TokenizerRuleMatch,
} from "@mantlebee/ts-core";

export class RuleBase implements TokenizerRule {
  public constructor(
    private readonly matchDelegate: TokenizerRule["match"],
    private readonly updateResult: (value: string) => void
  ) {}

  public match(
    text: string,
    currentIndex: number
  ): Nullable<TokenizerRuleMatch> {
    const matchResult = this.matchDelegate(text, currentIndex);
    if (matchResult) this.updateResult(matchResult.value);
    return matchResult;
  }
}
