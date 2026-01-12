module.exports = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy'
  },

  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },

  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
