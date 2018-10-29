import { __, getArgs, hasPlaceholder } from '../src/utils';

describe('getArgs', () => {
  it('should determine the complete args to pass when there are none remaining', () => {
    const originalArgs: (number | Placeholder)[] = [1, __, 3];
    const futureArgs: number[] = [2];

    // @ts-ignore
    const result: number[] = getArgs(originalArgs, [...futureArgs]);

    expect(result).toEqual(
      originalArgs.map((arg: number | Placeholder) => {
        return arg !== __ ? arg : futureArgs.shift();
      }),
    );
  });

  it('should determine the complete args to pass when there are remaining', () => {
    const originalArgs: (number | Placeholder)[] = [1, __, 3];
    const futureArgs: number[] = [2, 4];

    // @ts-ignore
    const result: number[] = getArgs(originalArgs, [...futureArgs]);

    expect(result).toEqual(
      originalArgs
        .map((arg: number | Placeholder) => {
          return arg !== __ ? arg : futureArgs.shift();
        })
        .concat(futureArgs),
    );
  });
});

describe('hasPlaceholder', () => {
  it('should be true if the args has a placeholder', () => {
    const args = [1, __, 3];
    const arity = 3;

    // @ts-ignore
    const result = hasPlaceholder(args, arity);

    expect(result).toBe(true);
  });

  it('should be false if the args do not have a placeholder', () => {
    const args = [1, 2, 3];
    const arity = 3;

    // @ts-ignore
    const result = hasPlaceholder(args, arity);

    expect(result).toBe(false);
  });
});
