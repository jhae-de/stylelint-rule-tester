import stylelint, { LinterResult } from 'stylelint';
import { RuleTest } from './rule-test.class';
import mocked = jest.mocked;
import ResolvedValue = jest.ResolvedValue;

jest.mock('stylelint');

describe('RuleTest class', (): void => {
  test('Getter and setter', (): void => {
    expect(RuleTest.getConfigFile()).toBe('.stylelintrc.yaml');

    RuleTest.setConfigFile('stylelint.config.js');
    expect(RuleTest.getConfigFile()).toBe('stylelint.config.js');
  });
});

describe('RuleTest class', (): void => {
  beforeEach((): void => {
    mocked(stylelint.lint).mockResolvedValue({
      results: [
        {
          warnings: [
            {
              rule: 'at-rule-disallowed-list',
              text: `Unexpected at-rule "import" (at-rule-disallowed-list)`,
              severity: 'error',
            },
          ],
        },
      ],
    } as ResolvedValue<LinterResult>);
  });

  RuleTest.describe('at-rule-disallowed-list', {
    name: 'rejects "@import" rule',
    code: `@import 'test.css';`,
    expect: {
      errored: true,
      messages: ['Unexpected at-rule "import"'],
      severities: ['error'],
    },
  });
});

describe('RuleTest class', (): void => {
  beforeEach((): void => {
    mocked(stylelint.lint).mockResolvedValue({
      results: [
        {
          warnings: [
            {
              rule: 'at-rule-disallowed-list',
              text: `Unexpected at-rule "import" (at-rule-disallowed-list)`,
              severity: 'warning',
            },
          ],
        },
      ],
    } as ResolvedValue<LinterResult>);
  });

  RuleTest.describe('at-rule-disallowed-list', {
    name: 'accepts "@import" rule with severity "warning"',
    code: `@import 'test.css';`,
    expect: {
      errored: false,
      messages: ['Unexpected at-rule "import"'],
      severities: ['warning'],
    },
  });
});

describe('RuleTest class', (): void => {
  beforeEach((): void => {
    mocked(stylelint.lint).mockResolvedValue({
      results: [],
    } as ResolvedValue<LinterResult>);
  });

  RuleTest.describe('at-rule-disallowed-list', {
    name: 'accepts "@other" rules',
    code: `@other 'test.scss';`,
  });
});
