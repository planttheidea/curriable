import type { Curried, CurriedFn, NormalizeFn } from './internalTypes.js';
import { __ } from './placeholder.js';

export { __ };

function createCurried<Fn extends (...args: any[]) => any, Arity extends number>(
  fn: Fn,
  arity: Arity,
): CurriedFn<Fn, Arity> {
  const curried = function (initialArgs: any[]) {
    return function (this: any, ...nextArgs: any[]): any {
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

          // Only arguments that fill a slot within the arity count toward it.
          if (value !== __ && index < arity) {
            --remaining;
          }
        }
      }

      if (newArgsIndex < newArgsLength) {
        let index = combined.length;

        while (newArgsIndex < newArgsLength) {
          combined[index] = value = nextArgs[newArgsIndex++];

          // Only arguments that fill a slot within the arity count toward it.
          if (value !== __ && index < arity) {
            --remaining;
          }

          ++index;
        }
      }

      return remaining > 0 ? curried(combined) : fn.apply(this, combined);
    };
  };

  return curried([]);
}

/**
 * Get the method passed as a curriable method based on its parameters
 */
export function curry<Fn extends (...args: any[]) => any, Arity extends number = Parameters<Fn>['length']>(
  fn: Fn,
  arityOverride?: Arity,
): number extends Arity ? never : Curried<Fn, NormalizeFn<Fn, Arity>, Arity> {
  const arity = typeof arityOverride === 'number' ? arityOverride : fn.length;
  const curried = createCurried(fn, arity as Arity) as any;

  curried.arity = arity as Arity;
  curried.fn = fn;

  return curried;
}

/**
 * Return a function that is the non-curried version of the fn passed.
 */
export function uncurry<CurriedFn extends Curried<(...args: any[]) => any, (...args: any[]) => any, number>>(
  curried: CurriedFn,
): CurriedFn['fn'] {
  return curried.fn;
}
