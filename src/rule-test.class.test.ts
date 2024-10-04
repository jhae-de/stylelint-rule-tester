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
  describe('Errors', (): void => {
    const expectedError: Error = new Error(
      'Though both "code" and "files" are optional, you must have one and cannot have both.',
    );

    test('Without both "code" and "files"', (): void => {
      expect((): void => {
        void RuleTest['getLinterResult']({
          name: '',
        });
      }).toThrow(expectedError);
    });

    test('With both "code" and "files"', (): void => {
      expect((): void => {
        void RuleTest['getLinterResult']({
          name: '',
          code: '',
          files: '',
        });
      }).toThrow(expectedError);
    });
  });
});

describe('RuleTest class', (): void => {
  beforeEach((): void => {
    mocked(stylelint.lint).mockResolvedValue({
      results: [
        {
          warnings: [
            {
              rule: '_rule_name_',
              text: `_linter_result_message_ (_rule_name_)`,
              severity: 'error',
            },
          ],
        },
      ],
    } as ResolvedValue<LinterResult>);
  });

  RuleTest.describe('_rule_name_', {
    name: '_test_case_1_',
    code: '_test_case_code_',
    expect: {
      errored: true,
      messages: ['_linter_result_message_'],
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
              rule: '_rule_name_',
              text: `_linter_result_message_ (_rule_name_)`,
              severity: 'warning',
            },
          ],
        },
      ],
    } as ResolvedValue<LinterResult>);
  });

  RuleTest.describe('_rule_name_', {
    name: '_test_case_2_',
    code: '_test_case_code_',
    expect: {
      errored: false,
      messages: ['_linter_result_message_'],
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

  RuleTest.describe('_rule_name_', {
    name: '_test_case_3_',
    code: '_test_case_code_',
  });

  RuleTest.describe('_rule_name_', {
    name: '_test_case_4_',
    files: '_test_case_file_',
  });
});
