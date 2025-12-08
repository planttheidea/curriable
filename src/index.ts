import type { Curried } from './internalTypes.js';
import { __ } from './placeholder.js';

export { __, isPlaceholder } from './placeholder.js';

/**
 * Get the method passed as a curriable method based on its parameters
 */
export function curry<Fn extends (...args: any[]) => any, Arity extends number>(
  fn: Fn,
  arityOverride?: Arity,
): Curried<Fn, Arity> {
  const arity = typeof arityOverride === 'number' ? arityOverride : fn.length;
  const curried = (function (...initialArgs: any[]) {
    return function (this: any, ...nextArgs: any[]) {
      const length: number = initialArgs.length;
      const newArgsLength = nextArgs.length;

      const combined: any[] = [];

      let newArgsIndex = 0;
      let remaining = arity;
      let value: any;

      if (length) {
        let index = -1;

        while (++index < length) {
          combined[index] = value =
            initialArgs[index] === __ && newArgsIndex < newArgsLength ? nextArgs[newArgsIndex++] : initialArgs[index];

          if (value !== __) {
            --remaining;
          }
        }
      }

      if (newArgsIndex < newArgsLength) {
        while (newArgsIndex < newArgsLength) {
          combined[combined.length] = value = nextArgs[newArgsIndex];

          if (value !== __ && newArgsIndex < arity) {
            --remaining;
          }

          ++newArgsIndex;
        }
      }

      return remaining > 0
        ? curried(
            // @ts-expect-error - Allow passing `any[]` to avoid surfacing internal types.
            combined,
          )
        : fn.apply(this, combined);
    };
  })([]) as Curried<Fn, Arity>;

  curried.arity = arity as Arity;
  curried.fn = fn;

  return curried;
}

/**
 * Return a function that is the non-curried version of the fn passed.
 */
export function uncurry<CurriedFn extends Curried<(...args: any[]) => any, number>>(
  curried: CurriedFn,
): CurriedFn['fn'] {
  return curried.fn;
}
