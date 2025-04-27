export default {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(js|jsx|mjs|cjs)$': 'babel-jest', // Include .mjs and .cjs
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios)/', // Transform axios
    ],
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  };