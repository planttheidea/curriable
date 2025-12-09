import { describe, expect, test } from 'vitest';
import { __, curry, uncurry } from '../src/index.js';

describe('curry', () => {
  test('makes a function curriable', () => {
    const method = (a: string, b: string): string[] => [a, b];

    const curried = curry(method);

    const a = 'a';
    const b = 'b';

    const partial = curried(a);

    const result = partial(b);

    expect(result).toEqual([a, b]);
  });

  test('makes a function curriable based on provided arity', () => {
    const method = (a: string, b: string, ...rest: string[]): string[] => [a, b, ...rest];
    const arity = 4;

    const curried = curry(method, arity);

    const a = 'a';
    const b = 'b';
    const c = 'c';
    const d = 'd';

    const partial1 = curried(a);
    const partial2 = partial1(b);
    const partial3 = partial2(c);

    const result = partial3(d);

    expect(result).toEqual([a, b, c, d]);
  });

  describe('derived arity', () => {
    const fn = (foo: string, bar: string, baz: string): string[] => [foo, bar, baz];
    const derivedArity = curry(fn);

    test('handles all arguments passed on first call', () => {
      const result = derivedArity('foo', 'bar', 'baz');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    test('handles curried application of all arguments', () => {
      const result = derivedArity('foo')('bar')('baz');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    test('handles curried application of some arguments', () => {
      const result = derivedArity('foo')('bar', 'baz');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    test('handles placeholder arguments', () => {
      const result = derivedArity(__, 'bar', 'baz')('foo');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    test('handles placeholder arguments with curried application', () => {
      const result = derivedArity(__, 'bar')(__, 'baz')('foo');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    test('handles placeholder arguments with ridiculous application', () => {
      const result = derivedArity(__, __, __)('foo')(__, 'baz')('bar');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });
  });

  describe('limitedArity arity', () => {
    const fn = (foo: string, bar: string, baz: string): string[] => [foo, bar, baz];
    const limitedArity = curry(fn, 2);

    test('handles all arguments passed on first call', () => {
      const result = limitedArity('foo', 'bar', 'baz');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    test('handles curried application of all arguments', () => {
      const result = limitedArity('foo')('bar');

      expect(result).toEqual(['foo', 'bar', undefined]);
    });

    test('handles placeholder arguments', () => {
      const result = limitedArity(__, 'bar', 'baz')('foo');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    test('handles placeholder arguments with ridiculous application', () => {
      const result = limitedArity(__, __)('foo', __)('bar');

      expect(result).toEqual(['foo', 'bar', undefined]);
    });
  });

  describe('rest arity', () => {
    const fn = (...args: any[]): any => [].slice.call(args);
    const restArity = curry(fn, 3);

    test('handles all arguments passed on first call', () => {
      const result = restArity('foo', 'bar', 'baz');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    test('handles curried application of all arguments', () => {
      const result = restArity('foo')('bar')('baz');

      expect(result).toEqual(['foo', 'bar', 'baz']);
    });
  });
});

describe('uncurry', () => {
  test('makes a curried function uncurried', () => {
    const method = (a: string, b?: string): Array<string | undefined> => [a, b];

    const curried = curry(method);
    const uncurried = uncurry(curried);

    const a = 'a';
    const b = 'b';

    expect(uncurried(a)).toEqual([a, undefined]);
    expect(uncurried(a, b)).toEqual([a, b]);
  });
});
