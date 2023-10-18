![Version](https://img.shields.io/npm/v/%40jhae/stylelint-rule-tester?label=Version)
![License](https://img.shields.io/github/license/jhae-de/stylelint-rule-tester?label=License)
![Tests](https://img.shields.io/github/actions/workflow/status/jhae-de/stylelint-rule-tester/lint-test.yaml?label=Tests)

# Stylelint Rule Tester

Easily test your [Stylelint](https://github.com/stylelint/stylelint) configuration
with [Jest](https://github.com/jestjs/jest).

## Installation

```bash
npm install --save-dev @jhae/stylelint-rule-tester
```

## Usage

Assuming that your Stylelint configuration file contains the following rule:

```yaml
at-rule-disallowed-list:
  - import
  - debug
```

Your test file for the `at-rule-disallowed-list` rule might look like this:

```typescript
import { RuleTest } from '@jhae/stylelint-rule-tester';

// By default, the rule tester looks for a `.stylelintrc.yaml` configuration file.
// Call `setConfigFile` to set a different configuration file.
RuleTest.setConfigFile('stylelint.config.js');

// Describe the tests by defining the rule to be tested and the test cases.
RuleTest.describe(
  // First pass the name of the rule.
  'at-rule-disallowed-list',
  // Now describe one or more test cases.
  {
    // Give the test case a name.
    name: 'rejects "@import" rule',
    // Place the code to be tested against the configuration file here.
    code: `
      @import "test-1.scss";
      @import "test-2.scss";
    `,
    // Define your expectation.
    expect: {
      // Whether Stylelint should find an error or not.
      errored: true,
      // The messages that Stylelint should return.
      messages: ['Unexpected at-rule "import"', 'Unexpected at-rule "import"'],
      // The severities that Stylelint should return for each message.
      severities: ['error', 'error'],
    },
  },
  {
    name: 'rejects "@debug" rule',
    code: '@debug "Debug";',
    expect: {
      errored: true,
      messages: ['Unexpected at-rule "debug"'],
      severities: ['error'],
    },
  },
  {
    // You can omit the expectation if Stylelint should not find any errors.
    name: 'accepts "@use" rule',
    code: '@use "test.scss";',
  },
);
```

Run the tests.  
The output would look like this:

```shell
Rule 'at-rule-disallowed-list'
  ✓ rejects "@import" rule (1 ms)
  ✓ accepts "@use" rule (1 ms)

```

Check out the [Standard SCSS Stylelint Config repository](https://github.com/jhae-de/stylelint-config-standard-scss) for
more examples.
