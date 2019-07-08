import { __, getCurried } from '../src/utils';

const fn = (foo: string, bar: string, baz: string): string[] => [foo, bar, baz];

const standard = getCurried(fn, fn.length);

describe('getCurried - derived arity', () => {
  it('should handle all arguments passed on first call', () => {
    const result = standard('foo', 'bar', 'baz');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle curried application of all arguments', () => {
    const result = standard('foo')('bar')('baz');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle curried application of some arguments', () => {
    const result = standard('foo')('bar', 'baz');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle placeholder arguments', () => {
    const result = standard(__, 'bar', 'baz')('foo');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle placeholder arguments with curried application', () => {
    const result = standard(__, 'bar')(__, 'baz')('foo');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle placeholder arguments with ridiculous application', () => {
    const result = standard(__, __, __)('foo')(__, 'baz')('bar');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });
});

const limited = getCurried(fn, 2);

describe('getCurried - limited arity', () => {
  it('should handle all arguments passed on first call', () => {
    const result = limited('foo', 'bar', 'baz');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle curried application of all arguments', () => {
    const result = limited('foo')('bar');

    expect(result).toEqual(['foo', 'bar', undefined]);
  });

  it('should handle placeholder arguments', () => {
    const result = limited(__, 'bar', 'baz')('foo');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle placeholder arguments with ridiculous application', () => {
    const result = limited(__, __)('foo', __)('bar');

    expect(result).toEqual(['foo', 'bar', undefined]);
  });
});

const restFn = (...args: any[]): any => [].slice.call(args);

const rest = getCurried(restFn, 3);

describe('getCurried - limited arity', () => {
  it('should handle all arguments passed on first call', () => {
    const result = rest('foo', 'bar', 'baz');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

  it('should handle curried application of all arguments', () => {
    const result = rest('foo')('bar')('baz');

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });
});
