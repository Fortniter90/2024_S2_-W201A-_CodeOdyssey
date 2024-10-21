import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',  // Use jsdom for React testing
    globals: true,         // Automatically import vitest functions like `describe` and `it`
    setupFiles: './src/setupTests.js', // Optional: setup file for additional configuration
  },
});
