require('@testing-library/jest-dom');
import '@testing-library/jest-dom';


jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

// Mock MutationObserver for jsdom
global.MutationObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  disconnect() {}
};

// Suppress console.warn in tests
beforeAll(() => {
  console.warn = jest.fn();
});

// Clean up mocks after all tests
afterAll(() => {
  jest.restoreAllMocks();
});

// Suppress console.log during tests to avoid unwanted output
const originalConsoleLog = console.log;
beforeEach(() => {
  console.log = jest.fn();
});
afterEach(() => {
  console.log = originalConsoleLog;
});