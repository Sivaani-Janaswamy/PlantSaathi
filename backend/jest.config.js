module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.vscode/',
    '/CMRIT_Vault/',
    '/dev-containers-user-cli/',
  ],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
