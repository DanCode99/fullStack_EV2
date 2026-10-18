import matchers from '@testing-library/jasmine-dom';
import { cleanup } from '@testing-library/react';
import 'bootstrap/dist/css/bootstrap.min.css';

beforeEach(() => {
  const customMatchers = matchers.default?.default || matchers.default || matchers;
  jasmine.getEnv().addMatchers(customMatchers);
});

afterEach(() => {
  cleanup();
});

