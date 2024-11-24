![Version](https://img.shields.io/npm/v/%40jhae/stylelint-rule-tester?label=Version)
![License](https://img.shields.io/github/license/jhae-de/stylelint-rule-tester?label=License&color=lightgrey)
![Tests](https://img.shields.io/github/actions/workflow/status/jhae-de/stylelint-rule-tester/analyze.yaml?label=Tests)
![Coverage](https://img.shields.io/codecov/c/github/jhae-de/stylelint-rule-tester/main?label=Coverage)

> [!WARNING]
> This repository is no longer maintained and was archived on November 24, 2024.
>
> The [Stylelint Rule Tester](https://github.com/jhae-de/stylelint-rule-tester) has been moved
> to [Stylelint Config Verifier](https://github.com/jhae-de/stylelint-config-verifier) and the
> package [@jhae/stylelint-rule-tester](https://www.npmjs.com/package/@jhae/stylelint-rule-tester) has been marked as
> deprecated. Please
> use [@jhae/stylelint-config-verifier](https://www.npmjs.com/package/@jhae/stylelint-config-verifier)
> instead.

---

# Stylelint Rule Tester

Easily test your [Stylelint](https://github.com/stylelint/stylelint) configuration
with [Jest](https://github.com/jestjs/jest).

## Installation

Using npm:

```shell
npm install --save-dev @jhae/stylelint-rule-tester
```

## Usage

### With inline code

Suppose your Stylelint configuration file contains the following rule:

```yaml
at-rule-disallowed-list:
  - debug
  - import
```

Your test file for the `at-rule-disallowed-list` rule could look like this:

```typescript
import { RuleTest } from '@jhae/stylelint-rule-tester';

// By default, the rule tester looks for a '.stylelintrc.yaml' configuration file.
// Call 'setConfigFile' to set a different configuration file.
RuleTest.setConfigFile('stylelint.config.js');

// Describe the tests by defining the rule to be tested and the test cases.
RuleTest.describe(
  // First pass the name of the rule.
  'at-rule-disallowed-list',

  // Now describe one or more test cases.
  {
    // Give the test case a name.
    name: 'Disallow @debug rule',

    // Place the code to be tested against the configuration file here.
    code: '@debug "Debug";',

    // Define your expectation.
    expect: {
      // Whether Stylelint should report an error or not.
      errored: true,

      // The messages that Stylelint should report.
      messages: ['Unexpected at-rule "debug"'],

      // The severities that Stylelint should report for each message.
      severities: ['error'],
    },
  },
  {
    name: 'Disallow @import rule',
    code: `
      @import "test-1.css";
      @import "test-2.css";
    `,
    expect: {
      errored: true,
      messages: ['Unexpected at-rule "import"', 'Unexpected at-rule "import"'],
      severities: ['error', 'error'],
    },
  },
  {
    // You can omit the expectation if Stylelint should not report any errors.
    name: 'Allow @use rule',
    code: '@use "test.scss";',
  },
);
```

Run the tests.  
The output would look like this:

```shell
Rule 'at-rule-disallowed-list'
  ✓ Disallow @debug rule (1 ms)
  ✓ Disallow @import rule (1 ms)
  ✓ Allow @use rule (1 ms)
```

### With files

You also have the option of passing a file to the test case. This is useful for testing overrides, for example.

Suppose your Stylelint configuration file contains the following content:

```yaml
rules:
  at-rule-disallowed-list:
    - import

overrides:
  - files:
      - '*.css'
      - '**/*.css'
    rules:
      at-rule-disallowed-list: null
```

Create a CSS file (for example `at-rule-disallowed-list.css`) with the following content:

```css
@import 'test.css';
```

Your test file could then look like this:

```typescript
import { RuleTest } from '@jhae/stylelint-rule-tester';

RuleTest.describe(
  'at-rule-disallowed-list',
  {
    name: 'Disallow @import rule',
    code: '@import "test.css";',
    expect: {
      errored: true,
      messages: ['Unexpected at-rule "import"'],
      severities: ['error'],
    },
  },
  {
    name: 'Allow @import rule in CSS files',
    files: 'at-rule-disallowed-list.css',
  },
);
```

---

Check out the [Standard SCSS Stylelint Config](https://github.com/jhae-de/stylelint-config-standard-scss) tests for more
examples.
