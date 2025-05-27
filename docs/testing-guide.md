# Testing Guide - Cyberpunk GM Screen

## Overview
This project uses a comprehensive testing strategy including unit tests, integration tests, E2E tests, accessibility tests, and performance tests.

## Test Structure
```
tests/
├── unit/               # Unit tests (Vitest)
├── e2e/               # End-to-end tests (Playwright)
├── accessibility/     # Accessibility tests
├── performance/       # Performance tests (Lighthouse)
└── setup.ts          # Test configuration
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/panel-demo.spec.ts

# Run with UI mode
npx playwright test --ui

# Run specific browser
npx playwright test --project=chromium
```

### Accessibility Tests
```bash
# Run WCAG compliance tests
node test-accessibility.js

# Run comprehensive test suite
./run-tests.sh
```

### Performance Tests
```bash
# Run Lighthouse performance tests
node tests/performance/lighthouse-test.js
```

## Test Coverage Requirements
- Unit Tests: >80% coverage for critical paths
- E2E Tests: All user journeys covered
- Accessibility: WCAG 2.1 AA compliance
- Performance: Meet defined budgets

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('should behave correctly', () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('user can interact with feature', async ({ page }) => {
  await page.goto('/');
  await page.click('button');
  await expect(page.locator('.result')).toBeVisible();
});
```

## Performance Budgets
- Performance Score: ≥90
- Accessibility Score: ≥95
- First Contentful Paint: <1s
- Largest Contentful Paint: <2s
- Total Blocking Time: <200ms
- Cumulative Layout Shift: <0.1

## CI/CD Integration
Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-deployment

## Debugging Tests
1. **Unit Tests**: Use `console.log` or debugger
2. **E2E Tests**: Use `--debug` flag or `page.pause()`
3. **Performance**: Check detailed Lighthouse reports

## Best Practices
1. Write tests before fixing bugs
2. Keep tests isolated and independent
3. Use descriptive test names
4. Mock external dependencies
5. Test edge cases and error states
6. Maintain test data fixtures

## Common Issues
- **Flaky E2E tests**: Add proper waits
- **Performance variations**: Run multiple times
- **Coverage gaps**: Focus on critical paths
- **False positives**: Verify test logic

## Monitoring
- Track test execution time trends
- Monitor coverage metrics
- Review failure patterns
- Update performance budgets quarterly