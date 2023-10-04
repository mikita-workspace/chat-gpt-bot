import type { Config } from 'jest';

const config: Config = {
  coverageDirectory: 'coverage',
  moduleNameMapper: {
    '@bot/(.*)': '<rootDir>/src/$1',
  },
  preset: 'ts-jest',
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  verbose: true,
  globals: {
    NODE_ENV: 'test',
  },
};

export default config;
