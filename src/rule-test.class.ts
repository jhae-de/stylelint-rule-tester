import type { LinterOptions, LinterResult, LintResult, Severity, Warning } from 'stylelint';
import stylelint from 'stylelint';
import type { TestCase, TestCaseExpectation } from './type';

/**
 * RuleTest class
 */
export class RuleTest {
  /**
   * The path to the Stylelint config file
   *
   * @type {string}
   */
  protected static configFile: string = '.stylelintrc.yaml';

  /**
   * The default test case expectation
   *
   * @type {TestCaseExpectation}
   */
  protected static readonly defaultExpectation: TestCaseExpectation = {
    errored: false,
    messages: [],
    severities: [],
  };

  /**
   * Returns the currently set Stylelint config file.
   *
   * @return {string}
   */
  public static getConfigFile(): string {
    return this.configFile;
  }

  /**
   * Sets the Stylelint config file.
   *
   * @param {string} configFile The path to the Stylelint config file
   */
  public static setConfigFile(configFile: string): void {
    this.configFile = configFile;
  }

  /**
   * Describes the test cases for a rule.
   *
   * @param {string} ruleName The name of the rule
   * @param {TestCase[]} testCases The test cases
   *
   * @return {Promise<void>}
   */
  public static async describe(ruleName: string, ...testCases: TestCase[]): Promise<void> {
    describe(`Rule '${ruleName}'`, (): void => {
      test.each(testCases)('$name', async (testCase: TestCase): Promise<void> => {
        const linterResult: LinterResult = await this.getLinterResult(testCase);
        const { expect: expectation = this.defaultExpectation }: TestCase = testCase;

        expect(this.getErrored(ruleName, linterResult)).toBe(expectation.errored);
        expect(this.getMessages(ruleName, linterResult)).toStrictEqual(
          expectation.messages.map((message: string): string => `${message} (${ruleName})`),
        );
        expect(this.getSeverities(ruleName, linterResult)).toStrictEqual(expectation.severities);
      });
    });
  }

  /**
   * Runs Stylelint for the given test case and returns a Promise that resolves to the linter result.
   *
   * @param {string} code The code to check for violations
   *
   * @return {Promise<LinterResult>}
   */
  protected static getLinterResult({ code }: TestCase): Promise<LinterResult> {
    return stylelint.lint({
      configFile: this.configFile,
      code,
    } as LinterOptions);
  }

  /**
   * Returns the warnings for a rule from the linter result.
   *
   * @param {string} ruleName The name of the rule
   * @param {LinterResult} linterResult The linter result
   *
   * @return {Warning[]}
   */
  protected static getWarnings(ruleName: string, linterResult: LinterResult): Warning[] {
    return linterResult.results
      .map(({ warnings }: LintResult): Warning[] => warnings)
      .reduce((previous: Warning[], current: Warning[]): Warning[] => previous.concat(current), [])
      .filter((warning: Warning): boolean => warning.rule === ruleName);
  }

  /**
   * Returns true if the linter result for a rule contains an error, otherwise false.
   *
   * @param {string} ruleName The name of the rule
   * @param {LinterResult} linterResult The linter result
   *
   * @return {boolean}
   */
  protected static getErrored(ruleName: string, linterResult: LinterResult): boolean {
    return this.getSeverities(ruleName, linterResult).some((severity: Severity): boolean => severity === 'error');
  }

  /**
   * Returns the messages for a rule from the linter result.
   *
   * @param {string} ruleName The name of the rule
   * @param {LinterResult} linterResult The linter result
   *
   * @return {string[]}
   */
  protected static getMessages(ruleName: string, linterResult: LinterResult): string[] {
    return this.getWarnings(ruleName, linterResult).map(({ text }: Warning): string => text);
  }

  /**
   * Returns the severities for a rule from the linter result.
   *
   * @param {string} ruleName The name of the rule
   * @param {LinterResult} linterResult The linter result
   *
   * @return {Severity[]}
   */
  protected static getSeverities(ruleName: string, linterResult: LinterResult): Severity[] {
    return this.getWarnings(ruleName, linterResult).map(({ severity }: Warning): Severity => severity);
  }
}
