/**
 * @constant __ placeholder used when parameters are skipped
 */
export const __: Placeholder =
  typeof Symbol === 'function' ? Symbol('curriable placeholder') : 0xedd1;

/**
 * @function recursiveCurry
 *
 * @description
 * recursively curry over the arguments until all have been resolved
 *
 * @param fn the function to curry
 * @param arity the length of the function to curry until
 * @param args the existing arguments
 * @returns the result of the function call
 */
export function recursiveCurry<Fn extends Handler>(fn: Fn, arity: number, args: any[]): Curry<Fn> {
  return function () {
    const length: number = args.length;

    const newArgs: IArguments = arguments;
    const { length: newArgsLength } = newArgs;

    const combined: any[] = [];

    let newArgsIndex = 0;
    let remaining = arity;
    let value: any;

    if (length) {
      for (let index = 0; index < length; index++) {
        combined[index] = value =
          args[index] === __ && newArgsIndex < newArgsLength
            ? newArgs[newArgsIndex++]
            : args[index];

        if (value !== __) {
          --remaining;
        }
      }
    }

    if (newArgsIndex < newArgsLength) {
      for (; newArgsIndex < newArgsLength; newArgsIndex++) {
        combined[combined.length] = value = newArgs[newArgsIndex];

        if (value !== __ && newArgsIndex < arity) {
          --remaining;
        }
      }
    }

    return remaining > 0 ? recursiveCurry(fn, arity, combined) : fn.apply(this, combined);
  };
}
