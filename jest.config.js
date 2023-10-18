/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/node_modules'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
};
