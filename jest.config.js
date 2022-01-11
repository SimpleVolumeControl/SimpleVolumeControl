module.exports = {
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/(common|components|containers|pages|model|server|utils)/**/*.[jt]s?(x)',
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
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
      },
      displayName: 'client',
      setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/(components|containers|pages)/**/__tests__/**/*.[jt]s?(x)',
        '<rootDir>/(components|containers|pages)/**/?(*.)+(spec|test).[jt]s?(x)',
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
