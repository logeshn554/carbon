import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Mock window.scrollTo since JSDOM does not implement layout/scrolling
window.scrollTo = () => {};
