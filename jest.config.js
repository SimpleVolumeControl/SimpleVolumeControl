module.exports = {
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/(components|containers|pages|model|server)/**/*.[jt]s?(x)',
    '!<rootDir>/**/__tests__/**/*.[jt]s?(x)',
    '!<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    // Unit tests on a page level don't seem to be very useful.
    // End-to-end testing with Cypress may be more useful for this.
    './server/': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
    './pages/': {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  projects: [
    {
      displayName: 'client',
      setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/(components|containers|pages)/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/(components|containers|pages)/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      collectCoverage: true,
      collectCoverageFrom: [
        '<rootDir>/(components|containers|pages)/**/*.[jt]s?(x)',
      ],
    },
    {
      displayName: 'server',
      testMatch: [
        '<rootDir>/(model|server)/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/(model|server)/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
    },
  ],
};
