// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    roots: ['<rootDir>/src'], // Especifica que os testes estão dentro da pasta src
    testMatch: ['**/__tests__/**/*.test.ts'], // Padrão para encontrar arquivos de teste
  };
  