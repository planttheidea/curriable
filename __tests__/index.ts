import { default as defaultCurry, __, curry, isPlaceholder, uncurry } from '../src';

describe('exports', () => {
  it('should have all exports present', () => {
    expect(typeof defaultCurry).toBe('function');
    expect(typeof __).toBe('symbol');
    expect(typeof curry).toBe('function');
    expect(typeof uncurry).toBe('function');
  });

  it('should have curry as the default export', () => {
    expect(defaultCurry).toBe(curry);
  });

  it('should have the correct properties on the curry function', () => {
    expect(curry.__).toBe(__);
    expect(curry.uncurry).toBe(uncurry);
  });
});

describe('curry', () => {
  it('should make a function curriable', () => {
    const method = (a: string, b: string): string[] => [a, b];

    const curried = curry(method);

    const a = 'a';
    const b = 'b';

    const partial = curried(a);

    const result = partial(b);

    expect(result).toEqual([a, b]);
  });

  it('should make a function curriable based on provided arity', () => {
    const method = (a: string, b: string, ...rest: string[]): string[] => [a, b, ...rest];
    const arity = 4;

    const curried = curry(method, arity);

    const a: string = 'a';
    const b: string = 'b';
    const c: string = 'c';
    const d: string = 'd';

    const partial1 = curried(a);
    const partial2 = partial1(b);
    const partial3 = partial2(c);

    const result = partial3(d);

    expect(result).toEqual([a, b, c, d]);
  });
});

describe('isPlaceholder', () => {
  it('should return true if the value is a placeholder', () => {
    expect(isPlaceholder(__)).toBe(true);
  });

  it('should return false if the value is not a placeholder', () => {
    const __ = 'something else';

    expect(isPlaceholder(__)).toBe(false);
  });
});

describe('uncurry', () => {
  it('should make a curried function uncurried', () => {
    const method = (a: string, b?: string): string[] => [a, b];

    const curried = curry(method);
    const uncurried = uncurry(curried);

    const a = 'a';
    const b = 'b';

    expect(uncurried(a)).toEqual([a, undefined]);
    expect(uncurried(a, b)).toEqual([a, b]);
  });
});
