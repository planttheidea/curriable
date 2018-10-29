import { default as defaultCurry, __, curry, uncurry } from '../src';

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
    const method: Function = (a: string, b: string): string[] => [a, b];

    const curried: CurriedFunction = curry(method);

    const a: string = 'a';
    const b: string = 'b';

    const partial: Function = curried(a);

    const result: string[] = partial(b);

    expect(result).toEqual([a, b]);
  });

  it('should make a function curriable based on provided arity', () => {
    const method: Function = (
      a: string,
      b: string,
      ...rest: string[]
    ): string[] => [a, b, ...rest];
    const arity: number = 4;

    const curried: CurriedFunction = curry(method, arity);

    const a: string = 'a';
    const b: string = 'b';
    const c: string = 'c';
    const d: string = 'd';

    const partial1: Function = curried(a);
    const partial2: Function = partial1(b);
    const partial3: Function = partial2(c);

    const result: string[] = partial3(d);

    expect(result).toEqual([a, b, c, d]);
  });
});

describe('uncurry', () => {
  it('should make a curried function uncurried', () => {
    const method: Function = (a: string, b: string): string[] => [a, b];

    const curried: CurriedFunction = curry(method);
    const uncurried: Function = uncurry(curried);

    const a: string = 'a';
    const b: string = 'b';

    expect(uncurried(a)).toEqual([a, undefined]);
    expect(uncurried(a, b)).toEqual([a, b]);
  });
});
