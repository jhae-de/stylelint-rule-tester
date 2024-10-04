import type { TestCaseExpectation } from './index';

export type TestCase = {
  name: string;
  code?: string;
  files?: string | string[];
  expect?: TestCaseExpectation;
};
