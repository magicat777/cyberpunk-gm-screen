import { describe, it, expect } from 'vitest';

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should test string operations', () => {
    const text = 'Cyberpunk GM Screen';
    expect(text).toContain('Cyberpunk');
    expect(text.toLowerCase()).toBe('cyberpunk gm screen');
  });
});