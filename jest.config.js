module.exports = {
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    // Unit tests on a page level don't seem to be very useful.
    // Thus, `/server` and `/pages` are excluded.
    // End-to-end testing with Cypress may be more useful for this.
    '<rootDir>/(common|components|hooks|model|utils)/**/*.[jt]s?(x)',
    '!<rootDir>/**/__tests__/**/*.[jt]s?(x)',
    '!<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)',
    '!<rootDir>/model/behringerX32.ts', // TODO Cover the mixer communication via E2E tests.
  ],
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
  projects: [
    {
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
      },
      displayName: 'client',
      setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/(components|hooks|pages)/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/(components|hooks|pages)/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
      moduleNameMapper: {
        '^react$': 'preact/compat',
        '^react-dom/test-utils$': 'preact/test-utils',
        '^react-dom$': 'preact/compat',
        '^react/jsx-runtime$': 'preact/jsx-runtime',
      },
    },
    {
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
      },
      displayName: 'server',
      testMatch: [
        '<rootDir>/(common|model|server|utils)/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/(common|model|server|utils)/**/?(*.)+(spec|test).[jt]s?(x)',
      ],
    },
  ],
};
