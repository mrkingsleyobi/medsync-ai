module.exports = {
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!uuid)/'
  ],
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid'),
    '^@mozilla/readability$': '<rootDir>/__mocks__/readability.js',
    '^jsdom$': '<rootDir>/__mocks__/jsdom.js'
  },
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/logs/**',
    '!jest.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/logs/'
  ]
};