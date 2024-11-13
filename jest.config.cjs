// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    roots: ['<rootDir>/src'], 
    testMatch: ['**/__tests__/**/*.test.ts'],
  };
  